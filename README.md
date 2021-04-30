# Bacle jobs

[Bacle jobs](https://bacle.pt/) aims to stop physical CV delivering, restructuring the way We look at applying to unqualified jobs

## Software used

Front-end - React with Typescript
Backend - Node.js + Express
DB - PostgreSQL

### Prerequisites

Start by cloning this repo

```
git clone https://github.com/baclejobs/bacle-jobs.git
```

### Installing

Start by installing all the packages 📦
Don't forget to add external packages, find them below.

```
npm install react-scripts
```

Then just start the web app

Firstly, start the API:

```
cd ./backend/
npm start
```

Then, start the Website:

```
cd ./frontend/
npm start
```

### PostgreSQL on Heroku

Deploy PostgreSQL on Heroku
```
heroku pg:push bacle_db postgresql-concave-18248 --app postgresql-deploy
```

Reset PostgreSQL DB on Heroku
```
heroku pg:reset --app postgresql-deploy --confirm postgresql-deploy
```
### Deploy API on Heroku

Changes needed for production

```
backend/package.json:
"start": "node app.js"
```

```
backend/db-connect/postgresDB.js:
/* Change for production
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  */
```

Start project on Heroku
```
cd my-project/
git init
heroku git:remote -a postgresql-deploy
```
Commit changed to Heroku
```
git add .
git commit -am "second deploy"
git push heroku master
```
### Packages

Installing all external packages

Frontend

```
├── ...
```

Backend

```
├── "axios": "^0.21.1",
├── "bcryptjs": "^2.4.3",
├── "body-parser": "^1.19.0",
├── "express": "^4.17.1",
├── "express-validator": "^6.10.1",
├── "jsonwebtoken": "^8.5.1",
├── "node-modules": "^1.0.1",
├── "pg": "^8.6.0",
├── "react-scripts": "^3.4.4"
```

## Deployment

The project is now live on (http://localhost:3000)

## Built With MERN

- [PostgreSQL](https://www.postgresql.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)

## DB Schema

- [DrawSQL](https://drawsql.app/eurico-pinto/diagrams/bacle-jobs)

## Hosting

- [API](https://bacle-jobs.herokuapp.com/api) - The API is deployed on (http://postgresql-deploy.herokuapp.com/api)
- [Website]() - - The web-app is not deployed yet

## Contributing

Open to pull requests!

## Authors

- **Francisco Soares** - _CEO_
- **António Cordeiro** - _Front-end Engineer_
- **Duarte Costa** - _DB Admin_
- **Eurico Pinto** - _Back-end Engineer_
