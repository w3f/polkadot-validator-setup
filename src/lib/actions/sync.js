const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Terraform } = require('../terraform.js');
const { Ansible } = require('../ansible.js');


module.exports = {
  do: async () => {
    const cfg = config.read();

    console.log(chalk.yellow('Syncing terraform...'));
    const tf = new Terraform(cfg.terraform);
    try {
      await tf.sync();
    } catch (e) {
      console.log(chalk.red(`Could not sync terraform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));

    console.log(chalk.yellow('Syncing ansible...'));
    const ansible = new Ansible(cfg.ansible);
    try {
      await ansible.sync();
    } catch (e) {
      console.log(chalk.red(`Could not sync ansible: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
