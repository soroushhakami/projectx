var hbs = require('hbs'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config');

registerPartialsFromDir(path.join(__dirname, '..', 'views/partials'));

hbs.registerHelper('isWork', function (options) {
    if (this.title === 'Work') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isHome', function (options) {
    if (this.title === 'Home') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isAccount', function (options) {
    if (this.title === 'Account') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('isLogin', function (options) {
    if (this.title === 'Login') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('inDevelopment', function (options) {
    if (config.env === 'development') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

function registerPartialsFromDir(partialsDir) {
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
}

module.exports = hbs;