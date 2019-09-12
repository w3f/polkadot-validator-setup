const path = require('path');

const files = require('./files');


module.exports = {
  read: (rawCfgPath) => {
    const cfgPath = path.resolve(__dirname, rawCfgPath);
    return files.readJSON(cfgPath);
  }
}
