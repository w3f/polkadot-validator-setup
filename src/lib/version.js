const path = require('path');

const files = require('./files');

module.exports = {
  show: () => {
    const targetPath = path.join(path.dirname(module.filename), '..', '..', 'package.json');
    const pkg = files.readJSON(targetPath);

    return pkg.version;
  }
}
