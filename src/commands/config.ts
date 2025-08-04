// CordKit 'config' command implementation
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

interface BotConfig {
  prefix: string;
  owners: string[];
  features: {
    autoMod: boolean;
    economy: boolean;
    levels: boolean;
    tickets: boolean;
    reactionRoles: boolean;
  };
  channels: {
    logs: string | null;
    welcome: string | null;
    rules: string | null;
  };
  roles: {
    muted: string | null;
    moderator: string | null;
    admin: string | null;
  };
  permissions: {
    requireRoles: boolean;
    allowedChannels: string[];
  };
}

const defaultConfig: BotConfig = {
  prefix: '!',
  owners: [],
  features: {
    autoMod: false,
    economy: false,
    levels: false,
    tickets: false,
    reactionRoles: false
  },
  channels: {
    logs: null,
    welcome: null,
    rules: null
  },
  roles: {
    muted: null,
    moderator: null,
    admin: null
  },
  permissions: {
    requireRoles: false,
    allowedChannels: []
  }
};

export const configCommand = new Command('config')
  .description('Manage bot configuration')
  .option('-p, --path <path>', 'Path to the project directory', '.')
  .option('--init', 'Initialize configuration file')
  .option('--get <key>', 'Get configuration value')
  .option('--set <key> <value>', 'Set configuration value')
  .option('--list', 'List all configuration')
  .action((opts: any) => {
    const projectPath = opts.path;
    const configPath = join(projectPath, 'config.json');

    if (opts.init) {
      initConfig(configPath);
      return;
    }

    if (!existsSync(configPath)) {
      console.error(chalk.red('❌ No config.json found. Use --init to create one.'));
      process.exit(1);
    }

    if (opts.get) {
      getConfig(configPath, opts.get);
      return;
    }

    if (opts.set) {
      const [key, value] = opts.args || [];
      if (!key || !value) {
        console.error(chalk.red('❌ Usage: --set <key> <value>'));
        process.exit(1);
      }
      setConfig(configPath, key, value);
      return;
    }

    if (opts.list) {
      listConfig(configPath);
      return;
    }

    // Default: show help
    console.log(chalk.blue.bold('⚙️ CordKit Configuration Manager\n'));
    console.log(chalk.cyan.bold('Commands:'));
    console.log(chalk.white('  --init              ') + chalk.gray('Initialize configuration file'));
    console.log(chalk.white('  --get <key>         ') + chalk.gray('Get configuration value'));
    console.log(chalk.white('  --set <key> <value> ') + chalk.gray('Set configuration value'));
    console.log(chalk.white('  --list              ') + chalk.gray('List all configuration'));
    console.log(chalk.green('\nExample: ') + chalk.yellow('cordkit config --set prefix "?"'));
  });

function initConfig(configPath: string) {
  if (existsSync(configPath)) {
    console.error(chalk.red('❌ Configuration file already exists.'));
    process.exit(1);
  }

  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(chalk.green('✅ Configuration file created at config.json'));
  console.log(chalk.yellow('💡 Use "cordkit config --list" to see all options'));
}

function getConfig(configPath: string, key: string) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const value = getNestedValue(config, key);
    
    if (value === undefined) {
      console.error(chalk.red(`❌ Configuration key '${key}' not found.`));
      process.exit(1);
    }
    
    console.log(chalk.cyan(`${key}:`), chalk.white(JSON.stringify(value, null, 2)));
  } catch (error) {
    console.error(chalk.red('❌ Error reading configuration:'), error);
    process.exit(1);
  }
}

function setConfig(configPath: string, key: string, value: string) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    // Parse value based on type
    let parsedValue: any = value;
    if (value.toLowerCase() === 'true') parsedValue = true;
    else if (value.toLowerCase() === 'false') parsedValue = false;
    else if (value.toLowerCase() === 'null') parsedValue = null;
    else if (!isNaN(Number(value))) parsedValue = Number(value);
    else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        parsedValue = JSON.parse(value);
      } catch {
        // Keep as string if JSON parsing fails
      }
    }
    
    setNestedValue(config, key, parsedValue);
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`✅ Set ${key} = ${JSON.stringify(parsedValue)}`);
  } catch (error) {
    console.error('❌ Error updating configuration:', error);
    process.exit(1);
  }
}

function listConfig(configPath: string) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    console.log('⚙️ Bot Configuration\n');
    console.log('📝 Basic Settings:');
    console.log(`  prefix: "${config.prefix}"`);
    console.log(`  owners: ${JSON.stringify(config.owners)}`);
    
    console.log('\n🎛️ Features:');
    Object.entries(config.features).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
    
    console.log('\n📢 Channels:');
    Object.entries(config.channels).forEach(([key, value]) => {
      console.log(`  ${key}: ${value || 'Not set'}`);
    });
    
    console.log('\n👥 Roles:');
    Object.entries(config.roles).forEach(([key, value]) => {
      console.log(`  ${key}: ${value || 'Not set'}`);
    });
    
    console.log('\n🔒 Permissions:');
    console.log(`  requireRoles: ${config.permissions.requireRoles ? '✅' : '❌'}`);
    console.log(`  allowedChannels: ${config.permissions.allowedChannels.length} channels`);
    
  } catch (error) {
    console.error('❌ Error reading configuration:', error);
    process.exit(1);
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}
