structure.views.harryDog = function() {
	var that = this;
	that.init($('#container div[data-view="harryDog"]')); // set domNode
	
	
	
	that.show = function(options, callback) {
		console.log('harryDog show');
		$('#container div[data-view="harryDog"]').removeClass('inactive').addClass('active').show();
		$('#flickr a, #flickr2 a').css({'position': 'relative', marginLeft: 0, left: 0, top: 0});
		
	};
	that.hide = function(options, callback) {
		console.log('harryDog Hide');
		if(options && options.clicked){
			var $clicked = $(options.clicked);
			var DURATION = 200; 
			var href = $clicked.attr('href').split('/');
			structure.views.Base.get(href[1] + '/' + href[2], function() {
				
				var left = $clicked.offset().left;
				var top = $clicked.position().top;
				var o  = {
					position:'absolute',
					left: left, 
					top: top,
					zIndex: 10
				};

				$clicked.css(o);
				$('#flickr a, #flickr2 a').not($clicked).css('position', 'relative').animate({
					marginLeft:'-100px',
					left: '-100px' 
				}, DURATION);

				setTimeout(function() {
					var endPos = {
						top: top,
						left: left
					};
					structure.views.photo.show(endPos);	
					structure.views.photo.switch('photo', $clicked.attr('href'));
				}, DURATION/2);
			});
		}else {
			console.log('edge case not covered.');
		}
		if(callback) {
			callback();
		}
	};
};

structure.views.harryDog.prototype =  structure.views.Base;
structure.views.harryDog = new structure.views.harryDog();
//views.contactMe.prototype.constructor = views.Base;
