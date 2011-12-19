

$(document).ready(function() {
	
	structure.views.Base.setActive(structure.views.active); // turn string into reference to real view obj.
	$('#container ').children().wrapAll('<div data-url="'+ window.location.pathname +'" data-view="'+ structure.views.active +'" class="resource active"></div>');
	$('a[data-view]').click(function(e) {
		e.preventDefault();
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
			structure.views.active.show();
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
		this.domNode = $domNode;
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
		options = {
			to: options.to, 
			href: options.href,
			doPushState: options.doPushState || true
		};
		
		this.get(options.href, function() {
			that.setActive( that.getViewFromResource( options.to ) );
			if(options.doPushState != false){
				console.log('doing push state');
				that.pushState(options.state, options.to, options.href);
			}
			structure.views.active.show();
			
		});
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
	fetchView: function(url, callback) {
		console.log('fetch view', url);
		
		
		
		var viewArr = url.split('/');
		if(viewArr[0])	{// hacky
			var viewName = viewArr[0];	
		}else {
			var ViewName = url;
		}

		var count = 1;
		var checkCallback = function(count, callback) {
			if(count == 3) { 
				callback();
			}
		};

		// load script
		$.getScript(  url + '.js', 
			function() {
				checkCallback( count++ , callback );
			}
		);
		// load css 
		$.ajax({
			url:  url + '.css', 
			success: function(data) {
				checkCallback( count++ , callback );
			}
		});
		// load html
		$.ajax({
			url:   url + '.html', 
			success: function(data) {
				if(!structure.views[viewName]){
					structure.views[viewName] = {};
				}
				structure.views[viewName].html = '<div data-url="' + url + '" data-view="' + viewName + '" class="inactive">' + data + '</div>';
				checkCallback( count++ , callback );
			}
		});
	}
};
