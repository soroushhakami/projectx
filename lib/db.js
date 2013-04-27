var mongoose = require('mongoose');
var config = require('./config');
var bcrypt = require('bcrypt');
var db;
var User;
var Session;
var SALT_WORK_FACTOR = 10;

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

var teamSchema = mongoose.Schema({
    teamname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

teamSchema.pre('save', function (next) {
    var team = this;

    if (!team.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(team.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            team.password = hash;
            next();
        });
    });
});

teamSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var Team = mongoose.model('Team', teamSchema);

exports.saveTeam = function (teamname, password, email, cb) {
    var team = new Team({ teamname: teamname, email: email, password: password });
    team.save(function (err) {
        if (err) {
            console.log(err);
            cb('error');
        } else {
            console.log('team: ' + team.teamname + " saved.");
            cb('success');
        }
    });
};

exports.getTeam = function (teamname, cb) {
    Team.findOne({
            teamname: teamname
        },

        function (err, team) {
            cb(err, team);
        });
};

exports.saveUser = function (name, image) {
    var user = new User({
        name: name,
        image: image
    });

    user.save(function (err) {
        if (err) {
            console.log('error saving ' + name);
        }
    });
};


exports.getUsers = function (cb) {
    var query = User.find();
    query.exec(function (err, res) {
        if (err) {
            cb('error getting users');
        }

        cb(res);
    });
};

exports.saveSession = function (userOne, userTwo, cb) {
    var session = new Session({
        users: [userOne, userTwo],
        date: new Date()
    });

    session.save(function (err, res) {
        if (err) {
            cb(err);
            console.log('error saving ' + name);
        } else {
            cb(res);
        }
    });
};

exports.getAllSessions = function (cb) {
    var query = Session.find();
    query.exec(function (err, res) {
        if (err) {
            cb('error getting users');
        }

        cb(res);
    });
};

exports.getSessionsForUser = function (name, cb) {
    Session.find({
        users: {
            $all: [name]
        }
    }).exec(function (err, res) {
            if (err) {
                cb('error getting sessions for ' + name);
            }

            cb(res);
        });
};