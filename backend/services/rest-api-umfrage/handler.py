import json
from sqlalchemy.orm import sessionmaker

from backend.models.models import Umfrage
from backend.utils.database import create_local_engine

engine = create_local_engine()


# Database connection with aws secrets manager
# engine, Session = create_database_connection()

def deleteUmfrageById(event, context):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        # Extrahiere die ID aus der URL
        umfrage_id = event['pathParameters']['id']
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
