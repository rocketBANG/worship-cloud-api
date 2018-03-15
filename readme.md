## Setup
Create files `.env.production` and `.env` with the following lines
```
BASE_URL=
DBUSER=
DBPASS=
DBURL=
```
`BASE_URL` is the url the api will be hosted at (e.g. `/api/v1`)  
`DBUSER` is the username to login to the database with
    (leave blank if there is no auth)  
`DBPASS` is the password to use for the database 
    (leave blank if there is no auth)  
`DBURL` is the hostname URL of the MongoDB to connect to
    e.g. `localhost:27017/songs`

    
`.env.production` Handles what config the program uses in a production enviroment  
`.env` Handles what the program uses in a dev enviroment

## Running
Run the command `npm start`  
This will start a localhost server at port 3500.  
Changing files will cause the server to reload automatically with the new changes