/**
 returns  an object containing all the modules in the approparite format. 

todo : serve consolidated files.

**/

var fs = require( 'fs' );
var jsdom = require('jsdom');


var MODULES_DIRECTORY = '/modules';
jsdom.debugMode = true;

//  adds routes to the application for the module.
addRoutes = function( moduleName, app ) {
	// todo : confirm these params pass into the callback correctly.
	// todo : do not add route if the files does not exist.
	var files =  ['.js', '.css', '.html'];
	var c = files.length;
	while(c--){
		var wrapperCallback = function(type) { // to pass in type
			return function(req, res) {
				res.send(exports[moduleName][type]);				
			}
		};
		app.get('/' + moduleName + files[c], wrapperCallback(files[c]));
	}
};

// fetches required files and sets up the routes.
exports.add = function( moduleName, app ) {
	var files =  ['.js', '.css', '.html'];
	var c = files.length;
	while(c--){
		var wrapperCallback = function(type) {
			return function(err, data) {
				if( !err ){
					if(!exports[moduleName]){
						exports[moduleName] = {};
					}
					exports[moduleName][type.slice(1)] = data;
				} else {
					console.log('ERROR');
				}
			};
		};
		var file = app.set( 'dirname' ) + MODULES_DIRECTORY + '/' + moduleName + '/' + moduleName + files[c];
		console.log( file );
		fs.readFile( file, 'utf8', wrapperCallback(files[c]) );	
	}
	addRoutes( moduleName, app );
};












/*
app.get('/' + moduleName, function( req, res ) {
	console.log( app.set( 'dirname' ) + '/' + MODULES_DIRECTORY + '/' + moduleName + '/' +moduleName+ '.html');
	jsdom.env({
		html: app.set( 'dirname' ) + '/' + MODULES_DIRECTORY + '/' + moduleName + '/' +moduleName+ '.html',
		scripts: [
		 	'http://code.jquery.com/jquery-1.5.min.js',
			'https://raw.github.com/PaulKinlan/leviroutes/master/routes-min.js',
			moduleName + '/file.js'
		] , 
		done: function( errors, window ) {
			var $ = window.$;
		 	$('body').append( '<style>' + exports[moduleName]['css'] + '</style>' );
			res.send( window.document.innerHTML );
		}
	});
});
*/

