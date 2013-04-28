var config = {};

config.MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI;
config.port = process.env.PORT;
config.env = process.env.NODE_ENV || 'development';
config.subdomain = process.env.SUBDOMAIN;

module.exports = config;