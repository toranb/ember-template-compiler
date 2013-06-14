
An npm module for the ember-template-compiler.js file that ships with ember.js

##What can I do with this?

If you have a client build process and need to compile handlebars templates for ember.js

    npm install ember-template-compiler

    var compiler = require('ember-template-compiler');
    var input = compiler.precompile(template['content']).toString();
    var output = "Ember.TEMPLATES['" + template['name'] + "'] = Ember.Handlebars.template(" + input + ");";

##What are a few projects using this today?

Django based web apps can use this with django-compressor
Pending a pull request to get a precompiler into the karma test runner

##Development

To run the tests

    cd tests
    ./runner.sh
