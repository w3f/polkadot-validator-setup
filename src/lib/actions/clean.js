const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Platform } = require('../platform.js');


module.exports = {
  do: async (cmd) => {
    const cfg = config.read(cmd.config);

    console.log(chalk.yellow('Cleaning platform...'));
    const platform = new Platform(cfg);
    try {
      await platform.clean();
    } catch (e) {
      console.log(chalk.red(`Could not clean platform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('Done'));
  }
}
