var structure = require('./structure.js');
structure.serve({
	port: 82,
	static: '/static',
	sharedModules: ['shared'],
	views: {
		contact:  {
			url: '/contactMe',
			view: 'contactMe',
			modules: [
				'mainNav',
				'content'
			]
		},
		home:  {
			url: '/home',
			view: 'home',
			modules: [
				'mainNav',
				'content'
			]	
		},
		
		photo:  {
			url: '/photo/:photo',
			view: 'photo',
			modules: [
				'mainNav',
				'content'
			]
		},
		
		/* the url at least has to be the same as the obj key - this is a bug*/
		
		harry:  {
			url: '/harryDog',
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