from datetime import datetime, timedelta
import json
import logging
import os
import sys
from sqlalchemy.orm import sessionmaker

# change sys path to import modules from parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models.models import Sitzung, Umfrage
from utils.database import create_local_engine

engine = create_local_engine()
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger()

# Database connection with aws secrets manager
# engine, Session = create_database_connection()
Session = sessionmaker(bind=engine)

def deleteUmfrageById(event, context):
    session = Session()
    try:
        # Extrahiere die ID aus der URL
        umfrage_id = event['pathParameters']['id']
        
        logger.info(f"Deleting Umfrage with ID {umfrage_id}.")

        # finde die Umfrage in der Datenbank
        umfrage = session.query(Umfrage).filter_by(id=umfrage_id).first()

        if umfrage:
            # Lösche die Umfrage aus der Datenbank
            session.delete(umfrage)
            session.commit()
            # Erstelle die Antwort
            body = {
                "message": f"Umfrage mit ID {umfrage_id} wurde erfolgreich gelöscht.",
                "input": event,
            }
        else:
            body = {
                "message": f"Umfrage mit ID {umfrage_id} wurde nicht gefunden.",
                "input": event,
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

def createSession(event, context):
    session = Session()

    # Check if 'id' parameter is provided in the path
    if 'pathParameters' not in event or 'id' not in event['pathParameters']:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Umfrage ID is required"})
        }

    umfrage_id = event['pathParameters']['id']

    # Verify the Umfrage exists
    umfrage = session.query(Umfrage).filter(Umfrage.id == umfrage_id).first()
    if not umfrage:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "Umfrage not found"})
        }

    # Set session length (e.g., 15 minutes)
    session_length_minutes = 15
    start_time = datetime.now()
    end_time = start_time + timedelta(minutes=session_length_minutes)

    # Create a new Sitzung (Session)
    sitzung = Sitzung(
        startzeit=start_time,
        endzeit=end_time,
        teilnehmerzahl=0,
        umfrage_id=umfrage.id
    )
    session.add(sitzung)
    session.commit()

    return {
        "statusCode": 201,
        "body": json.dumps({
            "message": "Sitzung created successfully",
            "sitzung_id": sitzung.id,
            "startzeit": start_time.isoformat(),
            "endzeit": end_time.isoformat()
        })
    }