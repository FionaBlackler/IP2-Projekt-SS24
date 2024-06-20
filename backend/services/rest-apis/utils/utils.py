import os
import jwt


def getDecodedTokenFromHeader(event) -> dict:
    header = event.get("headers", {})
    if not header:
        print("No headers provided in the event")
        raise ValueError("No headers provided in the event")

    auth_header = header.get("authorization")
    if not auth_header:
        print("No authorization header provided")
        raise ValueError("No authorization header provided")

    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        print("The authorization header is formatted incorrectly")
        raise ValueError("The authorization header is formatted incorrectly")

    try:
        decoded_token = jwt.decode(
            token, key=os.environ["SECRET_KEY"], algorithms=["HS256"]
        )
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        print("Token is invalid")
        raise ValueError("Token is invalid")

    if "admin_id" not in decoded_token:
        print("admin_id missing in token")
        raise ValueError(
            "token is invalid"
        )  # Keine genauere Fehlermeldung, ansonsten bietet es leichetere Angriffsmöglichkeiten

    return decoded_token



def getErrorMessage(message="Error", error_code=404):
    """Returns a simple Error Message"""
    return {
        "statusCode": error_code,
        "body": json.dumps({"message": message}),
        "headers": {"Content-Type": "application/json"},
    }
