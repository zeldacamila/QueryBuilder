#========== IMPORT LIBRARIES AND MODULES ==========
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

#========== DATABASE MODELS ==========
class User(Base):
  __tablename__ = 'users'
  
  user_id = Column(Integer, primary_key=True, index=True)
  user_name = Column(String, index=True, nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.timezone('America/Bogota', func.now()))


class Query(Base):
  __tablename__ = 'queries'
  
  query_id = Column(Integer, primary_key=True, index=True)
  query_name = Column(String, index=True, nullable=False)
  owner_id = Column(Integer, ForeignKey('users.user_id'))
  country_param = Column (String, index=True, nullable=False)
  indicator_param = Column(String, index=True, nullable=False)
  sex_param = Column(String, index=True, nullable=False)
  year_param = Column(Integer, index=True, nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.timezone('America/Bogota', func.now()))
  
  comments = relationship("Comment", back_populates="query")
  
  
class Comment(Base):
  __tablename__ = 'comments'
  
  comment_id = Column(Integer, primary_key=True, index=True)
  comment_content = Column(String, index=True, nullable=False)
  owner_id = Column(Integer, ForeignKey('users.user_id'))
  query_id = Column(Integer, ForeignKey('queries.query_id'))
  created_at = Column(DateTime(timezone=True), default=func.timezone('America/Bogota', func.now()))
  
  query = relationship("Query", back_populates="comments")
  
  