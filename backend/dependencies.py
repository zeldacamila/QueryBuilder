#========== IMPORT LIBRARIES AND MODULES ==========
import os
from database import SessionLocal
from datetime import datetime, timedelta
from jose import jwt

# Load environment variables
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

# Connection to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
# Function to create a JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt