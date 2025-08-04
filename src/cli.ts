// CordKit CLI entrypoint
// Written in TypeScript, executable via Bun

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';
import { updateCommand } from './commands/update';
import { deployCommand } from './commands/deploy';
import { pluginsCommand } from './commands/plugins';
import { configCommand } from './commands/config';
import { migrateCommand } from './commands/migrate';
import { dashboardCommand } from './commands/dashboard';
import { generateCommand } from './commands/generate';

const program = new Command();

program
  .name('cordkit')
  .description('CordKit CLI - Generate Discord.js bot starter templates for Bun')
  .version('1.5.0');

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(updateCommand);
program.addCommand(deployCommand);
program.addCommand(pluginsCommand);
program.addCommand(configCommand);
program.addCommand(migrateCommand);
program.addCommand(dashboardCommand);
program.addCommand(generateCommand);

program.parse(process.argv);
