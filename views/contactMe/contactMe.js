views.contactMe = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
	};
	
	
	that.show = function() {
		that.domNode.css({
			position:'absolute',
			left:'-30em'
		}).show().animate({
			left:'3em'
		}, 200);
	};
	that.hide = function(callback) {
		that.domNode.css({
			position:'absolute',
			left:'3em'
		}).animate({
			left:'-3em'
		}, 200, callback);
	};
	
	init();
};


views.contactMe.prototype =  views.Base;
views.contactMe = new views.contactMe();
//views.contactMe.prototype.constructor = views.Base;
