


structure.pages = {
	
};

structure.pageManager = function() {
	this.active = "";

	this.get = function(url, view) {
		// go get the view, 
	};
	
	this.new = function() {
		
	};
	
	this.setActive = function(page) {
		this.active = page;
	};
	this.wrap = function() {

	};
	this.wrapExisting = function() {
		$('#container').children().wrapAll('<div data-url="'+ window.location.pathname +'" data-view="'+ structure.views.active +'" class="resource active"></div>');
	};
	this.wrapString =  function(url, viewName, data) {
		return '<div data-url="' + url + '" data-view="' + viewName + '" class="inactive">' + data + '</div>';
	};
	
	$(document).ready(function() {
		this.wrapExisting();
	})
};





$(document).ready(function() {
	// order of the below matters.


	// INIT NEW VIEW HERE
	$('#container').children().wrapAll('<div data-url="'+ window.location.pathname +'" data-view="'+ structure.views.active +'" class="resource active"></div>');


	// load file 

	structure.views.Base.setActive(structure.views.active); // turn string into reference to real view obj.
	$('a[data-view]').click(function(e) {
		e.preventDefault();
		// INIT NEW VIEW HERE - WE NEED TO GO AND GET THE HTML
		var newView = $(this).attr('data-view');
		structure.views.Base.switch({
			to: newView, 
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
for(resource in structure.options.resources){
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
	app.get(resource, wrapper(structure.options.resources[resource].view));
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
		console.log("active: ", 	structure.views.active)
	},
	destroy: function() {
		//		delete this.domNode;
	},
	show: function() {
		console.log('Base show');
		// remove class inactive.
		this.domNode.hide().fadeIn('slow');
	},
	hide: function(callback) {
		console.log('Base hide');
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
				console.log('doing push state');
				that.pushState(options.state, options.to, options.href);
			}
			
			$.publish('VIEW_SWITCH', options);
//			structure.views.active.show();
			
		});
		console.log('options are: ', options);
		structure.views.active.hide(options);
	},
	setActive: function(view) {
		if(!structure.views[view]){
			alert('SET ACTIVE FAILED');
			return false;
		}else {
			structure.views.active = structure.views[view];
			console.log('set active', view, structure.views.active);
		}
	},
	getViewFromResource: function(resource) {
		return structure.options.resources[resource].view;
	},
	pushState: function(state, title, url) {
		window.history.pushState(state, title, url);
	},
	get: function(view, callback) {
		console.log('get view', view);
		this.fetchView(view, callback);
	},
	append: function(html) {
		$('#container').append(html);	
	},
	fetchView: function(url, callback) {
		var that = this;
		console.log('fetch view', url);
		
		
		
		var viewArr = url.split('/');
		if(viewArr[0])	{// hacky
			var viewName = viewArr[0];	
		} else if (viewArr[1]){ // meh
			var viewName = viewArr[1];	
		} else {
			var viewName = url;
		}
		
		var count = 1;
		var checkCallback = function(count, callback) {
			if(count == 3) { 
				callback();
			}
		};
		$.getScript(  url + '.js', 
			function() {
				checkCallback( count++ , callback );
			}
		);
		$.ajax({
			url:  url + '.css', 
			success: function(data) {
				checkCallback( count++ , callback );
			}
		});
		$.ajax({
			url:   url + '.html', 
			success: function(data) {
				if(!structure.views[viewName]){
					structure.views[viewName] = {};
				}
				structure.views[viewName].html = that.wrapView(url, viewName, data);
				checkCallback( count++ , callback );
			}
		});
	}, 
	wrapView: function(url, viewName, data) {
		return '<div data-url="' + url + '" data-view="' + viewName + '" class="inactive">' + data + '</div>';
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