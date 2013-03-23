var db = require('../db');

var express = require('express');
var app = module.exports = express();

app.get('/users', function(req, res){
    db.getUsers(function(users){
      res.send(users);
  });
});