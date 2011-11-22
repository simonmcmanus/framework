views.home = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
		alert('VIEW ALERT');
	};
	init();
};


views.home.prototype =  views.Base;
views.home = new views.home();
//views.contactMe.prototype.constructor = views.Base;
