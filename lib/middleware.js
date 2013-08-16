/*

Copyright (C) 2013 by James Hall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var fs 		= require('fs'),
	url 	= require('url'),
	mkdirp 	= require('mkdirp'),
	dirname = require('path').dirname,
	emberTemplateCompiler 	= require('ember-template-compiler');

module.exports = function(options){

	// Config properties
	var from 		= options.src,					// Hbs file folder. 		- Do not include __dirname if origin not defined
		to 			= options.dest,					// Output destination. 		- Do not include __dirname if origin not defined
		origin 		= options.origin || false,		// Origin directory
		force		= options.force,				// Force compile 			- Bool
		format 		= options.format || null,		// Output format			- Either as AMD or as Ember.TEMPLATES property
		namePrefix	= options.namePrefix || '',		// Prefix for template name 
		pathInName 	= options.pathInName || true;	// Include path in name 	- Bool


	return function(req, res, next) {
		if ('GET' != req.method && 'HEAD' != req.method) return next();

		// Private Properties ------------------------- //
		var path 			= url.parse(req.url).pathname,
			subPath 		= (origin) ? path.replace(to, '').replace('.js', '') : path.replace('.js', ''),
			name 			= (pathInName) ? namePrefix + subPath : namePrefix + path.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.js')),
			handlebarsPath 	= (origin) ? origin + from + subPath + '.hbs' : from + subPath + '.hbs',
			jsPath 			= (origin) ? origin + to + subPath + '.js' : to + subPath + '.js';
		
		// Private Methods ---------------------------- //
		function error(err) {
		  	next('ENOENT' == err.code ? null : err);
		}

		function compile(){
			console.log('Compiling Ember Template: ' + name);
			var pre,
				post,
				template;

			// Define output wrapper
			if(format === 'AMD'){
				pre 	= 'define("' + name + '", ["ember"] ,function(){ return Ember.Handlebars.template(';
				post 	= ');});';
			} else {
				pre 	= 'Ember.TEMPLATES["' + name + '"] = Ember.Handlebars.template(';
				post 	= ');';
			}

			// Compile
			template = emberTemplateCompiler.precompile(
				fs.readFileSync(handlebarsPath).toString()
			).toString();

			var output = pre + template + post;

			mkdirp(dirname(jsPath), 0700,  function(err){
				if (err) return error(err);
				fs.writeFile(jsPath, output, 'utf8', next);
			});
		}

		// Always compile if force is true
		if(force){
			compile();

		}else if((path.indexOf(to) > -1 && /\.js$/.test(path)) || !origin){

			fs.stat(handlebarsPath, function(err, handlebarsStats) {
				if(err) return error(err);
				
				fs.stat(jsPath, function(err, jsStats) {
					if (err) {
						// If JS doesnt exist, create it.
				        if ('ENOENT' == err.code) {
				        	compile();
				        } else {
				        	next(err);
				        }
				    } else {
				    	// Otherwise, if hbs has changed, update it.
						if((handlebarsStats.mtime > jsStats.mtime)){
							compile();				        
						} else {
							next();
						}
				    }
				});
				
			});
		} else {
			next();
		}
	};
};
