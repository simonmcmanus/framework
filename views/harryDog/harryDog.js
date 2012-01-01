structure.views.harryDog = function(domNode) {
	var that = this;
	that.init(domNode); // set domNode
 	that.show = function(options, callback) {
		console.log('harryDog show');
//		that.domNode.removeClass('inactive').addClass('active').show();
		that.domNode.find('h3').fadeIn('fast');
		that.domNode.find('a').show();
		that.domNode.find('#flickr a, #flickr2 a').show().css('position', 'relative').animate({ marginLeft: 0, left: 0, top: 0}, 400);
	};
	that.hide = function(options, callback) {
		var DURATION = (options.animateHide === false) ? 0 : 200; // allow animation to be disabled.
		that.domNode.find('h3').fadeOut(DURATION);
		if(options && options.clicked){
			var $clicked = $(options.clicked);
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
//views.contactMe.prototype.constructor = views.Base;
