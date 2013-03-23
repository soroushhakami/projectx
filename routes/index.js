exports.index = function(req, res) {
	res.render('index', {
		user: req.user,
		title: 'Home'
	});
};

exports.account = function(req, res) {
	res.render('account', {
		user: req.user,
		title: 'Account'
	});
};

exports.login = function(req, res) {
	res.render('login', {
		user: req.user,
		title: 'Login'
	});
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.work = function(req, res) {
	res.render('work', {
		user: req.user,
		title: 'Work'
	});
};