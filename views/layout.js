


var getViewFromUrl = function(url) {
	var a =  url.split('/');
	return a[a.length-1];
};


structure.views.Base = {
	init: function($domNode) {
		this.domNode = $domNode;
	},
	destroy: function() {
		//		delete this.domNode;
	},
	show: function() {
		// remove class inactive.
		console.log('SHOW ');
		$('[data-url].inactive').show();
		this.domNode.hide().fadeIn('slow');
	},
	hide: function(callback) {
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
		fetchView(view, callback);
		// wrap returned 
		// add inactive to wrapped. 
	}
};


// on page load wrap container objects 




$(document).ready(function() {
	
	$('#container ').children().wrapAll('<div data-url="'+ window.location.pathname +'" data-view="'+ structure.views.active +'" class="resource active"></div>');
//	structure.views.active = window.location.pathname.split('/')[1]; // set the view - hacky
	$('a[data-view]').click(function(e) {
		e.preventDefault();

		var newView = $(this).attr('data-view');


		/*
		
		structure.resources.get( '', function()) {
			if(count)
				show()
		} );
		
		hide(function() {
			if(count)
				show()
		})
		
		show(function() {
			
		});
		
		*/


		
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
		//	structure.views.active.hide();
			structure.views[resourceView].show();
		}
	};
	app.get(resource, wrapper(structure.options.resources[resource].view));
}

var fetchView = function(url, callback) {
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
};


var sandbox = function() {
	var scope = {};
	var init = function() {
		
	};
	
	scope.switchView = function() {
		
	};
	
	init();
	return scope;
};
