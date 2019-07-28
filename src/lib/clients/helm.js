class Helm {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));
  }

  async sync() {

  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`helm ${command}`, actualOptions);
  }
}

module.exports = {
  Helm
}
