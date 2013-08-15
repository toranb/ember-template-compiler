
An npm module for the ember-template-compiler.js file that ships with ember.js

##What can I do with this?

If you have a client build process and need to compile handlebars templates for ember.js

    npm install ember-template-compiler

    var compiler = require('ember-template-compiler');
    var template = fs.readFileSync('foo.handlebars').toString();
    var input = compiler.precompile(template).toString();
    var output = "Ember.TEMPLATES['foo'] = Ember.Handlebars.template(" + input + ");";

##Middleware

To activate middleware require ember-template-compiler and then configure.

	var compiler = require('ember-template-compiler');

A simple setup will look something like: 

	app.use(compiler.middleware({
		src: 	 	__dirname + '/handlebars',
		dest: 	 	__dirname,
		format:		'AMD'
	}));


- `src`: Hbs file folder. Do not include `__dirname` if origin not defined, **REQUIRED**
- `dest`: Output destination. Do not include `__dirname` if origin not defined, **REQUIRED**
- `origin`: Origin directory, **DEFAULT: false**
- `force`: Force compile, **DEFAULT: false**
- `format`: Output format. Either `'AMD'` or `null`.  `null` outputs an Ember.TEMPLATES property
- `namePrefix`: Prefix for template name 
- `pathInName`: Include path in name, **DEFAULT: true**

If the `origin` is defined. `src` and `dest` will be relative to it.  

	app.use(compiler.middleware({
		src: 	 	'/js/app/handlebars',
		dest: 	 	'/js/app/templates',
		origin:  	'/var/www/frontend/public',
		namePrefix: 'app/templates',
		format:  	'AMD',
		force: 		true
	}));

##Development

To run the tests

    cd tests
    ./runner.sh

## License

Copyright © 2013 Toran Billups

Licensed under the MIT License
