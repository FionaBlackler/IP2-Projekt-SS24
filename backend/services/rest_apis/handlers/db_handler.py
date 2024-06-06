from datetime import datetime
import json
from sqlalchemy.orm import sessionmaker
from models.models import AntwortOption, Base, Administrator, Frage, Sitzung, TeilnehmerAntwort, Umfrage
from utils.database import create_local_engine

engine = create_local_engine()

# Database connection with aws secrets manager
# engine, Session = create_database_connection()

def createDatabase(event, context):
    """Drop all existing tables and create new database tables"""
    
    # Drop all tables
    Base.metadata.drop_all(engine)
    
    # Create new tables
    Base.metadata.create_all(engine)
    
    body = {
        "message": "Database tables dropped and created successfully!"
    }
    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response


def addExampleData(event, context):
    """Add example data to the database for testing purposes"""

    Session = sessionmaker(bind=engine)
    session = Session()

    admin = Administrator(email="admin@example.com", name="Admin", password="password123")
    
    # Create an Umfrage
    umfrage = Umfrage(
        admin_id=1,
        titel="Example Survey",
        beschreibung="This is an example survey.",
        erstellungsdatum=datetime(2023, 5, 16),
        status="active",
        administrator=admin,
        json_text="Testing Json"
    )
    
    # Create Fragen
    frage1 = Frage(
        umfrage=umfrage,
        local_id=1,
        text="What is the capital of France?",
        typ_id='1',
        bestaetigt="Paris",
        verneint="Not Paris",
        punktzahl=1
    )
    
    frage2 = Frage(
        umfrage=umfrage,
        local_id=2,
        text="What is 2 + 2?",
        typ_id='1',
        bestaetigt="4",
        verneint="Not 4",
        punktzahl=1
    )
    
    # Create AntwortOptionen
    antwort1_1 = AntwortOption(id=1, text="Paris", ist_richtig=True, frage=frage1)
    antwort1_2 = AntwortOption(id=2, text="London", ist_richtig=False, frage=frage1)
    antwort1_3 = AntwortOption(id=3, text="Berlin", ist_richtig=False, frage=frage1)
    
    antwort2_1 = AntwortOption(id=4, text="3", ist_richtig=False, frage=frage2)
    antwort2_2 = AntwortOption(id=5, text="4", ist_richtig=True, frage=frage2)
    antwort2_3 = AntwortOption(id=6, text="5", ist_richtig=False, frage=frage2)
    
    # Create a Sitzung
    sitzung = Sitzung(
        id=1,
        startzeit=datetime(2023, 5, 16, 9, 0, 0),
        endzeit=datetime(2023, 5, 16, 10, 0, 0),
        teilnehmerzahl=10,
        umfrage=umfrage
    )

    # Create TeilnehmerAntworten
    teilnehmer_antworten = [
        TeilnehmerAntwort(
            antwort_optionen=antwort1_1,
            sitzungen=sitzung,
            anzahl_true=1,
            anzahl_false=4
        ),
        TeilnehmerAntwort(
            antwort_optionen=antwort2_2,
            sitzungen=sitzung,
            anzahl_true=0,
            anzahl_false=0
        )
    ]
    
    try: 
        # Add all to session and commit
        session.add(admin)
        session.add(umfrage)
        session.add(frage1)
        session.add(frage2)
        session.add(antwort1_1)
        session.add(antwort1_2)
        session.add(antwort1_3)
        session.add(antwort2_1)
        session.add(antwort2_2)
        session.add(antwort2_3)
        session.add(sitzung)
        session.add_all(teilnehmer_antworten)
        session.commit()
        session.close()
        return json.dumps({"message": "Example data added successfully!"}), 200
    except Exception as e:
        session.rollback()
        session.close()
        return json.dumps({"message": str(e)}), 500
