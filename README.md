# Urbancribs API

---
### Installation & Running:

1.  Clone the repository:
    ```bash
     git clone https://github.com/Dev-UrbanCribs/web-client.git
    ```
2.  cd into the backend folder

    ```bash
      cd backend/

    ```

3.  Install dependencies:

    ```bash

     npm install

    ```

    This will install all the dependencies needed to run the application.

4.  Run the application:

    ```bash
     npm start
    ```

    This will start the application.

6.  Create a postgres database: e.g urbancribs_db
    ```bash
     postgres=# CREATE DATABASE urbancribs_db;
    ```
6.  Ensure that all necesary details are in the .env file e.g.

        DB_USERNAME="postgres"
        B_PASSWORD="your password"
        DB_HOST="your hostname" // if running it on a local machine then use localhost or 127.0.0.1
        DB_PORT=5432
        DB_NAME="urbancribs_db"

        DATABASE_URL="postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName" this is the url that will be used to connect to the database. Note the format of the url doesn't have to be the same as the one above, depends on where your are hosting your database.

7.  Scaffolding the database tables:
    <p>These scripts can be found in the package.json</p>
    a) Migrate tables:

    ```bash
          sudo npm run migrate
          or
          npm run migrate
    ```

    b) If the tables models have not been created, then run the following command:
    Then after generating, you can run the migrate command to create the tables.

    ```bash
          sudo npm run generate-tables
          or
          npm run generate-tables
    ```

8.  Generate initial data for the database:
    make sure you have the correct database url and values in the .env file and the app is running. Then hit the endpoint /api/v1/run-scripts to generate the data.
    e.g
    ```bash
    curl -X POST -d '{"scripts":["create-initial-data"]}' -H "Content-Type: application/json" -H "Accept: application/json" https://yoursite.com/api/v1/run-scripts.
    ```
    or use postman to do the same.
    Send a GET request to the endpoint based on your url .../api/v1/run-scripts to generate the data.
    <p>This will generate initial data for the tables userTypes, membershipLevels, countries</p>
9.  Test the endpoints using your testing client (postman, insomnia etc)
