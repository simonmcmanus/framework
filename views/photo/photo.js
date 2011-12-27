
structure.views.photo = function(domNode) {
	var that = this;
	that.domNode = domNode;
	// we should 
 	that.init(domNode); // set domNode
	
	that.hide = function(options, callback) {
		var h = $('#container').css('height');
		
		$('#container').css('height', h);
		$clicked = $(options.clicked);
		var $loading = $('<span class="loading">loading</span>');
		$loading.css({
			border: '2px solid red',
			left: $clicked.position().left
		})
		$clicked.append($loading);
		that.domNode.find('#photo img').fadeOut('fast', callback);
	};
	
	
	
	var showOtherPics = function() {
		$('#flickr').css({
			top: '5em',
			position:'relative'
		}).animate({
			top: 0
		});
	};
	
	
	that.show = function(options, callback) {
//		that.domNode.find('img').fadeIn();
		console.log('DN', that.domNode);
		var $clicked = $(options.clicked);
		var showPage = function($page, $clicked) {
			var h = $page.height();
			var w = $page.width();
			var t = $page.position().top + $('#container').offset().top;
			var l = $page.offset().left + 9999 + $('#container').position().left;
			//debugger;
			that.domNode.find('h3').hide().fadeIn('slow');
			var $clickedImg = $clicked.find('img');
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
			}, 1000, function() {		
				$(this).css('position', 'static');
			//	$('#container .active').removeClass('active').addClass('inactive');
			//	that.domNode.addClass('active').removeClass('inactive');
			});
		};
		
		
		if($clicked.hasClass('loaded')){
			
			// need the page dom node - find the img - then pass the image in.
			
			
			showPage(that,domNode, $clicked);
		}
//		if its been loaded already
		// load event is not fired if the image has already been loaded. 
		that.domNode.find('#photo img').bind('load', function() {
			showPage($(this), $clicked);
		});
		if(callback) {
			callback();
		}
	};
	
	
	
	$.subscribe('VIEW_SWITCH', function(e, options) {
		console.log(arguments);
		that.show(options);
	});
};


structure.views.photo.prototype =  structure.views.Base;
//views.contactMe.prototype.constructor = views.Base;
