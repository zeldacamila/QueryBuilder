#========== IMPORT LIBRARIES AND MODULES ==========
import os
from datetime import timedelta
from typing import List
from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from models import Comment, Query, User, Base
from schemas import CommentCreate, QueryData, QueryDisplay, UserCreate
from database import engine
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from dependencies import build_query, create_access_token, get_db, run_query, save_query_to_database
from google.api_core.exceptions import BadRequest

# Load environment variables
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

# Create a FastAPI instance
app = FastAPI()
# Create all the tables in postgres db
Base.metadata.create_all(bind=engine)

# Configuration to allow cross-origin requests from our frontend domain and port which will run at localhost:9000.
origins = [
    "http://localhost:9000",
    "localhost:9000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
    
#========== OPERATIONS ==========
@app.get("/")
async def root():
    return {"message": f"Hello World. I'm a Query Builder developed by Maria Camila Recuero."}

# LOGIN USER
@app.post("/login")
async def login_user(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    # Check if the user exists
    db_user = db.query(User).filter(User.user_name == user.user_name).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username")

    try:
        # Generate JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.user_name}, expires_delta=access_token_expires
        )

        return {"user": db_user, "access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
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
    # Verify if the user is registered in the database
    user = db.query(User).filter(User.user_name == query_data.user_name).first()
    if not user:
        # Raise an HTTP exception if the user is not registered
        raise HTTPException(status_code=400, detail="User not registered.")
    
    # Check if a query with the same name already exists
    existing_query = db.query(Query).filter(Query.query_name == query_data.query_name).first()
    if existing_query:
        # Raise an HTTP exception if a query with the same name exists
        raise HTTPException(status_code=400, detail="A query with this name already exists.")
    
    try:
        # Build the SQL query string based on input data
        query_string = build_query(
            country_name=query_data.country_name,
            year=query_data.year,
            sex=query_data.sex,
            indicator_name=query_data.indicator_name
        )
        # Set the SQL query string in query_data
        query_data.sql_query = query_string

        # Execute the query and get the results
        query_results = run_query(query=query_string)
        
        # Save the query information into the database
        query_id = save_query_to_database(query_data=query_data, username=query_data.user_name, db=db)

    except BadRequest:
        # Handle BadRequest exception for issues like an invalid query syntax
        raise HTTPException(status_code=400, detail=f"Query execution error: invalid query")

    except Exception as e:
        # Handle any other type of error that might occur
        raise HTTPException(status_code=500, detail=str(e))

    # Return a successful response if no errors are encountered
    return {"message": "Query submitted successfully", "query_id": query_id, "query_results": query_results}

# RUN QUERY 
@app.post("/run_query/")
async def run_visualize_query(query_data: QueryData, db: Session = Depends(get_db)):
    # Verify if the user is registered in the database
    user = db.query(User).filter(User.user_name == query_data.user_name).first()
    if not user:
        # Raise an HTTP exception if the user is not registered
        raise HTTPException(status_code=400, detail="User not registered.")
    
    try:
        # Build the SQL query string based on input data
        query_string = build_query(
            country_name=query_data.country_name,
            year=query_data.year,
            sex=query_data.sex,
            indicator_name=query_data.indicator_name
        )
        # Set the SQL query string in query_data
        query_data.sql_query = query_string

        # Execute the query and get the results
        query_results = run_query(query=query_string)

    except BadRequest:
        # Handle BadRequest exception for issues like an invalid query syntax
        raise HTTPException(status_code=400, detail=f"Query execution error: invalid query")

    except Exception as e:
        # Handle any other type of error that might occur
        raise HTTPException(status_code=500, detail=str(e))

    # Return a successful response if no errors are encountered
    return {"message": "Query runed successfully", "query_results": query_results}

# SAVE QUERY
@app.post("/save_query/")
async def save_query(query_data: QueryData, db: Session = Depends(get_db)):
    # Check if the user_name is registered in the database
    user = db.query(User).filter(User.user_name == query_data.user_name).first()
    if not user:
        # Raise an HTTP exception if the user_name is not registered
        raise HTTPException(status_code=400, detail="User not registered.")

    # Check if a query with the same name already exists
    existing_query = db.query(Query).filter(Query.query_name == query_data.query_name).first()
    if existing_query:
        # Raise an HTTP exception if a query with the same name exists
        raise HTTPException(status_code=400, detail="A query with this name already exists.")

    try:
        # Build the query string
        query_string = build_query(
            country_name=query_data.country_name, 
            year=query_data.year, 
            sex=query_data.sex, 
            indicator_name=query_data.indicator_name
        )
        # Set the query_string in query_data
        query_data.sql_query = query_string
        # Execute the query and get the results
        query_results = run_query(query=query_string)
        # Save the query info into the database
        query_id = save_query_to_database(query_data=query_data, username=query_data.user_name, db=db)
        
    except HTTPException as http_exc:
        # Raise the HTTP exceptions as they are
        raise http_exc
    
    except Exception as e:
        # Handle any other type of error that might occur
        raise HTTPException(status_code=500, detail=str(e))

    # Returning a successful response if no errors are encountered
    return {"message": "Query saved successfully", "query_id": query_id}

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
    # Check if the user (owner_id) exists
    user = db.query(User).filter(User.user_id == comment_data.owner_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not registered.")

    # Check if the query (query_id) exists
    query = db.query(Query).filter(Query.query_id == comment_data.query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found with that id.")

    try:
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

    except Exception as e:
        # Handle any other error that might occur
        raise HTTPException(status_code=500, detail=str(e))