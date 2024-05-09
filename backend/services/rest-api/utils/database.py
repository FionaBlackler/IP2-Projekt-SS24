import json
import os
import boto3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from botocore.exceptions import ClientError
from models import Base, Administrator

def get_secret(secret_name, region_name="eu-central-1"):
    """Retrieve a secret from AWS Secrets Manager"""
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        print(f"Error retrieving secret: {e}")
        raise e
    else:
        secret = get_secret_value_response["SecretString"]
        return json.loads(secret)

def create_database_connection():
    """Create a database connection using credentials stored in AWS Secrets Manager"""
    secret_name = "dev/rds/db-credentials"
    region_name = "eu-central-1"

    secret = get_secret(secret_name, region_name)
    username = secret["username"]
    password = secret["password"]
    host = secret["host"]
    port = secret["port"]
    dbname = secret["dbname"]

    DATABASE_URL = f"mysql://{username}:{password}@{host}:{port}/{dbname}"

    engine = create_engine(DATABASE_URL, echo=True)

    Session = sessionmaker(bind=engine)
    return engine, Session

def create_local_engine():
    # Database connection with local database
    DATABASE_URL = os.environ['DATABASE_URL']
    engine = create_engine(DATABASE_URL, echo=True)
    return engine