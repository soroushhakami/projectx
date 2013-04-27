var passport = require('passport'),
    db = require('./db'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (team, done) {
    done(null, team.teamname);
});

passport.deserializeUser(function (teamname, done) {
    db.getTeam(teamname, function (err, team) {
        done(err, team);
    });
});

passport.use(new LocalStrategy(function (teamname, password, done) {
    db.getTeam(teamname, function (err, team) {
        if (err) {
            return done(err);
        }
        if (!team) {
            return done(null, false, {
                message: 'Unknown team ' + teamname
            });
        }
        team.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, team);
            } else {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
        });
    });
}));

module.exports = passport;
