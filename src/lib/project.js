const ospath = require('ospath');
const path = require('path');


class Project {
  constructor(cfg) {
    this.name = cfg.project;
  }

  path() {
    return path.join(ospath.home(), '.polkadot-secure-validator', 'build', this.name);
  }
}

module.exports = {
  Project
}
