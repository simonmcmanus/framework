views.contactMe = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
	};
	
	
	
	that.show = function() {
		that.domNode.css({
			marginLeft:'-30em'
		}).show().animate({
			marginLeft:'0em'
		}, 200);
	};
	that.hide = function(callback) {
		that.domNode.css({
			marginLeft:'0em'
		}).animate({
			marginLeft:'-30em'
		}, 200, function() {
			$(this).hide().css({
				marginLeft: '0em'
			});
			callback();
		});
	};
	
	init();
};


views.contactMe.prototype =  views.Base;
views.contactMe = new views.contactMe();
//views.contactMe.prototype.constructor = views.Base;
