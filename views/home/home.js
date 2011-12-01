if(!views){
	var views = {};
}

views.home = function() {
	var that = this;
	var init = function() {
		that.domNode = $('#container');
	};
	init();
};


views.home.prototype =  views.Base;
// TODO - should be an event. 
$(document).ready(function() {
	views.home = new views.home();
});
//views.contactMe.prototype.constructor = views.Base;
