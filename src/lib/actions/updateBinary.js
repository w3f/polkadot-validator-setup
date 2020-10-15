const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Platform } = require('../platform.js');
const { Application } = require('../application.js');


module.exports = {

  do: async (cmd) => {
    const cfg = config.read(cmd.config);

    console.log(chalk.yellow('Syncing platform...'));
    const platform = new Platform(cfg);
    let platformResult;
    try {
      platformResult = await platform.sync();
    } catch (e) {
      console.log(chalk.red(`Could not sync platform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));

    console.log(chalk.yellow('Updating application binary...'));
    const app = new Application(cfg, platformResult);
    try {
      await app.updateBinary();
    } catch (e) {
      console.log(chalk.red(`Could not update application binary: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
