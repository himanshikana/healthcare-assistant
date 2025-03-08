from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from database import SessionLocal, engine
from models import Base, User, PatientRecord
from auth import get_current_user, authenticate_user, create_access_token
from chatbot import get_chatbot_response
from voice import text_to_speech
from sqlalchemy.orm import Session
from datetime import timedelta

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class PatientRecordCreate(BaseModel):
    name: str
    symptoms: str
    diagnosis: str

class ChatRequest(BaseModel):
    query: str

class TextToSpeechRequest(BaseModel):
    text: str

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Healthcare Assistant API is running"}

# User registration
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# User login
@app.post("/token")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(username, password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route
@app.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.username}! This is a protected route."}

# Chatbot endpoint
@app.post("/chat")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    response = get_chatbot_response(request.query)
    return {"response": response}

# Text-to-speech endpoint
@app.post("/text-to-speech")
def convert_text_to_speech(request: TextToSpeechRequest, current_user: User = Depends(get_current_user)):
    text_to_speech(request.text)
    return {"message": "Text converted to speech and played successfully"}