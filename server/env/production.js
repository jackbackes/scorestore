/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production

 */

// module.exports = {
//     "DATABASE_URI": process.env.DATABASE_URI,
//     "SESSION_SECRET": process.env.SESSION_SECRET,
//     "TWITTER": {
//         "consumerKey": process.env.TWITTER_CONSUMER_KEY,
//         "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
//         "callbackUrl": process.env.TWITTER_CALLBACK
//     },
//     "FACEBOOK": {
//         "clientID": process.env.FACEBOOK_APP_ID,
//         "clientSecret": process.env.FACEBOOK_CLIENT_SECRET,
//         "callbackURL": process.env.FACEBOOK_CALLBACK_URL
//     },
//     "GOOGLE": {
//         "clientID": process.env.GOOGLE_CLIENT_ID,
//         "clientSecret": process.env.GOOGLE_CLIENT_SECRET,
//         "callbackURL": process.env.GOOGLE_CALLBACK_URL
//     }
// };

module.exports = {
    "DATABASE_URI": "postgres://localhost:5432/fsg",
    "SESSION_SECRET": "Optimus Prime is my real dad",
    "TWITTER": {
    "consumerKey": "mvREnUDXCHleASCawFj9ODpzH",
    "consumerSecret": "xPYdyTz5EqiQOae7tZKSPVt9Hezf5fTKIIcmnwIRxy6NjFK7WE",
    "callbackUrl": "http://127.0.0.1:1337/auth/twitter/callback"
    },
    "FACEBOOK": {
    "clientID": "1431968783496727",
    "clientSecret": "2ecaf8a1ad0f4e21b397dd58be75c303",
    "callbackURL": "http://127.0.0.1:1337/auth/facebook/callback"
    },
    "GOOGLE": {
    "clientID": "422783382244-3v2ue47880kjunhkh96uj3i4jvuni14l.apps.googleusercontent.com",
    "clientSecret": "6zcgLsBFZPuLo8wd1vPPnC5k",
    "callbackURL": "http://127.0.0.1:1337/auth/google/callback"
    }
};
