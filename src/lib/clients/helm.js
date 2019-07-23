class Helm {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));
  }

  async sync() {

  }
}

module.exports = {
  Helm
}
