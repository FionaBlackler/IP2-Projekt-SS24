import os
from datetime import datetime, timedelta
import json
import jwt
import bcrypt
import logging
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, ValidationError
from models.models import Administrator
from utils.database import create_local_engine
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

engine = create_local_engine()
# IMPORTANT: This is a simple example and should not be used in production.
# moved this into .env please configure it there.
SECRET_KEY = "umfragetool2024"
OUTLOOK_SMTP_SERVER = "smtp.office365.com"
OUTLOOK_SMTP_PORT = 587
OUTLOOK_EMAIL = os.getenv("OUTLOOK_EMAIL")
OUTLOOK_PASSWORD = os.getenv("OUTLOOK_PASSWORD")
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
    session = Session()
    try:
        # Parse the input
        if isinstance(event["body"], str):
            data = json.loads(event["body"])
        else:
            data = event['body']
        
        user_data = UserCreateLogin(**data)

        # Query the database
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
    
    except (json.JSONDecodeError, ValidationError):
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid input format"}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        logger.error(str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        session.close()


def register(event, context):
    session = Session()
    try:
        # Parse the input
        if isinstance(event["body"], str):
            data = json.loads(event["body"])
        else:
            data = event['body']

        user_data = UserCreateRegister(**data)
        
        # Check if user already exists
        admin = session.query(Administrator).filter(Administrator.email == user_data.email).first()
        if admin:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "User already exists"}),
                "headers": {"Content-Type": "application/json"}
            }
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        admin = Administrator(name=user_data.name, email=user_data.email, password=hashed_password)
        session.add(admin)
        session.commit()

        return {
            "statusCode": 201,
            "body": json.dumps({"message": "User created successfully"}),
            "headers": {"Content-Type": "application/json"}
        }
    
    except (json.JSONDecodeError, ValidationError):
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid input"}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        logger.error(str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        session.close()


def change_password(event, context):
    with Session() as session:
        try:
            if isinstance(event["body"], str):
                data = json.loads(event["body"])
            else:
                # body is already a dict (e.g., when testing locally)
                data = event['body']
            
            email = data.get('email')
            old_password = data.get('oldPassword')
            new_password = data.get('newPassword')
            
            if not all([email, old_password, new_password]):
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing required fields"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            admin = session.query(Administrator).filter(Administrator.email == email).first()
            if not admin or not verify_password(old_password, admin.password):
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Invalid credentials"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            hashed_new_password = hash_password(new_password)
            admin.password = hashed_new_password
            session.commit()
            
            token = create_token(admin.id, admin.email)
            return {
                "statusCode": 200,
                "body": json.dumps({"jwt_token": token}),
                "headers": {"Content-Type": "application/json"}
            }
        
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
def send_reset_email(email, token):
    subject = "Password Reset Request"
    body_html = f"""
    <html>
        <body>
            <p>Dear User,</p>
            <p>We received a request to reset your password. Please click the link below to reset your password:</p>
            <p><a href="http://localhost:5173/setPassword?token={token}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
        </body>
    </html>
    """
    
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = OUTLOOK_EMAIL
    message["To"] = email

    part2 = MIMEText(body_html, "html")
    message.attach(part2)

    try:
        with smtplib.SMTP(OUTLOOK_SMTP_SERVER, OUTLOOK_SMTP_PORT) as server:
            server.starttls()
            server.login(OUTLOOK_EMAIL, OUTLOOK_PASSWORD)
            server.sendmail(OUTLOOK_EMAIL, email, message.as_string())
        print("Email sent!")
    except Exception as e:
        print("Error sending email: ", e)

def forgot_password(event, context):
    with Session() as session:
        try:
            data = json.loads(event["body"]) if isinstance(event["body"], str) else event['body']
            email = data.get('email')

            if not email:
                return {"statusCode": 400, "body": json.dumps({"message": "Email address is required"}), "headers": {"Content-Type": "application/json"}}

            admin = session.query(Administrator).filter(Administrator.email == email).first()
            if not admin:
                return {"statusCode": 404, "body": json.dumps({"message": "User not found"}), "headers": {"Content-Type": "application/json"}}

            payload = {
                "email": email,
                "exp": datetime.utcnow() + timedelta(hours=2),
                "iat": datetime.utcnow()
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            send_reset_email(email, token)

            return {"statusCode": 200, "body": json.dumps({"message": "Password reset instructions sent to your email"}), "headers": {"Content-Type": "application/json"}}
        except Exception as e:
            logger.error(str(e))
            return {"statusCode": 500, "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}), "headers": {"Content-Type": "application/json"}}


def set_password(event, context):
    with Session() as session:
        try:
            if isinstance(event["body"], str):
                data = json.loads(event["body"])
            else:
                # body is already a dict (e.g., when testing locally)
                data = event['body']
            
            email = data.get('email')
            new_password = data.get('newPassword')
            
            if not all([email, new_password]):
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing required fields"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            admin = session.query(Administrator).filter(Administrator.email == email).first()
            if not admin:
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Invalid credentials"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            hashed_new_password = hash_password(new_password)
            admin.password = hashed_new_password
            session.commit()
            
            token = create_token(admin.id, admin.email)
            return {
                "statusCode": 200,
                "body": json.dumps({"jwt_token": token}),
                "headers": {"Content-Type": "application/json"}
            }
        
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

def delete_account(event, context):
    with Session() as session:
        try:
            if isinstance(event["body"], str):
                data = json.loads(event["body"])
            else:
                # body is already a dict (e.g., when testing locally)
                data = event['body']
            
            email = data.get('email')
            password = data.get('password')
            
            if not all([email, password]):
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing required fields"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            admin = session.query(Administrator).filter(Administrator.email == email).first()
            if not admin or not verify_password(password, admin.password):
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Invalid credentials"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            session.delete(admin)
            session.commit()
            
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Account deleted successfully"}),
                "headers": {"Content-Type": "application/json"}
            }
        
        except Exception as e:
            logger.error(str(e))
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
