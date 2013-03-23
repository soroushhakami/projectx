var mongoose = require('mongoose');
var config = require('../config');
var db;
var User;
var Session;

var uri = config.MONGO_CONNECTION_URI;

mongoose.connect(uri);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('successfully connected to database');
});

var userSchema = new mongoose.Schema({
	name: String,
	image: String
});
User = mongoose.model('User', userSchema);

var sessionSchema = new mongoose.Schema({
	users: [],
	date: Date
});
Session = mongoose.model('Session', sessionSchema);

exports.saveUser = function(name, image) {
	var user = new User({
		name: name,
		image: image
	});

	user.save(function(err) {
		if (err) console.log('error saving ' + name);
	});
};


exports.getUsers = function(cb) {
	var query = User.find();
	query.exec(function(err, res) {
		if (err) cb('error getting users');

		cb(res);
	});
};

exports.saveSession = function(userOne, userTwo, cb) {
	var session = new Session({
		users: [userOne, userTwo],
		date: new Date()
	});

	session.save(function(err, res) {
		if (err) {
			cb(err);
			console.log('error saving ' + name);
		} else {
			cb(res);
		}
	});
};

exports.getAllSessions = function(cb) {
	var query = Session.find();
	query.exec(function(err, res) {
		if (err) cb('error getting users');

		cb(res);
	});
};

exports.getSessionsForUser = function(name, cb) {
	Session.find({
		users: {
			$all: [name]
		}
	}).exec(function(err, res) {
		if (err) cb('error getting sessions for ' + name);

		cb(res);
	});
};