import json
from jsonschema import SchemaError, ValidationError
import jwt
import pytest
import os
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
from models.models import AntwortOption, Frage, Sitzung, TeilnehmerAntwort, Umfrage
from handlers.umfrage_handler import (
    archiveUmfrage,
    createSession,
    deleteSession,
    deleteUmfrageById,
    endSession,
    getAllSitzungenFromUmfrage,
    getAllUmfragenFromAdmin,
    getQuestionsWithOptions,
    getUmfrage,
    getUmfrageResult,
    saveTeilnehmerAntwort,
    uploadUmfrage,
    isSessionActive,
)
from dotenv import load_dotenv

load_dotenv()


@pytest.fixture
def common_event():
    def _common_event(path_parameters, body=None, admin_id="1"):
        return {
            "pathParameters": path_parameters if path_parameters else {},
            "headers": {
                "authorization": "Bearer "
                + jwt.encode(
                    {"admin_id": admin_id}, os.environ["SECRET_KEY"], algorithm="HS256"
                )
            },
            "body": json.dumps(body) if body else {},
        }

    return _common_event


@pytest.fixture
def mock_session():
    with patch("handlers.umfrage_handler.Session") as mock_session:
        yield mock_session


@pytest.fixture
def mock_getDecodedTokenFromHeader():
    with patch(
        "handlers.umfrage_handler.getDecodedTokenFromHeader"
    ) as mock_getDecodedTokenFromHeader:
        yield mock_getDecodedTokenFromHeader


# Fixed datetime for consistency
fixed_datetime = datetime(2024, 6, 10, 23, 5, 55, 415831)


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_message",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                status="aktiv",
                json_text="",
            ),
            200,
            "Umfrage mit ID 1 wurde erfolgreich entfernt.",
        ),
        ("2", None, 400, "Umfrage mit ID 2 wurde nicht gefunden."),
        (
            "3",
            Exception("Database Error"),
            500,
            "Internal Server Error, contact Backend-Team for more Info",
        ),
    ],
)
def test_deleteUmfrageById(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter_by.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    response = deleteUmfrageById(event, None)

    assert (
        response.get("response_status", response.get("statusCode")) == expected_status
    )
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 200:
        mock_session_instance.delete.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.delete.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.fixture
def mock_validate():
    with patch("handlers.umfrage_handler.validate") as mock_validate:
        yield mock_validate


@pytest.mark.parametrize(
    "body, admin_exists, validation_exception, schema_exception, commit_exception, expected_status, expected_message",
    [
        (
            {
                "titel": "Test Umfrage",
                "beschreibung": "Eine Testbeschreibung",
                "fragen": [
                    {
                        "frage_text": "Test Frage",
                        "art": "A",
                        "punktzahl": 5,
                        "richtige_antworten": ["R1"],
                        "falsche_antworten": ["F1"],
                    }
                ],
            },
            True,
            None,
            None,
            None,
            201,
            "Umfrage created successfully",
        ),
        (
            {
                "titel": "Test Umfrage",
                "beschreibung": "Eine Testbeschreibung",
                "fragen": [
                    {
                        "frage_text": "Test Frage",
                        "art": "A",
                        "punktzahl": 5,
                        "richtige_antworten": ["R1"],
                        "falsche_antworten": ["F1"],
                    }
                ],
            },
            False,
            None,
            None,
            None,
            404,
            "Administrator not found",
        ),
        (
            {
                "titel": "Test Umfrage",
                "beschreibung": "Eine Testbeschreibung",
                "fragen": [
                    {
                        "frage_text": "Test Frage",
                        "art": "A",
                        "punktzahl": 5,
                        "richtige_antworten": ["R1"],
                        "falsche_antworten": ["F1"],
                    }
                ],
            },
            True,
            ValidationError("Invalid"),
            None,
            None,
            400,
            "JSON validation error: Invalid",
        ),
        (
            {
                "titel": "Test Umfrage",
                "beschreibung": "Eine Testbeschreibung",
                "fragen": [
                    {
                        "frage_text": "Test Frage",
                        "art": "A",
                        "punktzahl": 5,
                        "richtige_antworten": ["R1"],
                        "falsche_antworten": ["F1"],
                    }
                ],
            },
            True,
            None,
            SchemaError("Invalid Schema"),
            None,
            500,
            "JSON schema error: Invalid Schema",
        ),
    ],
)
def test_uploadUmfrage(
    mock_getDecodedTokenFromHeader,
    mock_session,
    mock_validate,
    common_event,
    body,
    admin_exists,
    validation_exception,
    schema_exception,
    commit_exception,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {"admin_id": "1"}
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if not admin_exists:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            None
        )
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            MagicMock()
        )

    if validation_exception:
        mock_validate.side_effect = validation_exception
    elif schema_exception:
        mock_validate.side_effect = schema_exception
    else:
        mock_validate.return_value = None

    if commit_exception:
        mock_session_instance.commit.side_effect = commit_exception
    else:
        mock_session_instance.commit.return_value = None

    event = common_event(path_parameters=None, body=body)
    response = uploadUmfrage(event, None)

    assert response["statusCode"] == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 201:
        mock_session_instance.add.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.add.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if (
        expected_status in [400, 500]
        and not validation_exception
        and not schema_exception
    ):
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_message",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                status="aktiv",
                json_text="",
            ),
            201,
            "Sitzung created successfully",
        ),
        ("2", None, 404, "Umfrage not found"),
        (
            "3",
            Exception("Database Error"),
            500,
            "Internal Server Error, contact Backend-Team for more Info",
        ),
    ],
)
def test_createSession(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    response = createSession(event, None)

    assert response["statusCode"] == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 201:
        mock_session_instance.add.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.add.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "sitzung_id, query_result, expected_status, expected_message",
    [
        (
            "1",
            Sitzung(
                id=1,
                startzeit=fixed_datetime,
                endzeit=fixed_datetime + timedelta(minutes=2),
                teilnehmerzahl=10,
                aktiv=True,
                umfrage_id=1,
            ),
            200,
            "Sitzung deleted successfully",
        ),
        ("2", None, 404, "Sitzung not found"),
        (
            "3",
            Exception("Database Error"),
            500,
            "Internal Server Error, contact Backend-Team for more Info",
        ),
    ],
)
def test_deleteSession(
    mock_session,
    common_event,
    sitzung_id,
    query_result,
    expected_status,
    expected_message,
):
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.return_value.first.side_effect = (
            query_result
        )
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            query_result
        )

    event = common_event({"sitzungId": sitzung_id})

    response = deleteSession(event, None)

    assert response.get("statusCode") == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 200:
        mock_session_instance.delete.assert_called_once_with(query_result)
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.delete.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "sitzung_id, query_result, expected_status, expected_message",
    [
        (
            "1",
            Sitzung(
                id=1,
                startzeit=fixed_datetime,
                endzeit=fixed_datetime + timedelta(minutes=2),
                teilnehmerzahl=10,
                aktiv=True,
                umfrage_id=1,
            ),
            200,
            "Sitzung ended successfully",
        ),
        ("2", None, 404, "Sitzung not found"),
        (
            "3",
            Exception("Database Error"),
            500,
            "Internal Server Error, contact Backend-Team for more Info",
        ),
    ],
)
def test_endSession(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    sitzung_id,
    query_result,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            query_result
        )

    event = common_event({"sitzungId": sitzung_id})

    response = endSession(event, None)

    assert response.get("statusCode") == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 200:
        query_result.aktiv = False
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_message",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                status="aktiv",
                json_text="",
                sitzungen=[
                    Sitzung(
                        id=1,
                        startzeit=fixed_datetime,
                        endzeit=fixed_datetime + timedelta(minutes=2),
                        teilnehmerzahl=10,
                        aktiv=True,
                        umfrage_id=1,
                    ),
                    Sitzung(
                        id=2,
                        startzeit=fixed_datetime + timedelta(minutes=2),
                        endzeit=fixed_datetime + timedelta(minutes=4),
                        teilnehmerzahl=10,
                        aktiv=True,
                        umfrage_id=1,
                    ),
                ],
            ),
            200,
            {
                "sitzungen": [
                    {
                        "id": 1,
                        "startzeit": fixed_datetime.strftime("%Y-%m-%d %H:%M:%S.%f"),
                        "endzeit": (fixed_datetime + timedelta(minutes=2)).strftime(
                            "%Y-%m-%d %H:%M:%S.%f"
                        ),
                        "teilnehmerzahl": 10,
                        "aktiv": True,
                    },
                    {
                        "id": 2,
                        "startzeit": (fixed_datetime + timedelta(minutes=2)).strftime(
                            "%Y-%m-%d %H:%M:%S.%f"
                        ),
                        "endzeit": (fixed_datetime + timedelta(minutes=4)).strftime(
                            "%Y-%m-%d %H:%M:%S.%f"
                        ),
                        "teilnehmerzahl": 10,
                        "aktiv": True,
                    },
                ]
            },
        ),
        ("2", None, 404, {"message": "Umfrage not found"}),
        (
            "3",
            Exception("Database Error"),
            500,
            {"message": "Internal Server Error, contact Backend-Team for more Info"},
        ),
    ],
)
def test_getAllSitzungenForUmfrage(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter_by.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    response = getAllSitzungenFromUmfrage(event, None)

    assert response["statusCode"] == expected_status
    if expected_status == 200:
        assert json.loads(response["body"]) == expected_message
    else:
        assert json.loads(response["body"])["message"] == expected_message["message"]

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()
    else:
        mock_session_instance.rollback.assert_not_called()


@pytest.mark.parametrize(
    "admin_id, query_result, expected_status, expected_body",
    [
        (
            "1",
            [
                Umfrage(
                    id=1,
                    admin_id=1,
                    titel="Test Umfrage 1",
                    beschreibung="Eine Testbeschreibung 1",
                    erstellungsdatum=fixed_datetime,
                    status="aktiv",
                    json_text="",
                ),
                Umfrage(
                    id=2,
                    admin_id=1,
                    titel="Test Umfrage 2",
                    beschreibung="Eine Testbeschreibung 2",
                    erstellungsdatum=fixed_datetime,
                    status="aktiv",
                    json_text="",
                ),
            ],
            200,
            {
                "umfragen": [
                    {
                        "id": 1,
                        "admin_id": 1,
                        "titel": "Test Umfrage 1",
                        "beschreibung": "Eine Testbeschreibung 1",
                        "erstellungsdatum": fixed_datetime.strftime(
                            "%Y-%m-%d %H:%M:%S.%f"
                        ),
                        "archivierungsdatum": None,
                        "status": "aktiv",
                        "json_text": "",
                    },
                    {
                        "id": 2,
                        "admin_id": 1,
                        "titel": "Test Umfrage 2",
                        "beschreibung": "Eine Testbeschreibung 2",
                        "erstellungsdatum": fixed_datetime.strftime(
                            "%Y-%m-%d %H:%M:%S.%f"
                        ),
                        "archivierungsdatum": None,
                        "status": "aktiv",
                        "json_text": "",
                    },
                ]
            },
        ),
        ("2", [], 204, {"message": "No Umfragen found for the admin"}),
        (
            "3",
            Exception("Database Error"),
            500,
            {"message": "Internal Server Error, contact Backend-Team for more Info"},
        ),
    ],
)
def test_getAllUmfragenFromAdmin(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    admin_id,
    query_result,
    expected_status,
    expected_body,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": admin_id,
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter_by.side_effect = query_result
    else:
        mock_umfragen = []
        for umfrage_data in query_result:
            mock_umfrage = MagicMock(spec=Umfrage)
            mock_umfrage.to_json.return_value = umfrage_data.to_json()
            mock_umfragen.append(mock_umfrage)
        mock_session_instance.query.return_value.filter_by.return_value.all.return_value = (
            mock_umfragen
        )

    event = common_event({"admin_id": admin_id})

    response = getAllUmfragenFromAdmin(event, None)

    assert (
        response.get("statusCode", response.get("response_status")) == expected_status
    )
    if expected_status == 200:
        assert json.loads(response["body"]) == expected_body
    elif expected_status == 204:
        assert json.loads(response["body"]) == expected_body
    else:
        assert json.loads(response["body"]) == expected_body

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_body",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                archivierungsdatum=None,
                status="aktiv",
                json_text='{"message": "Test"}',
            ),
            200,
            '{"message": "Test"}',
        ),
        ("2", None, 404, json.dumps({"message": "Umfrage not found"})),
        (
            "3",
            Exception("Database Error"),
            500,
            json.dumps(
                {"message": "Internal Server Error, contact Backend-Team for more Info"}
            ),
        ),
    ],
)
def test_getUmfrage(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_body,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    response = getUmfrage(event, None)

    assert response.get("statusCode") == expected_status
    assert response["body"] == expected_body

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_body, archivierungsdatum_initial, archivierungsdatum_final",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                archivierungsdatum=None,
                status="aktiv",
                json_text='{"message": "Test"}',
            ),
            200,
            {
                "id": 1,
                "admin_id": 1,
                "titel": "Test Umfrage",
                "beschreibung": "Eine Testbeschreibung",
                "erstellungsdatum": fixed_datetime.strftime("%Y-%m-%d %H:%M:%S.%f"),
                "archivierungsdatum": fixed_datetime.strftime("%Y-%m-%d %H:%M:%S.%f"),
                "status": "aktiv",
                "json_text": '{"message": "Test"}',
            },
            None,
            True,
        ),
        (
            "2",
            Umfrage(
                id=2,
                admin_id=2,
                titel="Archived Umfrage",
                beschreibung="Eine archivierte Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                archivierungsdatum=fixed_datetime,
                status="archiviert",
                json_text='{"message": "Test"}',
            ),
            200,
            {
                "id": 2,
                "admin_id": 2,
                "titel": "Archived Umfrage",
                "beschreibung": "Eine archivierte Testbeschreibung",
                "erstellungsdatum": fixed_datetime.strftime("%Y-%m-%d %H:%M:%S.%f"),
                "archivierungsdatum": None,
                "status": "archiviert",
                "json_text": '{"message": "Test"}',
            },
            True,
            None,
        ),
        (
            "3",
            None,
            400,
            json.dumps({"message": "Umfrage mit ID 3 wurde nicht gefunden."}),
            None,
            None,
        ),
        (
            "4",
            Exception("Database Error"),
            500,
            json.dumps(
                {"message": "Internal Server Error, contact Backend-Team for more Info"}
            ),
            None,
            None,
        ),
    ],
)
def test_archiveUmfrage(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_body,
    archivierungsdatum_initial,
    archivierungsdatum_final,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter_by.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    if query_result and not isinstance(query_result, Exception):
        query_result.archivierungsdatum = archivierungsdatum_initial

    response = archiveUmfrage(event, None)

    assert response.get("statusCode") == expected_status

    if expected_status == 200:
        umfrage_json = json.loads(response["body"])
        expected_body["archivierungsdatum"] = umfrage_json.get("archivierungsdatum")
        assert umfrage_json == expected_body

        if archivierungsdatum_initial is None:
            assert umfrage_json["archivierungsdatum"] is not None
        else:
            assert umfrage_json["archivierungsdatum"] is None

        mock_session_instance.commit.assert_called_once()
        mock_session_instance.add.assert_called_once_with(query_result)
    elif expected_status == 500:
        mock_session_instance.rollback.assert_called_once()
    else:
        mock_session_instance.commit.assert_not_called()
        mock_session_instance.add.assert_not_called()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, query_result, expected_status, expected_body",
    [
        (
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                archivierungsdatum=None,
                status="aktiv",
                json_text='{"message": "Test"}',
                fragen=[
                    Frage(
                        id=1,
                        local_id=1,
                        umfrage_id=1,
                        text="Frage 1",
                        typ_id="A",
                        punktzahl=10,
                        antwort_optionen=[
                            AntwortOption(id=1, text="Option 1", ist_richtig=True),
                            AntwortOption(id=2, text="Option 2", ist_richtig=False),
                        ],
                    ),
                    Frage(
                        id=2,
                        local_id=2,
                        umfrage_id=1,
                        text="Frage 2",
                        typ_id="B",
                        punktzahl=5,
                        antwort_optionen=[],
                    ),
                ],
            ),
            200,
            {
                "fragen": [
                    {
                        "id": 1,
                        "text": "Frage 1",
                        "typ_id": "A",
                        "punktzahl": 10,
                        "antwort_optionen": [
                            {"id": 1, "text": "Option 1", "ist_richtig": True},
                            {"id": 2, "text": "Option 2", "ist_richtig": False},
                        ],
                    },
                    {
                        "id": 2,
                        "text": "Frage 2",
                        "typ_id": "B",
                        "punktzahl": 5,
                        "antwort_optionen": [],
                    },
                ]
            },
        ),
        ("2", None, 404, {"message": "Umfrage not found"}),
        (
            "3",
            Exception("Database Error"),
            500,
            {"message": "Internal Server Error, contact Backend-Team for more Info"},
        ),
    ],
)
def test_getQuestionsWithOptions(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    query_result,
    expected_status,
    expected_body,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            query_result
        )

    event = common_event({"umfrageId": umfrage_id})

    response = getQuestionsWithOptions(event, None)

    assert response.get("statusCode") == expected_status
    assert json.loads(response["body"]) == expected_body

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()
    else:
        mock_session_instance.rollback.assert_not_called()

    mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "sitzung_id, antworten, sitzung_exists, antwort_option_exists, teilnehmer_antwort_exists, expected_status, expected_message",
    [
        (
            "1",
            [{"antwort_id": 1, "gewaehlteAntwort": True}],
            True,
            True,
            False,
            200,
            "Die Teilnehmerantworten wurde erfolgreich hinzugefügt",
        ),
        (
            "2",
            [{"antwort_id": 2, "gewaehlteAntwort": False}],
            False,
            True,
            False,
            404,
            "Sitzung or AntwortOption not found.",
        ),
        (
            "3",
            [{"antwort_id": 3, "gewaehlteAntwort": True}],
            True,
            False,
            False,
            404,
            "Sitzung or AntwortOption not found.",
        ),
        (
            "4",
            [{"antwort_id": 4, "gewaehlteAntwort": True}],
            True,
            True,
            True,
            200,
            "Die Teilnehmerantworten wurde erfolgreich hinzugefügt",
        ),
        ("5", [], True, True, False, 400, "Invalid request: No answers provided."),
    ],
)
def test_saveTeilnehmerAntwort(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    sitzung_id,
    antworten,
    sitzung_exists,
    antwort_option_exists,
    teilnehmer_antwort_exists,
    expected_status,
    expected_message,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    # Side effects for Sitzungen and AntwortOptionen
    sitzung = Sitzung(id=sitzung_id) if sitzung_exists else None
    if antworten:
        antwort_option = (
            AntwortOption(id=antworten[0]["antwort_id"])
            if antwort_option_exists
            else None
        )
        teilnehmer_antwort = (
            TeilnehmerAntwort(
                sitzung_id=sitzung_id,
                antwort_id=antworten[0]["antwort_id"],
                anzahl_true=0,
                anzahl_false=0,
            )
            if teilnehmer_antwort_exists
            else None
        )

        # Mock query results
        mock_session_instance.query.return_value.filter.return_value.first.side_effect = [
            sitzung,
            antwort_option,
            teilnehmer_antwort,
        ]

    event = common_event({"sitzungId": sitzung_id}, body={"antworten": antworten})

    response = saveTeilnehmerAntwort(event, None)

    assert response.get("statusCode") == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 200:
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    if expected_status != 400:
        mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "umfrage_id, admin_id, umfrage, expected_status, expected_result",
    [
        (
            "1",
            "1",
            Umfrage(
                id=1,
                admin_id=1,
                titel="Test Umfrage",
                beschreibung="Eine Testbeschreibung",
                erstellungsdatum=fixed_datetime,
                status="aktiv",
                json_text="",
                fragen=[
                    Frage(
                        id=1,
                        local_id=0,
                        umfrage_id=1,
                        text="Beispiel Frage",
                        typ_id="P",
                        punktzahl=1,
                        bestaetigt=None,
                        verneint=None,
                        antwort_optionen=[
                            AntwortOption(
                                id=1,
                                text="Option 1",
                                ist_richtig=True,
                                teilnehmer_antworten=[],
                            ),
                            AntwortOption(
                                id=2,
                                text="Option 2",
                                ist_richtig=False,
                                teilnehmer_antworten=[],
                            ),
                        ],
                    )
                ],
            ),
            200,
            {
                "umfrage": {
                    "id": 1,
                    "admin_id": 1,
                    "archivierungsdatum": None,
                    "titel": "Test Umfrage",
                    "beschreibung": "Eine Testbeschreibung",
                    "erstellungsdatum": "2024-06-10 23:05:55.415831",
                    "status": "aktiv",
                    "json_text": "",
                },
                "result": [
                    {
                        "id": 1,
                        "local_id": 0,
                        "umfrage_id": 1,
                        "text": "Beispiel Frage",
                        "typ_id": "P",
                        "punktzahl": 1,
                        "bestaetigt": None,
                        "verneint": None,
                        "antworten": [
                            {
                                "id": 1,
                                "text": "Option 1",
                                "ist_richtig": True,
                                "antwortenTrue": 0,
                                "antwortenFalse": 0,
                            },
                            {
                                "id": 2,
                                "text": "Option 2",
                                "ist_richtig": False,
                                "antwortenTrue": 0,
                                "antwortenFalse": 0,
                            },
                        ],
                    }
                ],
            },
        ),
        ("3", "1", None, 402, {"message": "Umfrage not found"}),
    ],
)
def test_getUmfrageResults(
    mock_getDecodedTokenFromHeader,
    mock_session,
    common_event,
    umfrage_id,
    admin_id,
    umfrage,
    expected_status,
    expected_result,
):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": 1,
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if umfrage is None:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
            None
        )
    else:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
            umfrage
        )

    event = common_event({"umfrageId": 1}, admin_id)

    response, status = getUmfrageResult(event, None)

    assert status == expected_status
    assert response == expected_result

    if umfrage is not None and umfrage.admin_id == admin_id:
        mock_session_instance.close.assert_called_once()


@pytest.mark.parametrize(
    "sitzung_id, query_result, expected_status, expected_response",
    [
        ("1", Sitzung(id=1, aktiv=True), 200, {"status": "active"}),
        ("1", Sitzung(id=1, aktiv=False), 200, {"status": "inactive"}),
        ("2", None, 200, {"status": "No Sitzung was found"}),
    ],
)
def test_isSessionActive(
    mock_session,
    common_event,
    sitzung_id,
    query_result,
    expected_status,
    expected_response,
):
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    mock_session_instance.query.return_value.filter_by.return_value.first.return_value = (
        query_result
    )

    event = common_event({"sitzungId": sitzung_id})

    response, status = isSessionActive(event, None)

    assert status == expected_status
    assert response == expected_response

    mock_session_instance.query.return_value.filter_by.assert_called_once_with(
        id=sitzung_id
    )
    mock_session_instance.close.assert_called_once()
