# Mindflow
Mindflow is a todo app that includes neurohacking tools to boost productivity while decreasing stress.

The app is available [here](https://mindflow-todo-app.herokuapp.com/).

## Table of contents
* [Scope](#scope)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)
* [Run](#run)
* [Deploy](#deploy)

## Scope
The app was built as a second project during Ironhack's Full Stack Developer bootcamp.
It was awarded gold medal for best project by teachers and students.

## Features
* User authentication and authorization via Passport (local and Google strategies)
* User data stored in a MongoDB database
* Password reset via Nodemailer
* Svg animations using Green Sock
* Two playlists that boost creativity and problem-solving skills, fetched from Spotify's API
* A built-in Pomodoro timer for an optimal work/break pattern
* A breath bubble that promotes cardiac coherence and instant relaxation

## Setup
### Dependencies
```
$ npm install
```

* axios: 0.24.0
* bcrypt: 5.0.1
* express: 4.17.1
* gsap: 3.7
* hbs: 4.2.0
* mongodb": 4.2.1
* mongoose: 6.0.14
* node: 14.17.5
* nodemailer: 6.7.2
* passport: 0.5.2
* spotify-web-api-node: 5.0.2


### Config variables
Add the following variable with your own values inside a `.env` file:
* PORT (local port to call the app)
* MONGO_URI (local URL to call the database)
* SESSION_SECRET (random sentence used as a session secret)
* CLIENT_ID (client id from your Spotify developer account)
* CLIENT_SECRET (client secret from your Spotify developer account)
* GMAIL_USER (Gmail address for Nodemailer)
* GMAIL_PWD (Gmail address password)
* GOOGLE_OAUTH_ID (client id from your Google developer account)
* GOOGLE_OAUTH_SECRET (client secret from your Google developer account)
* GOOGLE_OAUTH_CALLBACK_URL (Google oAuth callback URL)

## Run
```
$ npm run dev
```

## Deploy
You must log into Heroku first.

```
$ git push heroku main
```
