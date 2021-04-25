# Ultimate Blog

Blog for Ultimate Frisbee players at AUBG with real-time chat. 

Implemented using Node.js, MongoDB, Jade (templating engine), web sockets (sockets.io) for chat.

## Installation

1. `npm install`
2. `npm start`
3. Check your localhost for the connection.

#### Warning note

* You need to set up your own email credentials, from which email notifications will be sent. Check `models/email.js` for the code. As you come up with your email and password, add them to the `.env` under `N_EMAIL` and `N_EMAIL_PASS` variables (keys).

* Make sure you have the `MONGODB_URI` (MongoDB connection string) in your `.env` file (in the root folder).


## Running with Docker

In the project root folder, where the file `docker-compose.yml` is located, run the following command:

```bash
docker-compose up
```

> Once the images are built, `docker-compose` will spin up the containers (`api` and `mongo`).

Now you can check your localhost

## Features

* Authentication (i.e. login/registration)
* Adding posts
* Adding comments under posts
* Post categories
* Real-time chat

## Contributions

If you are like "OMG, I want to see this/that feature!!!", feel free to open a PR and I will be glad to take a look and merge!
