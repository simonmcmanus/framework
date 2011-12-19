
structure.views.photo = function() {
	var that = this;
	that.domNode = $('#container div[data-view="photo"]'); // set domNode
	
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
	that.show = function(startPos) {
		console.log('photo show');
		
		
		var $html = $(structure.views.photo.html)
		$html.removeClass('inactive').addClass('active');
		var $hiddenDiv = $html.appendTo($('#hiddenDiv #hiddenRel'));
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
};


structure.views.photo.prototype =  structure.views.Base;
structure.views.photo = new structure.views.photo();
//views.contactMe.prototype.constructor = views.Base;
