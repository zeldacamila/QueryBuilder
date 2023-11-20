from typing import List, Optional
from pydantic import BaseModel

#========== PYDANTIC MODELS ==========
class UserCreate(BaseModel):
    user_name: str

class CommentCreate(BaseModel):
    owner_id: int
    query_id: int
    comment_content: str
    
class QueryData(BaseModel):
    indicator_name: str
    sex: str
    year: str
    query_name: str
    country_name: str
    user_name: str
    sql_query: Optional[str] = None
    
class CommentDisplay(BaseModel):
    owner_name: str
    comment_content: str

class QueryDisplay(BaseModel):
    query_id: int
    query_name: str
    query_creator: str 
    country_param: Optional[str] = None
    indicator_param: Optional[str] = None
    sex_param: Optional[str] = None
    year_param: Optional[str] = None
    sql_query: Optional[str] = None
    comments: List[CommentDisplay]
    
    class Config:
      orm_mode = True
