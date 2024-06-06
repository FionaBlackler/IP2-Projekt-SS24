import json
import os
import jwt

def getDecodedTokenFromHeader(event) -> dict:
    auth_header = event.get('headers', {})
    if not auth_header:
        return None
    header = auth_header.get("authorization")
    token = header.split(" ")[1]
    try:
        decoded_token = jwt.decode(token, key=os.environ["SECRET_KEY"], algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "No Authorization Header"}),
            "headers": {"Content-Type": "application/json"}
        }
    return decoded_token
