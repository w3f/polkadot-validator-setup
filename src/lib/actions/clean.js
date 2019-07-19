const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Terraform } = require('../terraform.js');
const { Ansible } = require('../ansible.js');


module.exports = {
  do: async () => {
    const cfg = config.read();

    console.log(chalk.yellow('Cleaning terraform...'));
    const tf = new Terraform(cfg.terraform);
    try {
      await tf.clean();
    } catch (e) {
      console.log(chalk.red(`Could not clean terraform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));

    console.log(chalk.yellow('Cleaning ansible...'));
    const ansible = new Ansible(cfg.ansible);
    try {
      await ansible.clean();
    } catch (e) {
      console.log(chalk.red(`Could not clean ansible: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
