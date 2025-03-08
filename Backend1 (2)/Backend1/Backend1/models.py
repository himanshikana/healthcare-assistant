from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class PatientRecord(Base):
    __tablename__ = "patient_records"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    symptoms = Column(String)
    diagnosis = Column(String)