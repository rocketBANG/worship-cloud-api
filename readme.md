# Worship Cloud API ![build_status](https://travis-ci.com/rocketBANG/worship-cloud-api.svg?token=1evRgsqMVaUyaUvXTSsQ&branch=master)

## About
This is the backend to be used with the [WorshipCloud](https://github.com/rocketBANG/worship-cloud) web app.

## Setup
You will need a MongoDb (either running locally or remotely)


Create files `.env.production` and `.env` with the following lines
```
BASE_URL=
DBUSER=
DBPASS=
DBARGS=
DBCOLLECTION=
DBURL=
SECRET=
```
`BASE_URL` is the url the api will be hosted at (e.g. `/api/v1`)  
`DBUSER` is the username to login to the database with
    (leave blank if there is no auth)  
`DBPASS` is the password to use for the database 
    (leave blank if there is no auth)  
`DBURL` is the hostname URL of the MongoDB to connect to
    e.g. `localhost:27017`
`DBCOLLECTION` is the collection to connect to 
    e.g. `songs`
`SECRET` is the secret to use for the express-session
    e.g. `secret_token`

    
`.env.production` Handles what config the program uses in a production enviroment  
`.env` Handles what the program uses in a dev enviroment

## Running
Run the command `npm start` or `npm run dev` to start a dev server  
This will start a localhost server at port `3500`.  
With a dev server, changing files will cause the server to reload automatically with the new changes
