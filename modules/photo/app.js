exports.getSelectors = function(params,  callback ) {
	var http = require('http');
	var options = {
		host: 'api.flickr.com',
		headers: { 'content-type': 'application/json' },
		port: 80, 
		path: '/services/rest/?format=json&method=flickr.photos.getInfo&photo_id=' + params.photo + '&api_key=980e558a7f82c6b2ca3b619004b1a274&nojsoncallback=1'
	};
	var msg  = '';	
	http.get(options, function(res) {
		 res.setEncoding('utf8');
	}).on('error', function(e) {

	}).on('response', function (response) {

		response.on('data', function (chunk) {
			msg += chunk;
		}).on('end', function(data) {
			var photo = JSON.parse(msg).photo;
			var url = 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/'  + photo.id + '_'  + photo.secret + '.jpg';
			
			var selectors = {
				h3: photo.title._content,
				'.views': photo.views,
				img: {
					src: url
				}
			};
			callback( null, selectors);
		});
	});
};
