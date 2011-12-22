var structure = require('./structure.js');
structure.serve({
	port: 83,
	static: '/static',
	sharedModules: ['shared'],
	pageSpecs: {
		'/contact':  {
			view: 'contactMe',
			modules: [
				'mainNav',
				'content'
			]
		},
		'/home':  {
			view: 'home',
			modules: [
				'mainNav',
				'content'
			]	
		},
		'/photo/:photo':  {
			view: 'photo',
			modules: [
				'mainNav',
				'content',
				'photo',
				'flickr'
			]
		},
		'/photos': {
			view: 'harryDog',
			modules: [
				'mainNav',
				'content',
				'flickr2',
				'flickr'
			]
		}
	}
});


/*


Example resources!?:

/contact.html
/contact.xml
/contact.rss
/contact.css
/contact.js

*/