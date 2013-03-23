var db = require('../db');

var express = require('express');
var app = module.exports = express();

app.get('/saveSession', function(req, res){
    var userOne = req.param('userOne');
    var userTwo = req.param('userTwo');
    db.saveSession(userOne, userTwo, function(response){
        res.send(response);
    });
});

app.get('/getSessionsForUser', function(req, res){
    var user = req.param('user');
    db.getSessionsForUser(user, function(response){
        res.send(response);
    });
});
