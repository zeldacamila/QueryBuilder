#========== IMPORT LIBRARIES AND MODULES ==========
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables
DATABASE_URL = os.getenv('DB_URL')

# Create a SQLAlchemy engine. We will later use this engine in other places.
engine = create_engine(DATABASE_URL)
# Create a instance of the SessionLocal class, this instance will be the actual database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base will be used as a base class for declarative class definitions. 
Base = declarative_base()