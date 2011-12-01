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

var MODULES_DIRECTORY = '../modules';
jsdom.debugMode = true;


/*
expects: 
{
	port: 80,
	static: '/static',
	sharedModule: ['shared'],
	views {
		home:  {
			url: '/home',
			view: 'home',
			modules: [
				'mainNav',
				'content'
			]
		}
	}
}

*/
exports.serve = function(options) {
	var loadModules = function(modules) {
		var c = modules.length;
		while(c--){
			app.modules.add(modules[c], app);
		}
	};
	loadModules(options.sharedModules, app);
	for(view in options.views){
		loadModules(options.views[view].modules);
		new exports.view(options.views[view], app);
	}
};

exports.view = function(options) {
	var that = this;
	var init = function(options) {
		getFiles(options.view);
		app.get('/layout.js', function(req, res) {
			res.download(app.set( 'dirname' )  + '/views/layout.js');
		});
		
	};
	
	var getFiles = function(view) {
		var files =  ['.js', '.css', '.html'];
		var c = files.length;
		while(c--){
			var wrapperCallback = function(type) {
				return function(err, data) {
					if( !err ){
						if(!app.views[view]){
							app.views[view] = {};
						};
						app.views[view][type.slice(1)] = data;
					} else {
						console.log('ERROR');
					}
				};
			};
			that[files[c].slice(1)] = [];
			var fileName = app.set( 'dirname' )  + '/views/' + view + '/' + view + files[c];
			fs.readFile( fileName, 'utf8', wrapperCallback(files[c]) );	
		}
	};
	
	// if no selectors are specified create selectors with the ids from the module names on the view/layout specified.
	var buildSelectors = function(options) {
		if(options.selectors){ // TODO: should really be merged with the below.
			return options.selectors;
		}else {
			var c = options.modules.length;
			selectors = {};
			while(c--){
				selectors['#'+options.modules[c]] = app.modules[options.modules[c]].html;
			}
			return selectors;
		}
	};
	
	app.get(options.url, function(req, res, next) {
		res.render(__dirname + '/views/' + options.view + '/' + options.view + '.html', {
			layout: true,
			selectors: buildSelectors(options)
		});
	});
	
	app.get(options.url+".html", function(req, res, next) {
		res.render(__dirname + '/views/' + options.view + '/' + options.view + '.html', {
			layout: false,
			selectors: buildSelectors(options)
		});
	});

	/*
		returns a string containing all files of 'type' required for the view.
		type - eg. css or js
	*/
	var fetchModuleType = function(type, view) {
		var modules = options.modules;
		var c = modules.length;
		var out = [];
		
		while(c--){
			out.push('/* ' + type + ' From Module:' + modules[c] + ' */');
			out.push(app.modules[modules[c]][type]);
		}
		if(type=="js"){ // for js modueles need to extend the view
			out.unshift('/* ' + type + ' From View:' + view + ' */');
			out.unshift(app.views[view][type]);
			
		}else {
			out.push('/* ' + type + ' From View:' + view + ' */');
			out.push(app.views[view][type]);
			
		}
		
		return out.join('\r\n');
	};

	var fetchModuleTypeWrapper = function(type, view) {
		console.log(type, view);
		return function(req, res) {
			res.send(fetchModuleType(type, view));
		}
	}
	app.get(options.url+'.css', fetchModuleTypeWrapper('css', view));
	app.get(options.url+'.js', fetchModuleTypeWrapper('js', view));
	
	init(options);
};


app.get('/shared/shared.js', function(req, res) {
	res.download('./shared/shared.js');
});


app.listen(81);
/*
var buildConsollidated = function() {
	var css = [];
	var js = [];
	css.push(app.modules[options.modules[c]].css);
	js.push(app.modules[options.modules[c]].js);
	that.css = css.join('') + that.css;
	that.js =  js.join('') + that.js;
	
};
*/
