from datetime import datetime
import pytest
from backend.services.rest_apis.handlers.umfrage_handler import deleteUmfrageById
from backend.services.rest_apis.models.models import Administrator, Base, Umfrage
from backend.services.rest_apis.utils.database import create_local_engine
from sqlalchemy.orm import sessionmaker

class TestUmfrageHandler:

    def __init__(self) -> None:
        self.engine = create_local_engine()
        self.Session = sessionmaker(bind=self.engine)

        self.admin = Administrator(
            id=1,
            name="Test Admin",
            email="test@admin.com",
            password="test_password",
        )

        self.umfrage = Umfrage(
            id=1,
            name="Test Umfrage",
            description="Test Umfrage Description",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )


    def setup_example(self):
        Base.metadata.create_all(self.engine)
        


    def test_deleteUmfrageById():

    