#========== IMPORT LIBRARIES AND MODULES ==========
from datetime import timedelta
import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import models
from database import engine
from dependencies import create_access_token, get_db

# Load environment variables
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

# Create a FastAPI instance
app = FastAPI()
# Create all the tables in postgres db
models.Base.metadata.create_all(bind=engine)



#========== PYDANTIC MODELS ==========
class UserCreate(BaseModel):
    user_name: str
    

#========== OPERATIONS ==========
@app.get("/")
async def root():
    return {"message": f"Hello World"}

@app.post("/users")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(user_name=user.user_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # Generate JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.user_name}, expires_delta=access_token_expires
    )
    
    return {"user": db_user, "access_token": access_token, "token_type": "bearer"}
    

    
    