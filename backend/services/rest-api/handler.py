import json
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Administrator 
from utils.database import create_database_connection

# Database connection with local database
DATABASE_URL = os.environ['DATABASE_URL']
engine = create_engine(DATABASE_URL, echo=True)

# Database connection with aws secrets manager
#engine, Session = create_database_connection()

def create_database(event, context):
    Base.metadata.create_all(engine)
    body = {
        "message": "Database tables created successfully!"
    }
    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response

def add_data(event, context):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        new_admin = Administrator(email='admin@example.com', name='Admin User', password='securepass')
        session.add(new_admin)
        session.commit()
        body = {
            "message": "New administrator added successfully!"
        }
        response_status = 200
    except Exception as e:
        session.rollback()
        body = {
            "message": str(e)
        }
        response_status = 400
    finally:
        session.close()

    response = {
        "statusCode": response_status,
        "body": json.dumps(body)
    }
    return response