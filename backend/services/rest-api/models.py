from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Date, DateTime, Boolean, Text, CHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()

class Administrator(Base):
    __tablename__ = 'administratoren'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False)
    name = Column(String(50), nullable=False)
    password = Column(String(50), nullable=False)
    umfragen = relationship("Umfrage", back_populates="administrator", cascade="all, delete")

class Umfrage(Base):
    __tablename__ = 'umfragen'
    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey('administratoren.id', ondelete='CASCADE'))
    titel = Column(String(255), nullable=False)
    erstellungsdatum = Column(Date, nullable=False)
    archivierungsdatum = Column(Date)
    status = Column(String(50), nullable=False)
    administrator = relationship("Administrator", back_populates="umfragen")
    fragen = relationship("Frage", back_populates="umfrage", cascade="all, delete")
    sitzungen = relationship("Sitzung", back_populates="umfrage", cascade="all, delete")


class Frage(Base):
    __tablename__ = 'fragen'
    id = Column(Integer, primary_key=True)
    umfrage_id = Column(Integer, ForeignKey('umfragen.id', ondelete='CASCADE'))
    text = Column(Text, nullable=False)
    typ_id = Column(CHAR(1), nullable=False)
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
    teilnehmer_antworten = relationship("TeilnehmerAntwort", back_populates="antwort_option", cascade="all, delete")

class Sitzung(Base):
    __tablename__ = 'sitzungen'
    id = Column(Integer, primary_key=True)
    startzeit = Column(DateTime, nullable=False)
    endzeit = Column(DateTime, nullable=False)
    teilnehmerzahl = Column(Integer, nullable=False)
    umfrage_id = Column(Integer, ForeignKey('umfragen.id', ondelete='CASCADE'))
    umfrage = relationship("Umfrage", back_populates="sitzungen")
    teilnehmer_antworten = relationship("TeilnehmerAntwort", back_populates="sitzung", cascade="all, delete")

class TeilnehmerAntwort(Base):
    __tablename__ = 'teilnehmer_antworten'
    antwort_id = Column(Integer, ForeignKey('antwort_optionen.id'), primary_key=True)
    sitzung_id = Column(Integer, ForeignKey('sitzungen.id', ondelete='CASCADE'), primary_key=True)
    teilnehmer_gewaehlt = Column(Integer, nullable=False)
    gewaehlte_antwort = Column(Boolean, primary_key=True)
    antwort_option = relationship("AntwortOption", back_populates="teilnehmer_antworten")
    sitzung = relationship("Sitzung", back_populates="teilnehmer_antworten")


