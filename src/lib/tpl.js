const fs = require('fs-extra');
const Handlebars = require('handlebars');
const path = require('path');


Handlebars.registerHelper('raw', function(options) {
  return options.fn();
});

module.exports = {
  create: (source, target, data) => {
    const sourceTpl = fs.readFileSync(source).toString();
    const template = Handlebars.compile(sourceTpl);
    const contents = template(data);

    const targetDir = path.dirname(target);
    fs.mkdirSync(targetDir, {recursive: true});

    fs.writeFileSync(target, contents);
  }
}
