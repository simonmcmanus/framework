var structure = require('./structure.js');

structure.serve({
	port: 80,
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
		
		/* the url at least has to be the same as the obj key - this is a bug*/
		
		harry:  {
			url: '/harryDog',
			view: 'harryDog',
			modules: [
				'mainNav',
				'content',
				'flickr'
			]
		}
	}
});