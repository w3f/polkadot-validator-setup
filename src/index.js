#!/usr/bin/env node

const path = require('path');
const process = require('process');
const program = require('commander');
require('dotenv').config({path: path.resolve(process.cwd(), '.env')});
require('dotenv').config({path: path.resolve(process.cwd(), 'config/.env')});

const clean = require('./lib/actions/clean');
const sync = require('./lib/actions/sync');
const plan = require('./lib/actions/plan');
const version = require('./lib/version');
const updateBinary = require('./lib/actions/updateBinary');


program
  .version(version.show());

program
  .command('sync')
  .description('Synchronizes the infrastructure.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(sync.do);

program
  .command('clean')
  .description('Removes all the resources.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(clean.do);

program
  .command('plan')
  .description('Shows changes in the infrastructure layer that would be performed by sync.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(plan.do);

program
  .command('update-binary')
  .description('Update the nodes binary.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(updateBinary.do);

program.allowUnknownOption(false);

const parsed = program.parse(process.argv);
if (! parsed || !(parsed.args && parsed.args.length > 0 && (typeof (parsed.args[0] === 'object')))) {
  program.outputHelp();
}
