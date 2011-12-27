
structure.views.photo = function(domNode) {
	var that = this;
	that.domNode = domNode;
	// we should 
 	that.init(domNode); // set domNode
	
	that.hide = function(options, callback) {
		
		// container should be cached at an app level
		var h = $('#container').css('height');
		$('#container').css('height', h);
		$clicked = $(options.clicked);
		// util? - shuold be part of the flickr class
		var $loading = $('<span class="loading">loading</span>');
		that.domNode.find('.info').fadeOut();
		$loading.css({
			left: $clicked.position().left
		})
		$clicked.append($loading);
		// photo fade out 
		that.domNode.find('#photo img').animate({'opacity': 0}, 200, callback);
	};
	
	// delete?
	var showOtherPics = function() {
		$('#flickr').css({
			top: '5em',
			position:'relative'
		}).animate({
			top: 0
		});
	};
	
	
	that.show = function(options, callback) {
		var DURATION = 800;
		var EASING = 'easeOutCirc';
		
		
		// module method
		that.domNode.find('#photo img').css({'opacity': 1});
		that.domNode.find('.info').hide();
	
		var $clicked = $(options.clicked);
		// i think $page should actually be $img 
		var showPage = function($page, $clicked) {
			
			var $clickedImg = $clicked.find('img');
			
			// we need to make sure we dont run if already running. 
			console.log($page);
			$('#container').animate({
				'height': that.domNode.height()
			}, DURATION, EASING);
			var h = $page.height();
			var w = $page.width();
			var t = $page.position().top + $('#container').offset().top;
			var l = $page.offset().left + 9999 + $('#container').position().left;
			that.domNode.find('h3').hide().fadeIn('slow');
			$page.css({
				height:'75',
				width: 75,
				zIndex: 100,
				left: $clickedImg.offset().left  - 10, 
				top: $clickedImg.offset().top - 10,
				position: 'absolute'
			});

			$('#container .active').removeClass('active').addClass('inactive');
			that.domNode.addClass('active').removeClass('inactive');

			$page.animate({
				width: w,
				height: h,
				top: t,
				left: l
			}, DURATION, EASING,  function() {		
				$(this).css('position', 'static');
				that.domNode.find('.info').fadeIn('fast', callback);
			});
		};

		that.domNode.find('#photo img').one('load', function() {
				showPage($(this), $clicked);
		})
		.each(function(){
			if(this.complete) {
				$(this).trigger("load");
			}
		});
	};
	
	
	
	$.subscribe('VIEW_SWITCH', function(e, options) {
		console.log(arguments);
		that.show(options);
	});
};


structure.views.photo.prototype =  structure.views.Base;
//views.contactMe.prototype.constructor = views.Base;
