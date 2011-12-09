var fs = require('fs');
var jsdom = require("jsdom");
var express = require('express');
var app = express.createServer();
var sizlate = require('sizlate');
app.modules = require('./modules.js');




/*hard coded modules*/

app.modules.flickr = require('./modules/flickr/app.js');
app.modules.flickr2 = require('./modules/flickr2/app.js');



app.views = {};

app.views['photo'] = {
	app: require('./views/photo/app.js')
};


app.configure(function() {
    app.set('view engine', 'html');
    app.set('dirname', __dirname);
});

app.register('.html', sizlate);
var jsdom = require('jsdom');
var Step = require('step');

var MODULES_DIRECTORY = '../modules';
jsdom.debugMode = true;

exports.serve = function(options) {

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
				//console.log('adding', modules[c]);
				app.modules.add(modules[c], app, stepObj.parallel());
			}
        };
        loadModules(options.sharedModules, this);
        for (view in options.views) {
            loadModules(options.views[view].modules, this);
        }
    },
    function loadView() {
        for (view in options.views) {
            new exports.view(options.views[view], options);
        }
    }
    );
    
    app.listen(options.port);
};


// if no selectors are specified create selectors with the ids from the module names on the view/layout specified.
var buildSelectors = function(data, options, allOptions) {
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
        selectors['script#structureOptions'] = 'var options = ' + JSON.stringify(allOptions);
        return selectors;
    }
};
// TODO _ remove allOptions - its hacky
exports.view = function(options, allOptions) {
    var that = this;


    var getFiles = function(view) {
        Step(
        function getFiles() {
            var viewPath = app.set('dirname') + '/views/' + view + '/' + view;
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

    var buildView = function(format, layout) {
	
        app.get(options.url + format,
        function(req, res, next) {
            var stepsA = [];
            //	Returns a function to be added to a steps array.
            var getSelectors = function(app, mod, that) {
                return function(err, data) {
	                if ( typeof app.modules[mod] != "undefined" && typeof app.modules[mod].getSelectors != "undefined" ) {
						app.modules[mod].getSelectors( that.parallel() );
					}
                }
            };

            var getModuleSelectors = function() {
				var that = this;
                var modules = allOptions.sharedModules.concat(options.modules);
                var c = modules.length;
				var out = [];
                while (c--) {
                    var mod = modules[c];
                    if ( typeof app.modules[mod] != "undefined" && typeof app.modules[mod].getSelectors != "undefined" ) {
	                     getSelectors(app, mod, that)();
                    }else {
						that.parallel()();
					}
                }
            }

			stepsA.push(getModuleSelectors);

            var doRender = function(err, data, data2) {
				console.log('>>');
	
				if(err){
					console.log('ERROR: ', err[0].message);
				}
				if(data && data2){
					var out = {
						'flickr': data,
						'flickr2': data2
					};
				}else {
					var out = {};
				}
				var selectors = buildSelectors(out, options, allOptions);
                res.render(__dirname + '/views/' + options.view + '/' + options.view + format, {
                    layout: layout,
                    classifyKeys: false,
                    selectors: selectors
                });
            };
            stepsA.push(doRender);

            Step.apply(this, stepsA);
        });
    }


    /*
		returns a string containing all files of 'type' required for the view.
		type - eg. css or js
	*/
    var fetchModuleType = function(type, view) {
        var modules = options.modules;
        var c = modules.length;
        var out = [];

        while (c--) {
            out.push('/* ' + type + ' From Module:' + modules[c] + ' */');
            out.push(app.modules[modules[c]][type]);
        }
        if (type == "js") {
            // for js modueles need to extend the view
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

    var init = function(options) {
        getFiles(options.view);
        buildView('', true);
        buildView('.html', false);
        app.get(options.url + '.css', fetchModuleTypeWrapper('css', options.view));
        app.get(options.url + '.js', fetchModuleTypeWrapper('js', options.view));
    };

    init(options);
};


app.get('/shared/shared.js',
function(req, res) {
    res.download('./shared/shared.js');
});

