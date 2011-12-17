structure.views.harryDog = function() {
	var that = this;
	this.domNode = $('#container');
	
	that.hide = function(options, callback) {
		var $clicked = $(options.clicked);
		$('h3').fadeOut('slow');
					var $keeper = $clicked; 

			var DURATION = 200; 
			var href = $clicked.attr('href').split('/');
			structure.views.Base.get(href[1] + '/' + href[2], function() {
				$('h3').fadeOut('slow');
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
					structure.views.photo.show(endPos);	
					structure.views.photo.switch('photo', $keeper.attr('href'));
				}, DURATION/2);
			});
		
	};
};

structure.views.harryDog.prototype =  structure.views.Base;
structure.views.harryDog = new structure.views.harryDog();
//views.contactMe.prototype.constructor = views.Base;
