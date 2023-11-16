#========== IMPORT LIBRARIES AND MODULES ==========

from datetime import timedelta
import os
from typing import List
from fastapi import FastAPI, HTTPException, Depends, Response
from models import Comment, Query, User, Base
from schemas import CommentCreate, QueryData, QueryDisplay, UserCreate
from database import engine
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from dependencies import build_query, create_access_token, get_db, run_query, save_query_to_database
from google.cloud import bigquery
from google.oauth2 import service_account

# Load the credeentials from service account file 
credentials = service_account.Credentials.from_service_account_file(
    'starry-center-383714-80a8265276ad.json'
)
# Create a BigQuery client
client = bigquery.Client(credentials=credentials, project=credentials.project_id)


# Load environment variables
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

# Create a FastAPI instance
app = FastAPI()
# Create all the tables in postgres db
Base.metadata.create_all(bind=engine)

    
#========== OPERATIONS ==========
@app.get("/")
async def root():
    return {"message": f"Hello World"}

# CREATE AND LOGIN USER
@app.post("/users")
async def create_user(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    # Check if the username already exists
    existing_user = db.query(User).filter(User.user_name == user.user_name).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    try:
        # Create a new User object
        db_user = User(user_name=user.user_name)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Generate JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.user_name}, expires_delta=access_token_expires
        )

        return {"user": db_user, "access_token": access_token, "token_type": "bearer"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Could not create user")
    

# CREATE AND VISUALIZE QUERY
@app.post("/submit_query/")
async def submit_query(query_data: QueryData, db: Session = Depends(get_db)):
    # Build the query
    query_string = build_query(
        country_name=query_data.country_name, 
        year=query_data.year, 
        sex=query_data.sex, 
        indicator_name=query_data.indicator_name
    )
    #print(query_string)
    # Set the query_string in query_data
    query_data.sql_query = query_string
    # Save the query info into the database
    query_id = save_query_to_database(query_data=query_data, username=query_data.user_name, db=db)
    
    query_results = run_query(query = query_string)

    return {"message": "Query submitted successfully", "query_id": query_id, "query_results": query_results}

# SAVE QUERY
@app.post("/save_query/")
async def save_query(query_data: QueryData, db: Session = Depends(get_db)):
    # Check if a query with the same name already exists
    existing_query = db.query(Query).filter(Query.query_name == query_data.query_name).first()
    if existing_query:
        # Return an error response if a query with the same name exists
        raise HTTPException(status_code=400, detail="A query with this name already exists.")

    # Build the query string
    query_string = build_query(
        country_name=query_data.country_name, 
        year=query_data.year, 
        sex=query_data.sex, 
        indicator_name=query_data.indicator_name
    )
    # Set the query_string in query_data
    query_data.sql_query = query_string

    # Save the query info into the database
    query_id = save_query_to_database(query_data=query_data, username=query_data.user_name, db=db)

    return {"message": "Query saved successfully", "query_id": query_id}

# RUN QUERY
@app.post("/run_query/")
async def run_query_endpoint(query_data: QueryData, db: Session = Depends(get_db)):
    # Build the query string
    query_string = build_query(
        country_name=query_data.country_name, 
        year=query_data.year, 
        sex=query_data.sex, 
        indicator_name=query_data.indicator_name
    )

    # Run the query and get results
    query_results = run_query(query=query_string)

    return {"message": "Query executed successfully", "query_results": query_results}

# GET ALL SAVED QUERIES
@app.get("/saved_queries/", response_model=List[QueryDisplay])
async def show_saved_queries(db: Session = Depends(get_db)):
    query_results = db.query(Query, User.user_name)\
                      .join(User, Query.owner_id == User.user_id)\
                      .all()

    results = []
    for query, user_name in query_results:
        # Obtener los comentarios con los nombres de los usuarios que los hicieron
        comment_results = db.query(Comment, User.user_name)\
                            .join(User, Comment.owner_id == User.user_id)\
                            .filter(Comment.query_id == query.query_id)\
                            .limit(3)\
                            .all()

        # Construir la lista de comentarios con la estructura deseada
        comments = [{"owner_name": comment_user_name, "comment_content": comment.comment_content} for comment, comment_user_name in comment_results]

        results.append(QueryDisplay(
            query_id=query.query_id,
            query_name=query.query_name,
            query_creator=user_name,
            country_param=query.country_param,
            indicator_param=query.indicator_param,
            sex_param=query.sex_param,
            year_param=query.year_param,
            sql_query=query.sql_query,
            comments=comments
        ))

    return results

# CREATE COMMENT
@app.post("/create_comment/", response_model=CommentCreate)
async def create_comment(comment_data: CommentCreate, db: Session = Depends(get_db)):
    # Create a new Comment object
    new_comment = Comment(
        owner_id=comment_data.owner_id,
        query_id=comment_data.query_id,
        comment_content=comment_data.comment_content
    )

    # Add the new comment to the database and commit the transaction
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment