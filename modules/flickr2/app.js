/*
var http = require('http');
var options = {
  host: 'simonmcmanus.com',
  port: 80,
  path: '/'
};

*/


exports.config = {
	photoSet:'72157625485688016',
	apiKey: '980e558a7f82c6b2ca3b619004b1a274',
	perPage: '5',
	page: '5'
};

exports.getSelectors = function( params, callback ) {
	var http = require('http');
	var options = {
		host: 'api.flickr.com',
		headers: { 'content-type': 'application/json' },
		port: 80, 
		path: '/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=' + exports.config.photoSet + '&api_key=' + exports.config.apiKey + '&per_page=' + exports.config.perPage + '&page=' + exports.config.page + '&nojsoncallback=1'
	};

	var msg  = '';	

	http.get(options, function(res) {
		 res.setEncoding('utf8');
	}).on('error', function(e) {
	}).on('response', function (response) {
		
		response.on('data', function (chunk) {
			msg += chunk;
		}).on('end', function(data) {
			var json = JSON.parse(msg);
			var photos  = json.photoset.photo;
			var c = photos.length;
			var selectors = {
				a: []
			};
			while(c--){
				var url = 'http://farm' + photos[c].farm + '.staticflickr.com/' + photos[c].server + '/'  + photos[c].id + '_'  + photos[c].secret + '_s.jpg';
				selectors.a.push({ 
					href: '/photo/' + photos[c].id,
					'selectors': {
						img: {
							'src': url,
							'title': photos[c].title
						}
					}
				 });
			}		

			callback( null,  selectors);
		});
	});
};



