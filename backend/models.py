#========== IMPORT LIBRARIES AND MODULES ==========
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Users(Base):
  __tablename__ = 'users'
  
  user_id = Column(Integer, primary_key=True, index=True)
  user_name = Column(String, index=True)
  created_at = Column(DateTime(timezone=True), default=func.timezone('America/Bogota', func.now()))

class Querys(Base):
  __tablename__ = 'querys'
  
  query_id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.timezone('America/Bogota', func.now()))