var db = require('../db');

var express = require('express');
var app = module.exports = express();

app.use(express.bodyParser());

app.post('/team', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        email = req.body.email;
    db.saveTeam(name, password, email, function (status) {
        res.send(status);
    });
});
