#========== IMPORT LIBRARIES AND MODULES ==========
from fastapi import FastAPI, HTTPException, Depends
from os import environ as env
from pydantic import BaseModel
from typing import List
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

# Create a FastAPI instance
app = FastAPI()
# Create all the tables in postgres db
models.Base.metadata.create_all(bind=engine)

# Connection to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#========== PYDANTIC MODELS ==========
class UserBase(BaseModel):
    user_name: str
    

#========== OPERATIONS ==========
@app.get("/")
async def root():
    return {"message": f"Hello World"}



    
    