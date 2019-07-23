const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Platform } = require('../terraform.js');
const { Application } = require('../appplication.js');


module.exports = {
  do: async () => {
    const cfg = config.read();

    console.log(chalk.yellow('Syncing platform...'));
    const platform = new Platform(cfg.platform);
    try {
      await platform.sync();
    } catch (e) {
      console.log(chalk.red(`Could not sync platform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));

    console.log(chalk.yellow('Syncing application...'));
    const app = new Application(cfg.application);
    try {
      await app.sync();
    } catch (e) {
      console.log(chalk.red(`Could not sync application: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
