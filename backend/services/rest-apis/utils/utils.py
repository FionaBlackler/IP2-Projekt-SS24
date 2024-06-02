import os
import jwt


def getDecodedTokenFromHeader(event):
    auth_header = event.get('headers', {})
    if not auth_header:
        return None
    header = auth_header.get("Authorization")
    token = header.split(" ")[1]

    secret_key = os.environ["SECRET_KEY"]
    decoded_token = jwt.decode(token, secret_key, algorithms=["HS256"])
    return decoded_token
