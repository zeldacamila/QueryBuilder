# Use Python version 3.9.10 as the base image
FROM python:3.9.10

# Define environment variables (we can do it here or in the docker-compose file)
#ENV DB_URL=postgresql://user_name:password@host_name:port/db_name

# Set the working directory inside the Docker image
WORKDIR /backendapp

# Copy the requirements file from our project to the Docker image
COPY backend/requirements.txt /backendapp/requirements.txt

# Install the dependencies listed in the requirements file and upgrade pip to the latest version
RUN pip install --upgrade pip
RUN pip install -r /backendapp/requirements.txt

# Copy the rest of our project files (located in the backend folder) to the /backendapp directory in the image
COPY backend .

# Inform Docker that the application listens on port 8000
EXPOSE 8000

# Set the default command to run when the image starts
CMD [ "uvicorn", "main:app", "--reload", "--host=0.0.0.0", "--port=8000"]