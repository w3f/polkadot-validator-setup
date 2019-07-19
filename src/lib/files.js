const fs = require('fs-extra');

module.exports = {
  readJSON: (filePath) => {
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent);
  }
}
