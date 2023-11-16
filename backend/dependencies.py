#========== IMPORT LIBRARIES AND MODULES ==========
import json
import os
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import User, Query
from database import SessionLocal
from datetime import datetime, timedelta
from jose import jwt
from google.cloud import bigquery
from google.oauth2 import service_account

# Load environment variables
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
GOOGLE_APP_CREDENTIALS = json.loads(os.getenv('GOOGLE_APP_CREDENTIALS'))

# Load the credeentials from service account file 
credentials = service_account.Credentials.from_service_account_info(GOOGLE_APP_CREDENTIALS)
# Create a BigQuery client
client = bigquery.Client(credentials=credentials, project=credentials.project_id)

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

def combine_indicator_and_sex(indicator_name, sex):
    # Determine what to add based in the value of sex
    if sex.lower() in ['male', 'female']:
        add_text = f"{sex.lower()} "
    elif sex.lower() == 'both':
        add_text = "both sexes "
    else:
        return indicator_name  # Don't modificate if is not 'male', 'female' or 'both'

    # Find the position of the last '('
    open_parenthesis_pos = indicator_name.rfind('(')

    # Asegura que el paréntesis fue encontrado
    if open_parenthesis_pos != -1:
        # Insert the text before the last '('
        return indicator_name[:open_parenthesis_pos] + add_text + indicator_name[open_parenthesis_pos:]
    
    return indicator_name

def build_query(country_name, year, sex, indicator_name):
    # Process indicator_name with the function combine_indicator_and_sex
    processed_indicator_name = combine_indicator_and_sex(indicator_name, sex)

    where_clauses = []

    if country_name != 'ALL':
        where_clauses.append(f"country_name = '{country_name}'")
    if year != 'ALL':
        where_clauses.append(f"year = {year}")
    if processed_indicator_name != 'ALL':
        where_clauses.append(f"indicator_name = '{processed_indicator_name}'")

    where_clause = ' AND '.join(where_clauses) if where_clauses else '1=1'

    query = f"""SELECT * FROM `bigquery-public-data.world_bank_intl_education.international_education`
    WHERE {where_clause}
    LIMIT 1000;"""

    return query

def save_query_to_database(query_data: dict, username: str, db: Session):
    # Find the user by username
    user = db.query(User).filter(User.user_name == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Unregistered user")

    # Create a new Query object
    new_query = Query(
        query_name=query_data.query_name,
        owner_id=user.user_id,
        country_param=query_data.country_name,
        indicator_param=query_data.indicator_name,
        sex_param=query_data.sex,
        year_param=query_data.year,
        sql_query=query_data.sql_query
        # Other fields can be added as necessary
    )

    # Add to the session and commit
    db.add(new_query)
    db.commit()
    db.refresh(new_query)

    return new_query.query_id  # Return the new query ID for confirmation

def run_query(query: str):
    # Execute the query
    query_job = client.query(query)
    # Waits for the query to complete and returns the results
    results = query_job.result()
    return [dict(row) for row in results]
    #return results
    