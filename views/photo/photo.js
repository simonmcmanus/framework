
structure.views.photo = function() {
	var that = this;
 	that.init($('#container div[data-view="photo"]')); // set domNode
	
	that.hide = function(options, callback) {
		console.log('photo hide');
		$('#container div[data-view="photo"] img').animate({
			width: 75,
			height: 75,
		}, 100, function() {
			$('#container div[data-view="photo"]').removeClass('active').addClass('inactive');// todo - use domnode - loading order issue
			
		});
		if(callback){
			callback();
		}
	};
	that.show = function(options) {
		console.log('photo show', options);
		var $clicked = $(options.clicked);
		var $html = $(structure.views.photo.html)
		$html.removeClass('inactive').addClass('active');
		console.log('dn', that.domNode);
		return;
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
			$('#container .active').addClass('inactive').removeClass('active');	//

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
structure.views.photo = new structure.views.photo();
//views.contactMe.prototype.constructor = views.Base;
