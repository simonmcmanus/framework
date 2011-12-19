structure.views.harryDog = function() {
	var that = this;
	that.init($('#container div[data-view="harryDog"]')); // set domNode
	
 	that.show = function(options, callback) {
		console.log('harryDog show');
		that.domNode.removeClass('inactive').addClass('active').show();
		that.domNode.find('#flickr a, #flickr2 a').css({'position': 'relative', marginLeft: 0, left: 0, top: 0});
	};
	that.hide = function(options, callback) {
		that.domNode.find('h3').fadeOut();
		console.log('harryDog Hide');
		if(options && options.clicked){
			var $clicked = $(options.clicked);
			var DURATION = 200; 
			var href = $clicked.attr('href').split('/');
			var left = $clicked.offset().left;
			var top = $clicked.position().top;
			var o  = {
				position:'absolute',
				left: left, 
				top: top,
				zIndex: 10
			};

			$clicked.css(o);
		}else {
			$clicked = null; // set null for not clause to follow.
		}
		
		that.domNode.find('#flickr a, #flickr2 a').not($clicked).css('position', 'relative').animate({
			marginLeft:'-100px',
			left: '-100px' 
		}, DURATION);
		if(callback) {
			callback(options);
		}
	};
};

structure.views.harryDog.prototype =  structure.views.Base;
structure.views.harryDog = new structure.views.harryDog();
//views.contactMe.prototype.constructor = views.Base;
