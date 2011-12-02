views.contactMe = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
		alert('CONTACT ME LOADED');
	};
	init();
};


views.contactMe.prototype =  views.Base;
views.contactMe = new views.contactMe();
//views.contactMe.prototype.constructor = views.Base;
