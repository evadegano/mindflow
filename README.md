# Mindflow
Mindflow is a todo app that includes neurohacking tools to boost productivity while decreasing stress.

The app is available [here](https://mindflow-todo-app.herokuapp.com/).

## Table of contents
* [Scope](#scope)
* [Features](#features)
* [Development](#development)
  * [Setup](#setup)
  * [Install](#install)
  * [Run](#run)
  * [Deploy](#deploy)

## Scope
The app was built as a second project during Ironhack's Full Stack Developer bootcamp.
It was awarded gold medal for best project by teachers and students.

## Features
* Svg animations using Green Sock
<img src='https://user-images.githubusercontent.com/35829634/160286207-eb23daa2-c0c9-4118-8774-9e66c8a98dff.gif' alt='' height='300' />

* User authentication and authorization via Passport (local and Google strategies)
* Password reset via Nodemailer
<img src='https://user-images.githubusercontent.com/35829634/160286201-253b3741-8893-4bc7-9bd4-f1ea37d6d0a7.gif' alt='' height='300' />

* User data stored in a MongoDB database
* Two playlists that boost creativity and problem-solving skills, fetched from Spotify's API
<img src='https://user-images.githubusercontent.com/35829634/160286333-feeeee4d-7382-45bb-8fb1-28908ea70e42.gif' alt='' height='300' />

* A built-in Pomodoro timer for an optimal work/break pattern
* A breath bubble that promotes cardiac coherence and instant relaxation
<img src='https://user-images.githubusercontent.com/35829634/160286347-90a23cf3-6b95-4a95-bfe3-f6d437f479db.gif' alt='' height='300' />

## Development
### Setup
#### Requirements
* [NodeJS](https://nodejs.org): >= 14
* [NPM](https://www.npmjs.com/): >= 8.1.2

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

### Install
```bash
# install dependencies
$ npm i 
```

### Deploy
You must log into [Heroku](https://id.heroku.com/login) first.

```bash
# create an Heroku app in the root directory
$ heroku create -a example-app
```

```bash
# deploy to Heroku
$ git push heroku main
```
