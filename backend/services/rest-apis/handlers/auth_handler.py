from datetime import datetime, timedelta
import json
import jwt
import bcrypt
from sqlalchemy.orm import Session, sessionmaker
from pydantic import BaseModel, ValidationError
from models.models import Administrator
from utils.database import create_local_engine


engine = create_local_engine()
# IMPORTANT: This is a simple example and should not be used in production.
SECRET_KEY = "umfragetool2024"

class UserCreateLogin(BaseModel):
    email: str
    password: str

class UserCreateRegister(BaseModel):
    name: str
    email: str
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_token(user_id: int, email: str) -> str:
    payload = {
        "admin_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=2),  # Token expires in 2 hour
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def login(event, context):

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        if isinstance(event["body"], str):
            data = json.loads(event["body"])
        else:
            # body is already a dict (e.g., when testing locally)
            data  = event['body']

        user_data = UserCreateLogin(**data)
    except (json.JSONDecodeError, ValidationError) as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid input format"})
        }

    print(user_data)

    admin = session.query(Administrator).filter(Administrator.email == user_data.email).first()
    if not admin or not verify_password(user_data.password, admin.password):
        return {
            "statusCode": 401,
            "body": json.dumps({"message": "Invalid credentials"})
        }
    token = create_token(admin.id, admin.email)
    return {
        "statusCode": 200,
        "body": json.dumps({"jwt_token": token})
    }

def register(event, context):

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        if isinstance(event["body"], str):
            data = json.loads(event["body"])
        else:
            # body is already a dict (e.g., when testing locally)
            data  = event['body']
            
        user_data = UserCreateRegister(**data)
    except (json.JSONDecodeError, ValidationError) as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid input"})
        }
    
    # check if user already exists
    admin = session.query(Administrator).filter(Administrator.email == user_data.email).first()

    if admin:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "User already exists"})
        }
    
    hashed_password = hash_password(user_data.password)
    admin = Administrator(name=user_data.name, email=user_data.email, password=hashed_password)
    session.add(admin)
    session.commit()

    return {
        "statusCode": 201,
        "body": json.dumps({"message": "User created successfully"})
    }
