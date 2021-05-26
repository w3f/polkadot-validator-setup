#!/usr/bin/env node
import path from 'path';
import program from 'commander';
import { config } from 'dotenv';
import clean from './lib/actions/clean';
import sync from './lib/actions/sync';
import plan from './lib/actions/plan';
import updateBinary from './lib/actions/updateBinary';
import restoreDB from './lib/actions/restoreDB';
import rotateKeys from './lib/actions/rotateKeys';
import getVersion from './lib/getVersion';

config();
config({ path: path.resolve(process.cwd(), '.env') });
config({ path: path.resolve(process.cwd(), 'config/.env') });

program.version(getVersion());

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

program
  .command('restore-db')
  .description('Restore the nodes DB.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(restoreDB.do);

program
  .command('rotate-keys')
  .description('Rotate the nodes keys.')
  .option('-c, --config [path]', 'Path to config file.', './config/main.json')
  .action(rotateKeys.do);

program.allowUnknownOption(false);

const parsed = program.parse(process.argv);
if (!parsed || !(parsed.args && parsed.args.length > 0 && typeof (parsed.args[0] === 'object'))) {
  program.outputHelp();
}
