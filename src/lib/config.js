const path = require('path');

const files = require('./files');


module.exports = {
  read: (rawCfgPath) => {
    const base = path.resolve(__dirname, '..', '..');

    const cfgPath = path.resolve(base, rawCfgPath);
    return files.readJSON(cfgPath);
  }
}
