# Ultimate Blog
Blog for Ultimate Frisbee players at AUBG. Created for learning & experimenting purposes.

## Warning note

* You need to set up your own email credentials, from which email notifications will be sent. Check `models/email.js` for the code. As you come up with your email and password, add them to the `.env` under `N_EMAIL` and `N_EMAIL_PASS` variables (keys).

* Make sure you have the `MONGODB_URI` (MongoDB connection string) in your `.env` file (in the root folder).

## Installation

1. `npm install`
2. `npm start`
3. Check your localhost for the connection.

## Running with Docker

In the project root folder, where the file `docker-compose.yml` is located, and run the following command:

```bash
docker-compose up
```

> Once the images are built, `docker-compose` will spin up the containers (`api` and `mongo`).

Now you can check your localhost


## Live demo

*Coming soon*

## Current version

Supports:

* Authentication (i.e. login/registration)
* Adding posts
* Adding comments under posts
* Post categories
* Real-time chat

## Dependencies

Check out the `package.json` file.

## Development & Ideas
If you have any suggestions on how to style *better*, you are more than welcome to send the ideas &/or sketches here b.g.nuryyev at Gmail (credits are guaranteed). Also, if you are like "OMG, I want to see this/that feature!!!", send me the ideas and you will (hopefully) see them soon added & uploaded (again, credits are guaranteed). 


## Feel free to fork and experiment with it!
