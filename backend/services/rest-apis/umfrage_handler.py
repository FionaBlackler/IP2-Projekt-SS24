from datetime import datetime, timedelta
import json
import logging
from sqlalchemy.orm import sessionmaker

from models.models import AntwortOption, Sitzung, Umfrage, Frage
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

def uploadUmfrage(event, context):
    "accepts the json format in the request body and stores it in the database"
    session = Session()

    # try to parse and map the json to our datamodel, return 400 if it fails
    try:

        # get body of request
        body = json.loads(event['body'])

        json_fragen = body["fragen"]

        fragen = []
        for f_obj in json_fragen:
            frage = Frage(
                local_id=f_obj['frage_id'],
                text=f_obj['frage_text'],
                typ_id=f_obj['art'],
                punktzahl=f_obj['punktzahl']
            )
        
            # K Questions need special handling
            if f_obj['art'] == 'K':
                frage.bestaetigt =  f_obj['richtige_anworten']["bestaetigt"]
                frage.verneint = f_obj['richtige_anworten']["verneint"]

            valid_options = [AntwortOption(text=option, ist_richtig=True) for option in f_obj["richtige_anworten"]]
            invalid_options = [AntwortOption(text=option, ist_richtig=False) for option in f_obj["falsche_antworten"]]

        # create new Umfrage object
        umfrage = Umfrage(
            titel=body['titel'],
            beschreibung=body['beschreibung'],
            erstellungsdatum=datetime.now(),
            status='aktiv',
            fragen=fragen
        )

        # add the new Umfrage to the session
        session.add(umfrage)
        session.commit()

        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "Umfrage created successfully",
                "umfrage_id": umfrage.id
            })
        }

    except:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid JSON format"})
        }


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