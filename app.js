#!/usr/bin/env node

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    hbs = require('hbs'),
    db = require('./lib/db'),
    env = process.env.NODE_ENV || 'development',
    config = require('./lib/config'),
    url = 'http://localhost:' + config.port + '/',
    userApi = require('./lib/user-api'),
    sessionApi = require('./lib/session-api'),
    teamApi = require('./lib/team-api'),
    session = require('./lib/session');

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

var app = express();
app.use(userApi);
app.use(sessionApi);
app.use(teamApi);

app.configure(function () {
    app.set('port', process.env.PORT || config.port);
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
    app.use(express.static(path.join(__dirname, env == 'production' ? 'client/dist' : 'client/src')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/account', ensureAuthenticated, routes.account);

app.get('/login', routes.login);

app.post('/login',
    session.authenticate('local', {
        failureRedirect: '/login'
    }), function (req, res) {
        res.redirect('/work');
    });

app.get('/logout', routes.logout);

app.get('/work', ensureAuthenticated, routes.work);

var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);
filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
    hbs.registerPartial(name, template);
});

hbs.registerHelper('isWork', function (options) {
    if (this.title == 'Work') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isHome', function (options) {
    if (this.title == 'Home') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isAccount', function (options) {
    if (this.title == 'Account') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isLogin', function (options) {
    if (this.title == 'Login') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('inDevelopment', function (options) {
    if (env === 'development') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    console.log(url);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}