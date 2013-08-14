
An npm module for the ember-template-compiler.js file that ships with ember.js

##What can I do with this?

If you have a client build process and need to compile handlebars templates for ember.js

    npm install ember-template-compiler

    var compiler = require('ember-template-compiler');
    var template = fs.readFileSync('foo.handlebars').toString();
    var input = compiler.precompile(template).toString();
    var output = "Ember.TEMPLATES['foo'] = Ember.Handlebars.template(" + input + ");";

##Development

To run the tests

    cd tests
    ./runner.sh

## License

Copyright © 2013 Toran Billups

Licensed under the MIT License
