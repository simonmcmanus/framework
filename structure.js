var fs = require( 'fs' );

var jsdom = require('jsdom');

var MODULES_DIRECTORY = '../modules';
jsdom.debugMode = true;






// on request

// auto find ids. 
// build css
// cache css
// build js 
// cache js
// build html 
// cache html
// build combined
// cache combined.


exports.view = function(options, app) {
	var that = this;
	var init = function(options) {
		getFiles(options.view);
	};
	
	
	var getFiles = function(view) {
		var files =  ['.js', '.css', '.html'];
		var c = files.length;
		while(c--){
			var wrapperCallback = function(type) {
				return function(err, data) {
					if( !err ){
						that[type.slice(1)].push(data);
						console.log(that);
					} else {
						console.log('ERROR');
					}
				};
			};
			that[files[c].slice(1)] = [];
			fs.readFile( app.set( 'dirname' )  + '/views/' + view + '/' + view + files[c], 'utf8', wrapperCallback(files[c]) );	
		}
	};
	
	app.get(options.url+":format?", function(req, res, next) {
		// if no selectors are specified, look for ids with same name as the module name on the view/layout specified.
		if(!options.selectors){
			// this is  all so wrong, this should this stuff is needed for css files and js files, at the moment you will only be able to get the full css after generating the html.
			var c = options.modules.length;
			selectors = {};
			
			var css = [];
			var js = [];
			while(c--){
				console.log(app.modules[options.modules[c]]);
				selectors['#'+options.modules[c]] = app.modules[options.modules[c]].html;
				 css.push(app.modules[options.modules[c]].css);
				 js.push(app.modules[options.modules[c]].js);
			}
			that.css = css.join('') + that.css;
			that.js =  js.join('') + that.js;
		}
 		if(typeof req.params.format == "undefined"){
			var layout = true;	
		}else if(req.params.format == '.html'){
			var layout = false;
		}else{
			next();
		}
		res.render(__dirname + '/views/' + options.view + '/' + options.view + '.html', {
			layout: layout,
			selectors: options.selectors || selectors
		});
	});



	
	app.get(options.url+'.css', function(req, res) {
		res.send(that.css);
	});
	
	app.get(options.url+'.js', function(req, res) {
		// add css from modules.
			res.send(that.js );
	});
	init(options);
};