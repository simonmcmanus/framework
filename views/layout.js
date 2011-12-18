

$(document).ready(function() {
	$('#container ').children().wrapAll('<div data-url="'+ window.location.pathname +'" data-view="'+ structure.views.active +'" class="resource active"></div>');
	$('a[data-view]').click(function(e) {
		e.preventDefault();
		var newView = $(this).attr('data-view');
		structure.views[structure.views.active].hide({
			clicked: this
		}, function() {
				structure.views.Base.get(structure.options.resources[newView].view, function() {
				structure.views.active = newView;
			});
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
			
			// figure out how active is going to work. 
			if(structure.views.active.hide){
				structure.views.active.hide();
			}
			console.log('rv', structure.views[resourceView]);
			structure.views.active = resourceView;
			structure.views[resourceView].show();
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
	switch: function(newView, href) {
//		structure.views..hide();
		structure.views.active = structure.views[newView];
		window.history.pushState(undefined, newView, href);
		structure.views.active.show();
	},
	setActive: function(view) {
		structure.views.active = views[view];
	},
	get: function(view, callback) {
		this.fetchView(view, callback);
	},
	fetchView: function(url, callback) {
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
		$.getScript( '/' + url + '.js', 
			function() {
				// this callback does not seem to be called.
				checkCallback( count++ , callback );
			}
		);
		// load css 
		$.ajax({
			url:  '/' + url + '.css', 
			success: function(data) {
				checkCallback( count++ , callback );
			}
		});
		// load html
		$.ajax({
			url:  '/' + url + '.html', 
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
