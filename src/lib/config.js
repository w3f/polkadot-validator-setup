const path = require('path');

const files = require('./files');


module.exports = {
  read: () => {
    const cfgPath = path.join(__dirname, '..', '..', 'config', 'main.json');
    return files.readJSON(cfgPath);
  }
}
