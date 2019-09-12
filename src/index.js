#!/usr/bin/env node

const process = require('process');
const program = require('commander');

const clean = require('./lib/actions/clean');
const sync = require('./lib/actions/sync');
const version = require('./lib/version');


program
  .version(version.show());

program
  .command('sync')
  .description('Synchronizes the infrastructure.')
  .option('-c, --config [path]', 'Path to config file.', '../../config/main.json');
  .action(sync.do);

program
  .command('clean')
  .description('Removes all the resources.')
  .option('-c, --config [path]', 'Path to config file.', '../../config/main.json');
  .action(clean.do);


program.allowUnknownOption(false);

const parsed = program.parse(process.argv);
if (! parsed || !(parsed.args && parsed.args.length > 0 && (typeof (parsed.args[0] === 'object')))) {
  program.outputHelp();
}
