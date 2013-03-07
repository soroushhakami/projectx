
/*
 * GET home page.
 */

 exports.index = function(req, res){
 	res.render('index', { user: req.user });
 };

 exports.account = function(req, res){
 	res.render('account', { user: req.user });
 };

 exports.login = function(req, res){
 	res.render('login', { user: req.user });
 };

 exports.logout = function(req, res){
 	req.logout();
 	res.redirect('/');
 };

 exports.successRedirect = function(req, res) {
 	res.redirect('/');
 };