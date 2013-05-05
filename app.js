#!/usr/bin/env node

var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    viewengine = require('./lib/viewengine'),
    db = require('./lib/db'),
    config = require('./lib/config'),
    userApi = require('./lib/user-api'),
    sessionApi = require('./lib/session-api'),
    teamApi = require('./lib/team-api'),
    session = require('./lib/session'),
    app = express();

var url = 'http://localhost:' + config.port + '/';
if (config.subdomain) {
    url = 'http://' + config.subdomain + '.jit.su/';
}

/*
 Mount sub-applications
 */
app.use(userApi);
app.use(sessionApi);
app.use(teamApi);

app.configure(function () {
    app.set('port', config.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session('your secret here'));
    app.use(session.initialize());
    app.use(session.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, config.env === 'production' ? 'client/dist' : 'client/src')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});


/*
 Configure routes
 */
app.get('/', routes.index);

app.get('/account', ensureAuthenticated, routes.account);

app.get('/login', routes.login);

app.post('/login', session.authenticate('local', {
    failureRedirect: '/login'
}), function (req, res) {
    res.redirect('/work');
});

app.get('/logout', routes.logout);

app.get('/work', ensureAuthenticated, routes.work);

app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    console.log(url);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}