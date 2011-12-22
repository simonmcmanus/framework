
structure.views.photo = function(domNode) {
	var that = this;
	that.domNode = domNode;
	// we should 
 	that.init(domNode); // set domNode
	
	that.hide = function(options, callback) {
		console.log('photo hide');
		$('#container div[data-view="photo"] img').animate({
			width: 75,
			height: 75,
		}, 100, function() {
//			$('#container div[data-view="photo"]').removeClass('active').addClass('inactive');// todo - use domnode - loading order issue
			
		});
		if(callback){
			callback();
		}
	};
	that.show = function(options) {
		var $clicked = $(options.clicked);
		var $html = that.domNode;
		that.domNode.find('h3').hide().fadeIn('slow');
		var $hiddenDiv = $html.appendTo($('#hiddenDiv #hiddenRel'));
		$hiddenDiv.find('img').bind('load', function() {
			var h = $(this).height();
			var w = $(this).width();
			var t = $(this).position().top;
			var l = $(this).position().left;
			$(this).css({
				height:'75',
				width: 75,
				left: $clicked.css('left'), 
				top: $clicked.css('top'),
				position: 'absolute'
			});
			that.domNode.removeClass('inactive');
			
			$('#container .active').removeClass('active').addClass('inactive');

			$html.wrap('<div id="'+ window.location.pathname +'"></div>');
			$('#container').append($html);
			$(this).animate({
				width: w,
				height: h,
				top: $('#container').position().top+60,
				left: $('#container').position().left
			}, 400, function() {
				$(this).css('position', 'static');
			});
		});
	};
	
	
	
	$.subscribe('VIEW_SWITCH', function(e, options) {
		console.log(arguments);
		that.show(options);
	});
};


structure.views.photo.prototype =  structure.views.Base;
//views.contactMe.prototype.constructor = views.Base;
