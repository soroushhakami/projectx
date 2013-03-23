var config = {};


config.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
config.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
config.MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI;

config.port = process.env.PORT;

module.exports = config;