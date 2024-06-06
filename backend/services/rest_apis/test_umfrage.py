import json
import jwt
import pytest
import os
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
from models.models import Sitzung, Umfrage
from handlers.umfrage_handler import createSession, deleteSession, deleteUmfrageById
from dotenv import load_dotenv
load_dotenv()

@pytest.fixture
def common_event():
    def _common_event(path_parameters, admin_id="1"):
        return {
            "pathParameters": path_parameters if path_parameters else {},
            "headers": {
                "authorization": "Bearer " + jwt.encode(
                    {"admin_id": admin_id}, 
                    os.environ["SECRET_KEY"],
                    algorithm="HS256"
                )
            }
        }
    return _common_event

@pytest.fixture
def mock_session():
    with patch("handlers.umfrage_handler.Session") as mock_session:
        yield mock_session

@pytest.fixture
def mock_getDecodedTokenFromHeader():
    with patch("handlers.umfrage_handler.getDecodedTokenFromHeader") as mock_getDecodedTokenFromHeader:
        yield mock_getDecodedTokenFromHeader



@pytest.mark.parametrize("umfrage_id, query_result, expected_status, expected_message", [
    ("1", Umfrage(id=1, admin_id=1, titel="Test Umfrage", beschreibung="Eine Testbeschreibung", erstellungsdatum=datetime.now(), status="aktiv", json_text=""), 200, "Umfrage mit ID 1 wurde erfolgreich entfernt."),
    ("2", None, 400, "Umfrage mit ID 2 wurde nicht gefunden."),
    ("3", Exception("Database Error"), 500, "Internal Server Error, contact Backend-Team for more Info"),
])
def test_deleteUmfrageById(mock_getDecodedTokenFromHeader, mock_session, common_event, umfrage_id, query_result, expected_status, expected_message):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter_by.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter_by.return_value.first.return_value = query_result

    event = common_event({"umfrageId": umfrage_id})

    response = deleteUmfrageById(event, None)   

    assert response.get('response_status', response.get('statusCode')) == expected_status
    assert json.loads(response['body'])['message'] == expected_message

    if expected_status == 200:
        mock_session_instance.delete.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.delete.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()



@pytest.mark.parametrize("umfrage_id, query_result, expected_status, expected_message", [
    ("1", Umfrage(id=1, admin_id=1, titel="Test Umfrage", beschreibung="Eine Testbeschreibung", erstellungsdatum=datetime.now(), status="aktiv", json_text=""), 201, "Sitzung created successfully"),
    ("2", None, 404, "Umfrage not found"),
    ("3", Exception("Database Error"), 500, "Internal Server Error, contact Backend-Team for more Info"),
])
def test_createSession(mock_getDecodedTokenFromHeader, mock_session, common_event, umfrage_id, query_result, expected_status, expected_message):
    mock_getDecodedTokenFromHeader.return_value = {
        "admin_id": "1",
    }

    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = query_result

    event = common_event({"umfrageId": umfrage_id})

    response = createSession(event, None)

    assert response['statusCode'] == expected_status
    assert json.loads(response['body'])['message'] == expected_message

    if expected_status == 201:
        mock_session_instance.add.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.add.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()



@pytest.mark.parametrize("sitzung_id, query_result, expected_status, expected_message", [
    ("1", Sitzung(id=1, startzeit=datetime.now(), endzeit=datetime.now() + timedelta(minutes=2), teilnehmerzahl=10, aktiv=True, umfrage_id=1), 200, "Sitzung deleted successfully"),
    ("2", None, 404, "Sitzung not found"),
    ("3", Exception("Database Error"), 500, "Internal Server Error, contact Backend-Team for more Info"),
])
def test_deleteSession(mock_session, common_event, sitzung_id, query_result, expected_status, expected_message):
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if isinstance(query_result, Exception):
        mock_session_instance.query.return_value.filter.return_value.first.side_effect = query_result
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = query_result

    event = common_event({"sitzungId": sitzung_id})

    response = deleteSession(event, None)

    assert response.get('statusCode') == expected_status
    assert json.loads(response['body'])['message'] == expected_message

    if expected_status == 200:
        mock_session_instance.delete.assert_called_once_with(query_result)
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.delete.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status == 500:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()