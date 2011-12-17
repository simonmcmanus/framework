/*
var http = require('http');
var options = {
  host: 'simonmcmanus.com',
  port: 80,
  path: '/'
};

*/


exports.getSelectors = function( params, callback ) {
	var http = require('http');
	var options = {
		host: 'api.flickr.com',
		headers: { 'content-type': 'application/json' },
		port: 80,
		encoding:'utf8', /* not sure this is doing anything */
		path: '/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=72157625601749859&api_key=980e558a7f82c6b2ca3b619004b1a274&per_page=5&nojsoncallback=1'
	};
	var msg  = '';
	http.get(options, function(res) {
		 res.setEncoding('utf8');
	}).on('error', function(e) {
		//console.log(e);
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



