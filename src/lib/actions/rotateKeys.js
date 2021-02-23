const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Platform } = require('../platform.js');
const { Application } = require('../application.js');


module.exports = {
  do: async (cmd) => {
    const cfg = config.read(cmd.config);

    console.log(chalk.yellow('Rotating Keys...'));
    const platform = new Platform(cfg);
    let platformResult;
    try {
      platformResult = await platform.output();
    } catch (e) {
      console.log(chalk.red(`Could not get output from platform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));

    console.log(chalk.yellow('Rotating application Keys...'));
    const app = new Application(cfg, platformResult);
    try {
      await app.rotateKeys();
    } catch (e) {
      console.log(chalk.red(`Could not rotate application Keys: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
