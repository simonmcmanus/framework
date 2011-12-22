
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
//		$clicked.append($loading);
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
		var $clicked = $(options.clicked);
		that.domNode.find('h3').hide().fadeIn('slow');
		that.domNode.find('#photo img').bind('load', function() {
			var h = $(this).height();
			var w = $(this).width();
			var t = $(this).position().top;	 
			var l = $(this).position().left;
			console.log(h,w, t, l);
			$(this).css({
				height:'75',
				width: 75,
				left: $clicked.offset().left, 
				top: $clicked.offset().top,
				position: 'absolute',
				border: '1px solid red'
			});
			$('#container .active').removeClass('active').addClass('inactive');			
			that.domNode.addClass('active').removeClass('inactive');
			
			
			$(this).attr('start-height', h);
			$(this).attr('start-width', w);
			
			
			$(this).animate({
				width: w,
				height: h,
				top: $('#container').position().top+60,
				left: $('#container').position().left
			}, 1000, function() {		
				$(this).css('position', 'static');
				
		//		$('#container .active').removeClass('active').addClass('inactive');
		//		that.domNode.addClass('active').removeClass('inactive');
				
			});
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
