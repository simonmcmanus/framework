/**
 returns  an object containing all the modules in the approparite format. 

todo : serve consolidated files.

**/

var fs = require( 'fs' );
var jsdom = require( 'jsdom' );


var MODULES_DIRECTORY = '/modules';
jsdom.debugMode = true;

//  adds routes to the application for the module.
addRoutes = function( moduleName, app ) {
	// todo : confirm these params pass into the callback correctly.
	// todo : do not add route if the files does not exist.
	var files =  ['.js', '.css', '.html'];
	var c = files.length;
	while(c--) {
		var wrapperCallback = function( type ) { // to pass in type
			return function( req, res ) {
				res.send( exports[moduleName][type] );
			}
		};
		app.get( '/' + moduleName + files[c], wrapperCallback( files[c] ) );
	}
};

// fetches required files and sets up the routes.

var Step = require('step');

exports.add = function( moduleName, app, callback ) {
	Step(
		function readFiles() {
			var file = app.set( 'dirname' ) + MODULES_DIRECTORY + '/' + moduleName + '/' + moduleName;
			console.log(file);
			fs.readFile( file + '.html', 'utf8', this.parallel() );
			fs.readFile( file + '.css', 'utf8', this.parallel() );
			fs.readFile( file + '.js', 'utf8', this.parallel() );
		}, 
		function showIt( err, html, css, js ) {	
			if( !err ){
				if( !exports[moduleName] ){
					exports[moduleName] = {};
				}
				
				exports[moduleName].html = html;
				exports[moduleName].css = css;
				exports[moduleName].js = js;
				return true;
			}else {
				console.log('THERE IS A PROBLEM WITH ONE OF YOUR MODULES');
			}
		},
		callback
	);
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

