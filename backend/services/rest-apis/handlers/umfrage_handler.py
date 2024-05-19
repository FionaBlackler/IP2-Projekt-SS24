from datetime import datetime, timedelta
import json
import logging
from jsonschema import SchemaError, ValidationError, validate
from sqlalchemy.orm import sessionmaker

from models.models import Administrator, AntwortOption, Sitzung, Umfrage, Frage
from models.schemas import umfrage_schema
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
            response = {
                "response_status": 200,
                "body": json.dumps({"message": f"Umfrage mit ID {umfrage_id} wurde erfolgreich entfernt."})
            }
        else:
            response = {
                "response_status": 400,
                "body": json.dumps({"message": f"Umfrage mit ID {umfrage_id} wurde nicht gefunden."})
            }
    except Exception as e:
        session.rollback()
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"})
        }
        logger.error(str(e))
    finally:
        session.close()

    return response


def uploadUmfrage(event, context):
    "accepts the json format in the request body and stores it in the database"
    session = Session()

    # verify admin ID is provided in the path and admin exists
    if "admin_id" not in event["queryStringParameters"]:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "admin_id is required"})
        }

    admin_id = event["queryStringParameters"]["admin_id"]
    admin = session.query(Administrator).filter(Administrator.id == admin_id).first()
    if not admin:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "Administrator not found"})
        }

    try:
        if isinstance(event["body"], str):
            body = json.loads(event['body'])
        else:
            # body is already a dict (e.g., when testing locally)
            body = event['body']

        # Validate JSON against schema
        try:
            validate(instance=body, schema=umfrage_schema)
        except ValidationError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"JSON validation error: {e.message}"})

            }
        except SchemaError as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"message": f"JSON schema error: {e.message}"})
            }

        # JSON is valid, map to datamodel
        json_fragen = body["fragen"]
        fragen = []

        for index, f_obj in enumerate(json_fragen):
            frage = Frage(
                local_id=index,
                text=f_obj['frage_text'],
                typ_id=f_obj['art'],
                punktzahl=f_obj['punktzahl']
            )

            # K Questions need special handling
            if f_obj['art'] == 'K':
                frage.bestaetigt = f_obj['kategorien']["bestaetigt"]
                frage.verneint = f_obj['kategorien']["verneint"]

            valid_options = [AntwortOption(text=option, ist_richtig=True) for option in f_obj["richtige_antworten"]]
            invalid_options = [AntwortOption(text=option, ist_richtig=False) for option in f_obj["falsche_antworten"]]
            frage.antwort_optionen = valid_options + invalid_options

            fragen.append(frage)

        # create new Umfrage object
        umfrage = Umfrage(
            admin_id=admin.id,
            titel=body['titel'],
            beschreibung=body['beschreibung'],
            erstellungsdatum=datetime.now(),
            status='aktiv',
            fragen=fragen
        )

        # add the new Umfrage to the session
        session.add(umfrage)

        try:
            session.commit()
        except Exception as e:
            session.rollback()
            return {
                "statusCode": 500,
                "body": json.dumps({"message": f"Database commit error: {str(e)}"})
            }

        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "Umfrage created successfully",
                "umfrage_id": umfrage.id
            })
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Invalid JSON format",
                "line": e.lineno,
                "column": e.colno
            })
        }
    except KeyError as e:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": f"Missing key in JSON: {str(e)}"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": f"Internal server error: {str(e)}"})
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


def getAllUmfragenFromAdmin(event, context):
    session = Session()
    try:
        # Extrahiere die ID aus der URL
        admin_id = event['pathParameters']['id']

        logger.info(f"Deleting Umfrage with ID {admin_id}.")
        umfragen = session.query(Umfrage).filter_by(admin_id=admin_id)

        if umfragen:
            # Konvertiere Umfragen in ein JSON Format
            umfragen_list = []
            for umfrage in umfragen:
                umfrage_json = {
                    "id": umfrage.id,
                    "admin_id": umfrage.admin_id,
                    "titel": umfrage.titel,
                    "beschreibung": umfrage.beschreibung,
                    "erstellungsdatum": str(umfrage.erstellungsdatum),
                    "archivierungsdatum": str(umfrage.archivierungsdatum) if umfrage.archivierungsdatum else None,
                    "status": umfrage.status,
                }
                umfragen_list.append(umfrage_json)

            # Response mit den Umfragen
            response = {
                "statusCode": 200,
                "body": json.dumps({"umfragen": umfragen_list})
            }
        else:
            response = {
                "response_status": 204
            }
    except Exception as e:
        session.rollback()
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"})
        }
        logger.error(str(e))
    finally:
        session.close()

    return response
