
structure.views.photo	 = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
	};
	init();
	that.show = function(startPos) {
		
		var $html = $(structure.views.photo.html)
		
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
		});;
	
//		var wrapper = $('<span></span>').css('border', '2px solid blue');
//		$img.css();
//		$img.fadeOut();
/*
	$img.animate({
		width: '200px',
		height: '300px',
		top: 40, 
		left: 20
	}, 400);
	
	*/
		
	
		
	};
};


structure.views.photo.prototype =  structure.views.Base;
// TODO - should be an event. 
$(document).ready(function() {
	structure.views.photo = new structure.views.photo();
});
//views.contactMe.prototype.constructor = views.Base;
