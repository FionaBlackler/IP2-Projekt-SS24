import os
from datetime import datetime, timedelta
import json
import logging
from jsonschema import SchemaError, ValidationError, validate
from sqlalchemy.orm import sessionmaker
import jwt
from models.models import Administrator, AntwortOption, Sitzung, Umfrage, Frage, TeilnehmerAntwort
from models.schemas import umfrage_schema
from utils.utils import getDecodedTokenFromHeader
from utils.database import create_local_engine

engine = create_local_engine()
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger()

# Database connection with aws secrets manager
# engine, Session = create_database_connection()
Session = sessionmaker(bind=engine)


# Helper Methode um Umfragen in Json umzuwandeln
def create_umfrage_as_json(umfrage: Umfrage):
    # Convert Umfrage object to JSON
    return {
        "id": umfrage.id,
        "admin_id": umfrage.admin_id,
        "titel": umfrage.titel,
        "beschreibung": umfrage.beschreibung,
        "erstellungsdatum": str(umfrage.erstellungsdatum),
        "archivierungsdatum": str(umfrage.archivierungsdatum) if umfrage.archivierungsdatum else None,
        "status": umfrage.status,
    }


def deleteUmfrageById(event, context):
    session = Session()
    try:
        # Extrahiere die ID aus der URL
        umfrage_id = event['pathParameters']['umfrageId']

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
                "body": json.dumps({"message": f"Umfrage mit ID {umfrage_id} wurde erfolgreich entfernt."}),
                "headers": {"Content-Type": "application/json"}
            }
        else:
            response = {
                "response_status": 400,
                "body": json.dumps({"message": f"Umfrage mit ID {umfrage_id} wurde nicht gefunden."}),
                "headers": {"Content-Type": "application/json"}
            }
    except Exception as e:
        session.rollback()
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
            "headers": {"Content-Type": "application/json"}
        }
        logger.error(str(e))
    finally:
        session.close()

    return response


def uploadUmfrage(event, context):
    "accepts the json format in the request body and stores it in the database"
    decoded_token = getDecodedTokenFromHeader(event)
    if decoded_token is None:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "No Authorization Header"}),
            "headers": {"Content-Type": "application/json"}
        }
    try:
        admin_id = decoded_token['admin_id']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'admin_id' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            admin = session.query(Administrator).filter(Administrator.id == admin_id).first()
            if not admin:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Administrator not found"}),
                    "headers": {"Content-Type": "application/json"}
                }

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
                    "body": json.dumps({"message": f"JSON validation error: {e.message}"}),
                    "headers": {"Content-Type": "application/json"}
                }
            except SchemaError as e:
                return {
                    "statusCode": 500,
                    "body": json.dumps({"message": f"JSON schema error: {e.message}"}),
                    "headers": {"Content-Type": "application/json"}
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
                invalid_options = [AntwortOption(text=option, ist_richtig=False) for option in
                                   f_obj["falsche_antworten"]]
                frage.antwort_optionen = valid_options + invalid_options

                fragen.append(frage)

            # create new Umfrage object
            umfrage = Umfrage(
                admin_id=admin.id,
                titel=body['titel'],
                beschreibung=body['beschreibung'],
                erstellungsdatum=datetime.now(),
                status='aktiv',
                fragen=fragen,
                json_text=json.dumps(body)
            )

            # add the new Umfrage to the session
            session.add(umfrage)

            try:
                session.commit()
            except Exception as e:
                session.rollback()
                logger.error("Database commit error: %s", str(e))
                return {
                    "statusCode": 500,
                    "body": json.dumps({"message": f"Database commit error: {str(e)}"}),
                    "headers": {"Content-Type": "application/json"}
                }

            return {
                "statusCode": 201,
                "body": json.dumps({
                    "message": "Umfrage created successfully",
                    "umfrage_id": umfrage.id
                }),
                "headers": {"Content-Type": "application/json"}
            }

        except json.JSONDecodeError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": "Invalid JSON format",
                    "line": e.lineno,
                    "column": e.colno
                }),
                "headers": {"Content-Type": "application/json"}
            }
        except KeyError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": f"Missing key in JSON: {str(e)}"
                }),
                "headers": {"Content-Type": "application/json"}
            }
        except Exception as e:
            logger.error("Internal server error: %s", str(e))
            return {
                "statusCode": 500,
                "body": json.dumps({"message": f"Internal server error: {str(e)}"}),
                "headers": {"Content-Type": "application/json"}
            }


def createSession(event, context):
    try:
        umfrage_id = event['pathParameters']['umfrageId']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'umfrageId' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            # Verify the Umfrage exists
            umfrage = session.query(Umfrage).filter(Umfrage.id == umfrage_id).first()
            if not umfrage:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Umfrage not found"}),
                    "headers": {"Content-Type": "application/json"}
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

            response = {
                "statusCode": 201,
                "body": json.dumps({
                    "message": "Sitzung created successfully",
                    "sitzung_id": sitzung.id,
                    "startzeit": start_time.isoformat(),
                    "endzeit": end_time.isoformat()
                }),
                "headers": {"Content-Type": "application/json"}
            }
        except Exception as e:
            session.rollback()
            logger.error("Error creating Sitzung: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response


def deleteSession(event, context):
    try:
        sitzung_id = event['pathParameters']['sitzungId']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'sitzungId' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            # Verify the Sitzung exists
            sitzung = session.query(Sitzung).filter(Sitzung.id == sitzung_id).first()
            if not sitzung:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Sitzung not found"}),
                    "headers": {"Content-Type": "application/json"}
                }

            session.delete(sitzung)
            session.commit()

            response = {
                "statusCode": 200,
                "body": json.dumps({"message": "Sitzung deleted successfully"}),
                "headers": {"Content-Type": "application/json"}
            }

        except Exception as e:
            session.rollback()
            logger.error("Error deleting Sitzung: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response


def endSession(event, context):
    try:
        sitzung_id = event['pathParameters']['sitzungId']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'sitzungId' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            # Verify the Sitzung exists
            sitzung = session.query(Sitzung).filter(Sitzung.id == sitzung_id).first()
            if not sitzung:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Sitzung not found"}),
                    "headers": {"Content-Type": "application/json"}
                }

            sitzung.aktiv = False
            session.commit()

            response = {
                "statusCode": 200,
                "body": json.dumps({"message": "Sitzung ended successfully"}),
                "headers": {"Content-Type": "application/json"}
            }

        except Exception as e:
            session.rollback()
            logger.error("Error ending Sitzung: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response


def getAllUmfragenFromAdmin(event, context):
    decoded_token = getDecodedTokenFromHeader(event)
    with Session() as session:
        try:
            admin_id = decoded_token['admin_id']

            logger.info(f"Get all Umfragen from Admin with ID {admin_id}.")
            umfragen = session.query(Umfrage).filter_by(admin_id=admin_id)

            if umfragen:
                # Konvertiere Umfragen in ein JSON Format
                umfragen_list = []
                for umfrage in umfragen:
                    umfrage_json = create_umfrage_as_json(umfrage)
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
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
            logger.error(str(e))
        finally:
            session.close()

    return response


def getUmfrage(event, context):
    """Get the full original JSON of a Umfrage by ID"""

    try:
        umfrage_id = event['pathParameters']['id']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'id' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            umfrage = session.query(Umfrage).filter(Umfrage.id == umfrage_id).first()

            if umfrage:
                response = {
                    "statusCode": 200,
                    "body": umfrage.json_text,
                    "headers": {"Content-Type": "application/json"}
                }
            else:
                response = {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Umfrage not found"}),
                    "headers": {"Content-Type": "application/json"}
                }
        except Exception as e:
            session.rollback()
            logger.error("Error querying Umfrage: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response


def archiveUmfrage(event, context):
    with Session() as session:
        try:
            # Extrahiere die ID aus der URL
            umfrage_id = event['pathParameters']['umfrageId']

            logger.info(f"Archive Umfrage with ID {umfrage_id}.")

            # finde die Umfrage in der Datenbank
            umfrage = session.query(Umfrage).filter_by(id=umfrage_id).first()

            if umfrage:
                if umfrage.archivierungsdatum:
                    # remove Archivierungsdatum
                    umfrage.archivierungsdatum = None
                    logger.info(f"Umfrage mit ID {umfrage_id} wurde erfolgreich aus dem Archiv entfernt")
                else:
                    # Add Archivierungsdatum
                    umfrage.archivierungsdatum = datetime.now()
                    logger.info(f"Umfrage mit ID {umfrage_id} wurde erfolgreich archiviert")

                session.add(umfrage)
                session.commit()

                # Convert Umfrage object to JSON
                umfrage_json = create_umfrage_as_json(umfrage)

                response = {
                    "statusCode": 200,
                    "body": json.dumps(umfrage_json),
                    "headers": {"Content-Type": "application/json"}
                }

            else:
                response = {
                    "statusCode": 400,
                    "body": json.dumps({"message": f"Umfrage mit ID {umfrage_id} wurde nicht gefunden."}),
                    "headers": {"Content-Type": "application/json"}
                }

        except Exception as e:
            session.rollback()
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
            logger.error(str(e))
        finally:
            session.close()

    return response


def getQuestionsWithOptions(event, context):
    """Get all Fragen with AntwortOptionen for a given Umfrage ID"""
    try:
        umfrage_id = event['pathParameters']['umfrageId']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'umfrageId' is required in pathParameters"}),
            "headers": {"Content-Type": "application/json"}
        }

    with Session() as session:
        try:
            umfrage = session.query(Umfrage).filter(Umfrage.id == umfrage_id).first()

            if not umfrage:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Umfrage not found"}),
                    "headers": {"Content-Type": "application/json"}
                }

            fragen = umfrage.fragen
            fragen_with_options = []

            for frage in fragen:
                frage_json = {
                    "id": frage.id,
                    "text": frage.text,
                    "typ_id": frage.typ_id,
                    "punktzahl": frage.punktzahl,
                    "antwort_optionen": [{"id": option.id, "text": option.text, "ist_richtig": option.ist_richtig} for
                                         option in frage.antwort_optionen]
                }
                fragen_with_options.append(frage_json)

            response = {
                "statusCode": 200,
                "body": json.dumps({"fragen": fragen_with_options}),
                "headers": {"Content-Type": "application/json"}
            }

        except Exception as e:
            session.rollback()
            logger.error("Error querying Umfrage: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response


def saveTeilnehmerAntwort(event, context):
    sitzung_id = event['pathParameters']['sitzungId']

    # Extrahiere und validiere die Anfrageinformationen aus dem Body
    try:
        body = json.loads(event.get('body', '{}'))
        antworten = body.get('antworten', [])
    except (json.JSONDecodeError, KeyError):
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid request: Missing fields."}),
            "headers": {"Content-Type": "application/json"}
        }

    if not antworten:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid request: No answers provided."}),
            "headers": {"Content-Type": "application/json"}
        }



    with Session() as session:
        try:
            for antwort in antworten:
                antwort_id = antwort.get('antwort_id')
                gewaehlteAntwort = antwort.get('gewaehlteAntwort')

                # Überprüfe, ob die Sitzung und die AntwortOption existieren
                sitzung = session.query(Sitzung).filter(Sitzung.id == sitzung_id).first()
                antwort_option = session.query(AntwortOption).filter(AntwortOption.id == antwort_id).first()

                if not sitzung or not antwort_option:
                    return {
                        "statusCode": 404,
                        "body": json.dumps({"message": "Sitzung or AntwortOption not found."}),
                        "headers": {"Content-Type": "application/json"}
                    }

                # Überprüfe ob die Teilnehmer Antwort schon existiert
                teilnehmer_antwort = session.query(TeilnehmerAntwort).filter(
                    TeilnehmerAntwort.sitzung_id == sitzung_id,
                             TeilnehmerAntwort.antwort_id == antwort_id).first()

                # Teilnehmer Antwort existiert noch nicht, Erstelle eine neue TeilnehmerAntwort
                if not teilnehmer_antwort:

                    teilnehmer_antwort = TeilnehmerAntwort(
                        sitzung_id=sitzung_id,
                        antwort_id=antwort_id,
                        anzahl_true=0,
                        anzahl_false=0
                    )

                if gewaehlteAntwort:
                    teilnehmer_antwort.anzahl_true += 1
                else:
                    teilnehmer_antwort.anzahl_false += 1

                session.add(teilnehmer_antwort)
            session.commit()

            response = {
                "statusCode": 200,
                "body": json.dumps({"message": "Die Teilnehmerantworten wurde erfolgreich hinzugefügt"}),
                "headers": {"Content-Type": "application/json"}
            }

        except Exception as e:
            session.rollback()
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }
            logger.error(str(e))
        finally:
            session.close()

    return response


def getUmfrageResults(event, context):
    """Get the result for a single Umfrage"""
    # TODO
    try:
        umfrage_id = event['pathParameters']['umfrageId']
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request: 'umfrageId' is required in pathParameters"})
        }
    with Session() as session:
        try:
            umfrage = session.query(Sitzung).filter(Sitzung.umfrage_id == umfrage_id)
            print(umfrage)
            umfrage = None
            if not umfrage:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "Umfrage not found"}),
                    "headers": {"Content-Type": "application/json"}
                }

            fragen = umfrage.fragen
            antworten = []
            umfrage.sitzungen

            response = {
                "statusCode": 200,
                "body": json.dumps({"fragen": antworten}),
                "headers": {"Content-Type": "application/json"}
            }

        except Exception as e:
            session.rollback()
            logger.error("Error querying Umfrage: %s", str(e))
            response = {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal Server Error, contact Backend-Team for more Info"}),
                "headers": {"Content-Type": "application/json"}
            }

    return response
