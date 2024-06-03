import os
from datetime import datetime, timedelta
import json
import jwt
import bcrypt
import logging
from sqlalchemy.orm import Session, sessionmaker
from pydantic import BaseModel, ValidationError
from models.models import Administrator
from utils.database import create_local_engine

engine = create_local_engine()
# IMPORTANT: This is a simple example and should not be used in production.
# moved this into .env please configure it there.
SECRET_KEY = "umfragetool2024"

# Database connection with aws secrets manager
# engine, Session = create_database_connection()
Session = sessionmaker(bind=engine)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger()

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
    secret_key = os.environ["SECRET_KEY"]
    if not secret_key:
        print("SECRET_KEY not set, please add it to .env")
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def login(event, context):

    with Session() as session:
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
                "body": json.dumps({"message": "Invalid input format"}),
                "headers": {"Content-Type": "application/json"}
            }
        try:
            admin = session.query(Administrator).filter(Administrator.email == user_data.email).first()
            if not admin or not verify_password(user_data.password, admin.password):
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Invalid credentials"}),
                    "headers": {"Content-Type": "application/json"}
                }
            token = create_token(admin.id, admin.email)
            return {
                "statusCode": 200,
                "body": json.dumps({"jwt_token": token}),
                "headers": {"Content-Type": "application/json"}
            }
        except Exception as e:
            logger.error(str(e))
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

def register(event, context):

    with Session() as session:
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
                "body": json.dumps({"message": "Invalid input"}),
                "headers": {"Content-Type": "application/json"}
            }
        
        try:
            # check if user already exists
            admin = session.query(Administrator).filter(Administrator.email == user_data.email).first()
            if admin:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "User already exists"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            hashed_password = hash_password(user_data.password)
            admin = Administrator(name=user_data.name, email=user_data.email, password=hashed_password)
            session.add(admin)
            session.commit()

            return {
                "statusCode": 201,
                "body": json.dumps({"message": "User created successfully"}),
                "headers": {"Content-Type": "application/json"}
            }
        
        except Exception as e:
            logger.error(str(e))
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
