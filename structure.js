var fs = require( 'fs' );
var jsdom = require("jsdom");
var express = require('express');
var app = express.createServer();
var sizlate = require('sizlate');
app.modules = require('./modules.js');
app.views = {};

app.configure( function () {
  app.set('view engine', 'html');
  app.set('dirname', __dirname);
});

app.register('.html', sizlate);
var jsdom = require('jsdom');
var Step = require('step');

var MODULES_DIRECTORY = '../modules';
jsdom.debugMode = true;

exports.serve = function(options) {
	Step(
		function getModules() {
			var that = this;
			var loadModules = function(modules) {
				var c = modules.length;
				while(c--){
					app.modules.add(modules[c], app, that.parallel());
				}
			};
			loadModules(options.sharedModules, app);
			for(view in options.views){
				loadModules(options.views[view].modules);
			}
		},
		function loadView() {
			for(view in options.views){
				new exports.view(options.views[view], options);
			}
		}
	);
};


// if no selectors are specified create selectors with the ids from the module names on the view/layout specified.
var buildSelectors = function(options, allOptions) {
	if(options.selectors){ // TODO: should really be merged with the below.
		return options.selectors;
	}else {
		var c = options.modules.length;
		selectors = {};
		while(c--){
			selectors['#'+options.modules[c]] = app.modules[options.modules[c]].html;
		}
		
		selectors['#structureOptions'] = 'var options = ' + JSON.stringify(allOptions);
		return selectors;
	}
};
// TODO _ remove allOptions - its hacky
exports.view = function(options, allOptions) {
	var that = this;

	
	var getFiles = function(view) {
		Step(
			function getFiles() {
				var viewPath = app.set( 'dirname' )  + '/views/' + view + '/' + view;
				fs.readFile( viewPath + '.html', 'utf8', this.parallel() );
				fs.readFile( viewPath + '.css', 'utf8',  this.parallel() );
				fs.readFile( viewPath + '.js', 'utf8', this.parallel() );
			},
			function setFiles(error, html, css, js) {
				app.views[view] = {
					html: html,
					css: css,
					js: js
				};
			}
		); 
	};
	
	var init = function(options) {
		getFiles(options.view);
		app.get('/layout.js', function(req, res) {
			res.download(app.set( 'dirname' )  + '/views/layout.js');
		});
	};


	app.get(options.url, function(req, res, next) {
		res.render(__dirname + '/views/' + options.view + '/' + options.view + '.html', {
			layout: true,
			selectors: buildSelectors(options, allOptions)
		});
	});

	app.get(options.url+".html", function(req, res, next) {
		res.render(__dirname + '/views/' + options.view + '/' + options.view + '.html', {
			layout: false,
			selectors: buildSelectors(options, allOptions)
		});
	});

	/*
		returns a string containing all files of 'type' required for the view.
		type - eg. css or js
	*/
	var fetchModuleType = function(type, view) {
		console.log('fetchmodule ', type, view);
		var modules = options.modules;
		var c = modules.length;
		var out = [];
		
		while(c--){
			out.push('/* ' + type + ' From Module:' + modules[c] + ' */');
			out.push(app.modules[modules[c]][type]);
		}
		if(type=="js"){ // for js modueles need to extend the view
			if(app.views[view]){
				out.unshift(app.views[view][type]);
				out.unshift('/* ' + type + ' From View:' + view + ' */');
			}
		}else {
			if(app.views[view]){
				out.push('/* ' + type + ' From View:' + view + ' */');
				out.push(app.views[view][type]);
			}	
		}
		return out.join('\r\n');
	};

	var fetchModuleTypeWrapper = function(type, view) {
		return function(req, res) {
			res.send( fetchModuleType( type, view ) );
		}
	}
	app.get( options.url + '.css', fetchModuleTypeWrapper( 'css', options.view ) );
	app.get( options.url + '.js', fetchModuleTypeWrapper( 'js', options.view ) );
	
	init( options );
};


app.get('/shared/shared.js', function(req, res) {
	res.download('./shared/shared.js');
});


app.listen(81);