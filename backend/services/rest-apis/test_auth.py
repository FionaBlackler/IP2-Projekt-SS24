import pytest
from unittest.mock import patch, MagicMock
from handlers.auth_handler import (
    login,
    register,
    hash_password,
)
import json


@pytest.fixture
def common_event():
    def _common_event(body):
        return {"body": json.dumps(body)}

    return _common_event


@pytest.fixture
def mock_session():
    with patch("handlers.auth_handler.Session") as mock_session:
        yield mock_session


@pytest.fixture
def mock_create_token():
    with patch("handlers.auth_handler.create_token") as mock_create_token:
        yield mock_create_token


@pytest.fixture
def mock_hash_password():
    with patch("handlers.auth_handler.hash_password") as mock_hash_password:
        yield mock_hash_password


@pytest.fixture
def mock_verify_password():
    with patch("handlers.auth_handler.verify_password") as mock_verify_password:
        yield mock_verify_password


@pytest.mark.parametrize(
    "body, admin_exists, password_correct, expected_status, expected_message",
    [
        (
            {"email": "test@example.com", "password": "password123"},
            True,
            True,
            200,
            "jwt_token",
        ),
        (
            {"email": "test@example.com", "password": "password123"},
            True,
            False,
            401,
            "Invalid credentials",
        ),
        (
            {"email": "test@example.com", "password": "password123"},
            False,
            None,
            401,
            "Invalid credentials",
        ),
        (
            {"username": "invalid", "password": "password123"},
            None,
            None,
            400,
            "Invalid input format",
        ),
    ],
)
def test_login(
    mock_session,
    mock_create_token,
    mock_verify_password,
    common_event,
    body,
    admin_exists,
    password_correct,
    expected_status,
    expected_message,
):
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if admin_exists:
        admin_mock = MagicMock()
        admin_mock.password = hash_password("password123")
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            admin_mock
        )
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            None
        )

    mock_verify_password.return_value = password_correct
    mock_create_token.return_value = "mocked_token"

    event = common_event(body)
    response = login(event, None)

    assert response["statusCode"] == expected_status
    if expected_status == 200:
        assert "jwt_token" in json.loads(response["body"])
    else:
        assert json.loads(response["body"])["message"] == expected_message


@pytest.mark.parametrize(
    "body, admin_exists, expected_status, expected_message",
    [
        (
            {
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
            },
            True,
            400,
            "User already exists",
        ),
        (
            {
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
            },
            False,
            201,
            "User created successfully",
        ),
        (
            {"username": "Test User", "email": "invalid", "password": "password123"},
            None,
            400,
            "Invalid input",
        ),
    ],
)
def test_register(
    mock_session,
    mock_hash_password,
    common_event,
    body,
    admin_exists,
    expected_status,
    expected_message,
):
    mock_session_instance = MagicMock()
    mock_session.return_value = mock_session_instance

    if admin_exists:
        admin_mock = MagicMock()
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            admin_mock
        )
    else:
        mock_session_instance.query.return_value.filter.return_value.first.return_value = (
            None
        )

    mock_hash_password.return_value = "hashed_password"

    event = common_event(body)
    response = register(event, None)

    assert response["statusCode"] == expected_status
    assert json.loads(response["body"])["message"] == expected_message

    if expected_status == 201:
        mock_session_instance.add.assert_called_once()
        mock_session_instance.commit.assert_called_once()
    else:
        mock_session_instance.add.assert_not_called()
        mock_session_instance.commit.assert_not_called()

    if expected_status in [500]:
        mock_session_instance.rollback.assert_called_once()

    mock_session_instance.close.assert_called_once()
