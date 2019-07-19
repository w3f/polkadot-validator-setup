
class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));
  }

  async sync() {

  }

  async clean() {

  }
}


module.exports = {
  Terraform
}
