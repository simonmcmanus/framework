



structure.specManager = {
	getViewFromSpec: function(pageSpec) {
		return structure.options.pageSpecs[pageSpec].view;
	}
};

structure.pageManager = function(page) {
	var scope = {};
	
	scope.pages = {};
	var views = {};
	var modules = {};

	scope.active = page || structure.pages.active ;

	scope.get = function(url, pageSpec, callback) {
		// check if we already have the domNode
		$node = $(scope.wrapString(url,  pageSpec));
		$node.appendTo('#container');// setup domNode
		$($node).load(url + '.html', function(data) { // go get contents 
			scope.new(url, $node,  {})
			if(callback){
				callback();
			}
		});
	};

	scope.show = function(options) {
		scope.pages[options.href].show(options);
		scope.setActive(scope.pages[options.href].domNode);
	};

	scope.new = function(url, domNode, options) {
		console.log('new called ', url);
		var pageSpec = $(domNode).attr('data-pageSpec');
		scope.pages[url] = new structure.views[structure.specManager.getViewFromSpec(pageSpec)](domNode);  // add view functions to the obj
		scope.pages[url].domNode = domNode; 
		console.log('new done');
	};
	
	scope.setActive = function(domNode) {
		scope.pages.activeNode = domNode;
//		$('#container .active').removeClass('active').addClass('inactive');
//		domNode.addClass('active').removeClass('active');
//		scope.active = page;
	};
	scope.wrapExisting = function() {
		var $wrapper = $('<div data-url="'+ window.location.pathname +'" data-pageSpec="'+ structure.pages.active +'" class="active"></div>');
		var $w = $('#container').children().wrapAll($wrapper);
		return $('#container [data-url]'); // todo : not keen on this - we should be able to get the object from a return value. $wrapper and $w dont seem to do the job.
	};
	scope.wrapString =  function(url, pageSpec, data) {
		return '<div data-url="' + url + '" data-pageSpec="' + pageSpec + '" class="inactive">' + data || "" + '</div>';
	};
	
	scope.pushState = function(state, title, url) {
		window.history.pushState(state, title, url);
	}
	
	
	scope.switch = function(options) {
		var c = 0;
		var show = function(c) {
			if(c==2){ // once we have hidden the active view and got the new view....
				scope.show(options);
			}
		};
		
		// hide the active page? hjow is hide going to work?
		// do hide
		structure.pageManager.pages[structure.pages.active].hide(options, function() {
			c++;
			show(c);
		});
		scope.get(options.href, options.pageSpec, function() {
			c++;
			show(c);
		});
	};

	var createPageOnLoad = function(){
//		scope.setActive(window.location.pathname);
		scope.new(scope.active, scope.wrapExisting(),  {});
	};
	createPageOnLoad();
	return scope;
};


/*

// duck punch the hide method so it does the right thing on show and hide. 

(function($, structure){
   // store original reference to the method
    var _oldHide = $.fn.hide;
 
    $.fn.hide = function(){
		var url = $(this).attr('data-url');
		if(url){
			
			return structure.pageManager.pages[url].hide.apply(this, arguments);
		}else {
           return _oldHide.apply(this,arguments);
		}
    };
})(jQuery, structure);




*/


$(document).ready(function() {

	// order of the below matters.
	structure.pageManager = structure.pageManager();



	// load file 

	structure.views.Base.setActive(structure.views.active); // turn string into reference to real view obj.
	$('a[data-pagespec]').click(function(e) {
		e.preventDefault();
		// INIT NEW VIEW HERE - WE NEED TO GO AND GET THE HTML
		var newView = $(this).attr('data-pagespec');
		structure.pageManager.switch({
			pageSpec: newView, 
			href: $(this).attr('href'),
			clicked: this,
			doPushState: true
		});
		return false;
	});
});




/*
Auto generates leviroutes pop state listeners. 
*/
var app = new routes();
for(pageSpec in structure.options.pageSepcs){
	var wrapper = function(resourceView) {
		return function(req) {
			// should not call switch if page is being loaded for the first time.
			console.log('popstate called');
		//	structure.views.active.show();
/*
			console.log(arguments);
			structure.views.active.switch({
				to: resourceView
			});
		*/
		}
	};
	app.get(resource, wrapper(structure.options.pageSpecs[pageSpec].view));
}


structure.views.Base = {
	init: function($domNode) {
		var that = this;
		
		// we should not do this on document ready becuase it wont be fired when we load in new bits ajaxically.f
		
		
		// do we have a the domNode
		// do we have the html fragment?
		
		// we actually want this to happen ever time we load in a new view or 3 
		this.setupDomNode();
		$(document).ready(function() {
			that.domNode = $domNode;
		});
	},
	setupDomNode: function() {
		//console.log("active: ", 	structure.views.active)
	},
	destroy: function() {
		//		delete this.domNode;
	},
	show: function() {
		//console.log('Base show');
		// remove class inactive.
		this.domNode.hide().fadeIn('slow');
	},
	hide: function(callback) {
		//console.log('Base hide');
		this.domNode.fadeOut('slow', callback);
		// add class in active 
	}, 
	showModules: function(callback) {
		
	},
	hideModules: function(callback) {
		
	},
	/*
		The function to call when you want to open a new view, does everything you need including push state unless disabled.
	*/
	switch: function(options) {
		var that = this;
		this.get(options.href, function() {
			that.setActive( that.getViewFromResource( options.to ) );
			if(options.doPushState != false){
				//console.log('doing push state');
				that.pushState(options.state, options.to, options.href);
			}
			
			$.publish('VIEW_SWITCH', options);
//			structure.views.active.show();
			
		});
		//console.log('options are: ', options);
		structure.views.active.hide(options);
	},
	setActive: function(view) {
		if(!structure.views[view]){
			alert('SET ACTIVE FAILED');
			return false;
		}else {
			structure.views.active = structure.views[view];
		}
	},
	getViewFromResource: function(pageSpec) {
		return structure.options.pageSepcs[pageSpec].view;
	}
};



(function($) {

  var o = $({});

	var events = {
		VIEW_SWITCH: 'Called when the first view is hidden and its about to show the new view',
	};

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery))







structure.moduleManager = function() {

	var init = function() {
		// check for existing module domNodes.
		// what do we do about css/js here? if its in the page it will already have been loaded.
	};


	// are modules specific to a view? we instantiate the module for the page? right? surely?
	
 
	/*
		stores the modules html / css  and js 
	*/
	that.modules = {
		sample: {
			html: "",
			css: "",
			js: ""
		}
	};


	that.get = function(moduleName) {
		
		
		// was it loaded on the page already.
		// do we already have the module
		// if not get it 
	};
	
	that.loadModules = function() {
		
	};
	
	that.loadModule = function() {
		
	};
};
