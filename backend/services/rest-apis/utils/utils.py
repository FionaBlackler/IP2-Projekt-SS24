import json
import os
from typing import List
import jwt
from models.models import Umfrage, Frage, AntwortOption,TeilnehmerAntwort
def getDecodedTokenFromHeader(event) -> dict:
    auth_header = event.get('headers', {})
    if not auth_header:
        return None
    header = auth_header.get("authorization")
    token = header.split(" ")[1]
    try:
        decoded_token = jwt.decode(token, key=os.environ["SECRET_KEY"], algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {
            "statusCode": 404,
            "body": json.dumps({"message": "No Authorization Header"}),
            "headers": {"Content-Type": "application/json"}
        }
    return decoded_token


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


# Helper Methode um Fragen in Json umzuwandeln
def create_antwort_option_as_json(antwort_option: AntwortOption, sitzung_id = None, only_active=False):
    antworten: List[TeilnehmerAntwort] = antwort_option.teilnehmer_antworten
    if sitzung_id:
        antworten = [antwort for antwort in antworten if antwort.sitzung_id == sitzung_id]
    if only_active:
        antworten = [antwort for antwort in antworten if antwort.sitzungen.aktiv]
    antwortenTrue, antwortenFalse = 0, 0
    for antwort in antworten:
        antwortenTrue += antwort.anzahl_true
        antwortenFalse += antwort.anzahl_false
    return {
        "id" :antwort_option.id,
        "text": antwort_option.text,
        "ist_richtig" :antwort_option.ist_richtig,
        "antwortenTrue": antwortenTrue, 
        "antwortenFalse": antwortenFalse
    }


# Helper Methode um Fragen in Json umzuwandeln
def create_frage_as_json(frage: Frage, sitzung_id=None, only_active=False):
    antwort_optionen_json = []
    for antwort_option in frage.antwort_optionen:
        antwort_optionen_json.append(create_antwort_option_as_json(antwort_option,sitzung_id=sitzung_id,only_active=only_active ))

    return {
        "id": frage.id,
        "antwort_optionen": antwort_optionen_json,
        "punktzahl": frage.punktzahl,
        "text": frage.text,
        "umfrage_id": frage.umfrage_id,
        "typ_id": frage.typ_id,
        "bestaetigt" : frage.bestaetigt, 
        "verneint": frage.verneint 
    }
