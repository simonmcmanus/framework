var fs = require('fs');
var jsdom = require("jsdom");
var express = require('express');
var app = express.createServer( express.static(__dirname + "/public") );
var sizlate = require('sizlate');
app.modules = require('./modules.js');



/*hard coded modules*/

app.modules.flickr = require('./modules/flickr/app.js');
app.modules.flickr2 = require('./modules/flickr2/app.js');

app.modules.photo = require('./modules/photo/app.js');


app.views = {};

app.views['photo'] = {
	app: require('./views/photo/app.js')
};


app.configure(function() {
	app.set('view engine', 'html');
	app.set('dirname', __dirname);
	app.use('/static', express.static(__dirname + '/static')); 
});

app.register('.html', sizlate);
var jsdom = require('jsdom');
var Step = require('step');

var MODULES_DIRECTORY = '../modules';
jsdom.debugMode = true;

exports.serve = function(options) {

	express.static(__dirname + "/public")
	
	
    app.get('/layout.css',
    function(req, res) {
        res.download(app.set('dirname') + '/views/layout.css');
    });
    app.get('/layout.js',
    function(req, res) {
        res.download(app.set('dirname') + '/views/layout.js');
    });

    Step(
    function getModules() {
        var loadModules = function(modules, stepObj) {
			var c = modules.length;
			while (c--) {
				var p = './modules/' + modules[c] + '/app.js';
				
				
				var requireIfExists = function( path ) {
					return function( exists ) {
						if( exists ) {
							var v = require( path );
						}
					};
				};
				require('path').exists(p, requireIfExists(p));					
				app.modules.add(modules[c], app, stepObj.parallel());
				
			}
        };
        loadModules(options.sharedModules, this);
        for (pageSpec in options.pageSpecs) {
            loadModules(options.pageSpecs[pageSpec].modules, this);
        }
    },
    function loadView(error) {
        for (pageSpec in options.pageSpecs) {
            new exports.view(pageSpec, options);
        }
    }
    );    
    app.listen(options.port);
};


// if no selectors are specified create selectors with the ids from the module names on the view/layout specified.
	var buildSelectors = function(data, options, allOptions, view, pageSpec) {
    if (options.selectors) {
        // TODO: should really be merged with the below.
        return options.selectors;
    } else {
        var c = options.modules.length;
        selectors = {};
        while (c--) {
			if(data[options.modules[c]]){
				selectors['#' + options.modules[c]] = sizlate.doRender(app.modules[options.modules[c]].html, data[options.modules[c]]);
            } else {
	            selectors['#' + options.modules[c]] = app.modules[options.modules[c]].html;
            }
        }
        selectors['script#structureOptions'] = 'var structure = { options: ' + JSON.stringify(allOptions) + ' }; structure.views = { active: "'+ view +'" }; structure.pages = { active: "'+ pageSpec +'" }; ';
        return selectors;
    }
};
// TODO _ remove allOptions - its hacky
exports.view = function(view, options) {
    var that = this;

    var getFiles = function(view, options) {
        Step(
        function getFiles() {
            var viewPath = app.set('dirname') + '/views/' + options.pageSpecs[view].view + '/' + options.pageSpecs[view].view;
            fs.readFile(viewPath + '.html', 'utf8', this.parallel());
            fs.readFile(viewPath + '.css', 'utf8', this.parallel());
            fs.readFile(viewPath + '.js', 'utf8', this.parallel());
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

    var buildView = function(view, format) {

        app.get(view + '.:format?', function(req, res, next) {
			if(typeof req.params.format != 'undefined'  && req.params.format != 'html' ){
				next();
				return false;
			}
            var stepsA = [];
            //	Returns a function to be added to a steps array.
            var getSelectors = function(app, mod, that) {
                return function(err, data) {
	                if ( typeof app.modules[mod] != "undefined" && typeof app.modules[mod].getSelectors != "undefined" ) {
						app.modules[mod].getSelectors( req.params, that.parallel() );
					}
                }
            };
			/*
				so we can return null when getSelectors does not exist.
			*/
			var emptyCallback = function(callback) {
				callback(null, null);
			};

            var getModuleSelectors = function() {
				var modules = options.sharedModules.concat( options.pageSpecs[view].modules );
				this.modules = modules;
				var that = this;
                var c = modules.length;
                while ( c-- ) {
                    var mod = modules[c];
                    if ( typeof app.modules[mod] != "undefined" && typeof app.modules[mod].getSelectors != "undefined" ) {
	                     getSelectors(app, mod, that)();
                    }else {
						emptyCallback( that.parallel() );
					}
                }
            }

			stepsA.push( getModuleSelectors );
	
            var doRender = function( error ) {
				var modules = this.modules.reverse();
				var out = {};
				var c = arguments.length;
				while( c-- ){ // mix aguments with data to create {'flickr': {'img': 'blahs'}}
					if( c === 0 ) continue  // skip the error message
					out[ modules[ c-1 ] ] = arguments[ c ];
				}
                res.render( __dirname + '/views/' + options.pageSpecs[view].view + '/' + options.pageSpecs[view].view + format, {
                    layout: (req.params.format != 'html' ), /*layout false if format is .html */
                    classifyKeys: false,
                    selectors: buildSelectors( out, options.pageSpecs[view], options, options.pageSpecs[view].view, pageSpec )
                });
				return false;
            };
            stepsA.push( doRender );
            Step.apply( this, stepsA );
        });
    }


    /*
		returns a string containing all files of 'type' required for the view.
		type - eg. css or js
	*/
    var fetchModuleType = function(type, view) {
        var modules = options.pageSpecs[view].modules;
        var c = modules.length;
        var out = [];

        while (c--) {
            out.push('/* ' + type + ' From Module:' + modules[c] + ' */');
            out.push(app.modules[modules[c]][type]);
        }
        if (type == "js") {
            // for js modueles need to extend the view
			console.log('aaa', app.views[view] , view);
            if (app.views[view]) {
                out.unshift(app.views[view][type]);
                out.unshift('/* ' + type + ' From View:' + view + ' */');
            }
        } else {
            if (app.views[view]) {
                out.push('/* ' + type + ' From View:' + view + ' */');
                out.push(app.views[view][type]);
            }
        }
        return out.join('\r\n');
    };

    var fetchModuleTypeWrapper = function(type, view) {
        return function(req, res) {
			res.send(fetchModuleType(type, view));
        }
    }

    var init = function(view, options) {
        getFiles(view, options);
//        buildView('');
        buildView(view, '.html');
        app.get(view + '.css', fetchModuleTypeWrapper('css', view));
        app.get(view + '.js', fetchModuleTypeWrapper('js', view));
    };

    init(view, options);
};


app.get('/shared/shared.js',
function(req, res) {
    res.download('./shared/shared.js');
});

