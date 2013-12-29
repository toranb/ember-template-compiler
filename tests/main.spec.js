var sut = require('../lib/main');
var fs = require('fs');
var path = require('path');

describe("ember-template-compiler tests", function() {
  var result,
      template = fs.readFileSync(path.join(path.dirname(fs.realpathSync(__filename)),'file-system', 'app', 'templates', 'foo.handlebars')).toString();

  it("compiles down a handlebars template", function() {
    result = sut.precompile(template).toString();
    expect(result).toContain("outlet");
  });

  it("compiles down a handlebars template to a function when asObject isn't defined", function() {
    result = sut.precompile(template);
    expect(typeof(result)).toBe("function");
  });

  it("compiles down a handlebars template to a function when passed asObject=true", function() {
    result = sut.precompile(template, true);
    expect(typeof(result)).toBe("function");
  });

  it("compiles down a handlebars template to a string when asObject=false", function() {
    result = sut.precompile(template, false);
    expect(typeof(result)).toBe("string");
  });

});
