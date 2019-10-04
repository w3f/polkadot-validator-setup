const path = require('path');
const process = require('process');

const files = require('./files');


module.exports = {
  read: (rawCfgPath) => {
    const cfgPath = path.resolve(process.cwd(), rawCfgPath);
    return files.readJSON(cfgPath);
  }
}
