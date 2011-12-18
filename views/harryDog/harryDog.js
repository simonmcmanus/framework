structure.views.harryDog = function() {
	var that = this;
	that.init($('#container div[data-view="harryDog"]')); // set domNode
	
	
	
	that.show = function(options, callback) {
		console.log('harryDog show');
		$('#container div[data-view="harryDog"]').removeClass('inactive').addClass('active').show();
		$('#flickr a, #flickr2 a').css({'position': 'relative', marginLeft: 0, left: 0, top: 0});
		if(callback) {
			callback();
		}
	};
	that.hide = function(options, callback) {
		console.log('harryDog Hide');
		var $clicked = $(options.clicked);
		var $keeper = $clicked; 

			var DURATION = 200; 
			var href = $clicked.attr('href').split('/');
			structure.views.Base.get(href[1] + '/' + href[2], function() {
				var left = $keeper.offset().left;
				var top = $keeper.position().top;
				var o  = {
					position:'absolute',
					left: left, 
					top: top,
					zIndex: 10
				};
				$keeper.css(o);

				$('#flickr a, #flickr2 a').not($keeper).css('position', 'relative').animate({
					marginLeft:'-100px',
					left: '-100px' 
				}, DURATION);
				setTimeout(function() {
					var endPos = {
						top: top,
						left: left
					};
					$('#container .active').addClass('inactive').removeClass('active');
					structure.views.photo.show(endPos);	
					structure.views.photo.switch('photo', $keeper.attr('href'));
						
				}, DURATION/2);
				
				that.domNode.hide();
			});
		
	};
};

structure.views.harryDog.prototype =  structure.views.Base;
structure.views.harryDog = new structure.views.harryDog();
//views.contactMe.prototype.constructor = views.Base;
