# QueryBuilder - USER GUIDE
A tool focused on crafting and managing queries in BigQuery (v0.1.0).

## Getting Started

### Prerequisites
- Docker installed on your machine.
- Git for cloning the repository.

### Installation

1. **Clone the Repository**
   Clone the repository to your local machine: git clone [https://github.com/zeldacamila/QueryBuilder.git]


2. **Environment Setup**
Copy the `.env` file into the root directory of the project.

3. **Build and Run the Application**
From a bash terminal, navigate to the project directory and run: ./activate.sh


4. **Access the Application**
Open your web browser and visit `http://localhost:9000` to see the application running.

5. **API Documentation**
To view the API documentation, visit `http://localhost:8000/docs#/`.

## Using QueryBuilder

### Logging In
To access the application, you need to log in using your user credentials. Upon logging in, you will be taken to the main query builder interface.

### Features

1. **Run a Query**
- Navigate to the "Run a Query" section.
- Use the form to create a SQL query. You can select various parameters and conditions.
- Run the query to see the results and the generated graph.
- Optionally, you can save the query for future use.

2. **View Saved Queries**
- Go to the "View Saved Queries" section to see a list of all saved queries.
- You have two options:
  - **Select a Query**: Choose a query to load it into the query builder. You can then run, view, or save it as a new query.
  - **Comment on a Query**: Select a query to add comments. This is useful for collaborative query building and review.



Thank you for using QueryBuilder!

