
structure.views.photo = function() {
	var that = this;
	that.domNode = $('#container div[data-view="photo"]'); // set domNode
	that.show = function(startPos) {
		
		var $html = $(structure.views.photo.html)
		$html.removeClass('inactive').addClass('active');
		var $hiddenDiv = $html.appendTo($('#hiddenDiv #hiddenRel'));
		console.log('',$hiddenDiv);
		$hiddenDiv.find('img').bind('load', function() {
			var h = $(this).height();
			var w = $(this).width();
			var t = $(this).position().top;
			var l = $(this).position().left;
			$(this).css({
				height:'75',
				width: 75,
				left: startPos.left, 
				top: startPos.top,
				position: 'absolute'
			});
			
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
};


structure.views.photo.prototype =  structure.views.Base;
structure.views.photo = new structure.views.photo();
//views.contactMe.prototype.constructor = views.Base;
