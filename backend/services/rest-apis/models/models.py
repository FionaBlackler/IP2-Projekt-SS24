from sqlalchemy import Table, create_engine, Column, Integer, String, ForeignKey, Date, DateTime, Boolean, Text, CHAR
from sqlalchemy.orm import relationship, sessionmaker, declarative_base

Base = declarative_base()

class Administrator(Base):
    __tablename__ = 'administratoren'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False)
    name = Column(String(50), nullable=False)
    password = Column(String(200), nullable=False)
    umfragen = relationship("Umfrage", back_populates="administrator", cascade="all, delete")


class Umfrage(Base):
    __tablename__ = 'umfragen'
    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey('administratoren.id', ondelete='CASCADE'), nullable=False)
    titel = Column(String(255), nullable=False)
    beschreibung = Column(Text, nullable=False)
    erstellungsdatum = Column(Date, nullable=False)
    archivierungsdatum = Column(Date)
    status = Column(String(50), nullable=False)
    json_text = Column(Text, nullable=False)
    administrator = relationship("Administrator", back_populates="umfragen")
    fragen = relationship("Frage", back_populates="umfrage", cascade="all, delete")
    sitzungen = relationship("Sitzung", back_populates="umfrage", cascade="all, delete")

    def to_json(self):
        return {
            "id": self.id,
            "admin_id": self.admin_id,
            "titel": self.titel,
            "beschreibung": self.beschreibung,
            "erstellungsdatum": self.erstellungsdatum.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "archivierungsdatum": self.archivierungsdatum.strftime('%Y-%m-%d %H:%M:%S.%f') if self.archivierungsdatum else None,
            "status": self.status,
            "json_text": self.json_text
        }


class Frage(Base):
    __tablename__ = 'fragen'
    id = Column(Integer, primary_key=True)
    local_id = Column(Integer, nullable=False)
    umfrage_id = Column(Integer, ForeignKey('umfragen.id', ondelete='CASCADE'))
    text = Column(Text, nullable=False)
    typ_id = Column(CHAR(1), nullable=False)
    punktzahl = Column(Integer, nullable=False)
    bestaetigt = Column(String(50))
    verneint = Column(String(50))
    umfrage = relationship("Umfrage", back_populates="fragen")
    antwort_optionen = relationship("AntwortOption", back_populates="frage", cascade="all, delete")


class AntwortOption(Base):
    __tablename__ = 'antwort_optionen'
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    ist_richtig = Column(Boolean, nullable=False)
    frage_id = Column(Integer, ForeignKey('fragen.id', ondelete='CASCADE'))

    frage = relationship("Frage", back_populates="antwort_optionen")
    teilnehmer_antworten = relationship("TeilnehmerAntwort", back_populates="antwort_optionen")


class Sitzung(Base):
    __tablename__ = 'sitzungen'
    id = Column(Integer, primary_key=True)
    startzeit = Column(DateTime, nullable=False)
    endzeit = Column(DateTime, nullable=False)
    teilnehmerzahl = Column(Integer, nullable=False)
    aktiv = Column(Boolean, nullable=False, default=True)
    umfrage_id = Column(Integer, ForeignKey('umfragen.id', ondelete='CASCADE'))

    umfrage = relationship("Umfrage", back_populates="sitzungen")
    teilnehmer_antworten = relationship("TeilnehmerAntwort", back_populates="sitzungen", cascade="all, delete")


class TeilnehmerAntwort(Base):
    __tablename__ = 'teilnehmer_antworten'
    sitzung_id = Column(Integer, ForeignKey('sitzungen.id', ondelete='CASCADE'), primary_key=True)
    antwort_id = Column(Integer, ForeignKey('antwort_optionen.id'), primary_key=True, nullable=False)
    anzahl_true = Column(Integer, nullable=False)
    anzahl_false = Column(Integer, nullable=False)

    sitzungen = relationship("Sitzung", back_populates="teilnehmer_antworten")
    antwort_optionen = relationship("AntwortOption", back_populates="teilnehmer_antworten")

