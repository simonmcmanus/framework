var jsdom = require("jsdom");
var express = require('express');
var app = express.createServer();
var sizlate = require('sizlate');


app.modules = require('./modules.js');
var structure = require('./structure.js');


app.configure( function () {
  app.set('view engine', 'html');
  app.set('dirname', __dirname);
});

app.register('.html', sizlate);

// add modules

app.modules.add('mainNav', app);
app.modules.add('content', app);
app.modules.add('contact', app);


var views = {};
views.home = structure.view({
	url: '/home',
	view: 'home',
	modules: [
		'mainNav',
		'content'
	]
}, app);


/*

views.home = structure.view({
	url: '/jstraining',
	view: 'file.html',
	modules: [
		'mainNav',
		'content'
	]
}, app);


views.contact = structure.view({
	url: '/contactMe',
	view: 'contactMe.html',
	modules: [
		'mainNav',
		'contact'
	]
}, app);
*/


app.get('/shared/shared.js', function(req, res) {
	res.download('./shared/shared.js');
});


app.listen(80);



// requesting /

