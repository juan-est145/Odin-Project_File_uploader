# Odin Members Only App

A repository containing a website that emulates a cloud storage service. It supports authentication and CRUD operations with files and folders. All of the files are stored locally. In order to run this project, you can do so inside Docker containers or on your own machine. The dependencies for each use case
will be described below (if you have Docker, I recommend that you chose the container option)

## Docker

### Dependencies
To run this project inside containers, you will need to have installed Docker and the Make command.

Lastly, you must provide a .env file at the root of the project with the following keys:\
PORT=*The port you want to listen to*\
SECRET=*A secret of your liking*\
POSTGRES_PASSWORD=*A password for the postgres database*\
POSTGRES_DB=*The name of the postgres database*\
POSTGRES_USER=*The name of the postgres user*\
DATABASE_URL=*A database url connection with this format* ->"postgresql://VALUE-OF-POSTGRES_USER:VALUE-OF-POSTGRES_PASSWORD@postgres:5432/VALUE-OF-POSTGRES_DB?schema=public"

Once all this requirements are satisfied, simply run at the root of the project:

```bash
make
```

For stoping the containers instead, run this at the root of the project:
```bash
make down
```

## Bare metal

### Dependencies
To run this project on your own machine, you will need to have installed Nodejs and Postgres. Also, you will need to have created a database for this project and provide a .env file inside the app directory.

The .env file must have the following keys:\
PORT=*The port you want to listen to*\
SECRET=*A secret of your liking*\
DATABASE_URL=*A database url connection with this format* -> "postgresql://USER:PASSWORD@localhost:5432/DATABASE-NAME?schema=public"


Once all this requirements are satisfied, simply run at the root of the project

```bash
cd app && npm install && npm run start
```