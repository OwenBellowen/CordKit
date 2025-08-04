// CordKit 'generate' command implementation
import { Command } from 'commander';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import prompts from 'prompts';
import chalk from 'chalk';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Generate new commands, events, or other bot components')
  .option('-t, --type <type>', 'Component type: command, slash-command, event')
  .option('-n, --name <name>', 'Component name')
  .option('-p, --path <path>', 'Project path', '.')
  .option('-l, --language <lang>', 'Language: typescript or javascript')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n🛠️  CordKit Component Generator\n'));
      
      const projectPath = join(process.cwd(), options.path);
      
      // Check if project exists
      if (!existsSync(join(projectPath, 'package.json'))) {
        console.log(chalk.red('❌ No package.json found. Make sure you\'re in a CordKit project directory.'));
        return;
      }

      // Determine project language
      const language = options.language || detectProjectLanguage(projectPath);
      
      const answers = await promptGenerateOptions(options);
      
      await generateComponent(answers, projectPath, language);
      
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
    }
  });

interface GenerateOptions {
  type: 'command' | 'slash-command' | 'event';
  name: string;
  description?: string;
  category?: string;
  permissions?: string[];
}

async function promptGenerateOptions(cliOpts: any): Promise<GenerateOptions> {
  const questions: prompts.PromptObject[] = [];

  if (!cliOpts.type) {
    questions.push({
      type: 'select',
      name: 'type',
      message: 'What would you like to generate?',
      choices: [
        { title: '📝 Message Command', value: 'command' },
        { title: '⚡ Slash Command', value: 'slash-command' },
        { title: '🎯 Event Handler', value: 'event' },
      ],
      initial: 0,
    });
  }

  if (!cliOpts.name) {
    questions.push({
      type: 'text',
      name: 'name',
      message: 'Component name:',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Name is required';
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value)) {
          return 'Name must start with a letter and contain only letters, numbers, hyphens, and underscores';
        }
        return true;
      }
    });
  }

  const answers = questions.length ? await prompts(questions) : {};
  
  const type = cliOpts.type || answers.type;
  const name = cliOpts.name || answers.name;

  if (!type || !name) {
    throw new Error('Type and name are required');
  }

  // Additional prompts based on component type
  const additionalQuestions: prompts.PromptObject[] = [];

  if (type === 'command' || type === 'slash-command') {
    additionalQuestions.push({
      type: 'text',
      name: 'description',
      message: 'Command description:',
      initial: `A ${name} command`,
    });

    additionalQuestions.push({
      type: 'text',
      name: 'category',
      message: 'Command category (optional):',
      initial: 'general',
    });

    additionalQuestions.push({
      type: 'multiselect',
      name: 'permissions',
      message: 'Required permissions (optional):',
      choices: [
        { title: 'Administrator', value: 'Administrator' },
        { title: 'Manage Guild', value: 'ManageGuild' },
        { title: 'Manage Messages', value: 'ManageMessages' },
        { title: 'Manage Roles', value: 'ManageRoles' },
        { title: 'Manage Channels', value: 'ManageChannels' },
        { title: 'Kick Members', value: 'KickMembers' },
        { title: 'Ban Members', value: 'BanMembers' },
        { title: 'Moderate Members', value: 'ModerateMembers' },
      ],
    });
  } else if (type === 'event') {
    additionalQuestions.push({
      type: 'select',
      name: 'eventType',
      message: 'Event type:',
      choices: [
        { title: 'messageCreate', value: 'messageCreate' },
        { title: 'messageDelete', value: 'messageDelete' },
        { title: 'messageUpdate', value: 'messageUpdate' },
        { title: 'guildMemberAdd', value: 'guildMemberAdd' },
        { title: 'guildMemberRemove', value: 'guildMemberRemove' },
        { title: 'interactionCreate', value: 'interactionCreate' },
        { title: 'ready', value: 'ready' },
        { title: 'guildCreate', value: 'guildCreate' },
        { title: 'guildDelete', value: 'guildDelete' },
        { title: 'voiceStateUpdate', value: 'voiceStateUpdate' },
        { title: 'Custom Event', value: 'custom' },
      ],
    });
  }

  const additionalAnswers = additionalQuestions.length ? await prompts(additionalQuestions) : {};

  return {
    type,
    name,
    description: additionalAnswers.description,
    category: additionalAnswers.category,
    permissions: additionalAnswers.permissions || [],
    ...additionalAnswers,
  };
}

async function generateComponent(options: GenerateOptions, projectPath: string, language: 'typescript' | 'javascript') {
  const ext = language === 'typescript' ? 'ts' : 'js';
  
  console.log(chalk.cyan(`\n📁 Generating ${options.type}...`));

  switch (options.type) {
    case 'command':
      await generateMessageCommand(options, projectPath, ext);
      break;
    case 'slash-command':
      await generateSlashCommand(options, projectPath, ext);
      break;
    case 'event':
      await generateEventHandler(options, projectPath, ext);
      break;
  }

  console.log(chalk.green(`\n✅ Successfully generated ${options.type}: ${options.name}`));
  console.log(chalk.yellow('\n💡 Don\'t forget to:'));
  
  if (options.type === 'command') {
    console.log(chalk.yellow('   • Import and register the command in your main bot file'));
  } else if (options.type === 'slash-command') {
    console.log(chalk.yellow('   • Deploy slash commands with Discord API'));
    console.log(chalk.yellow('   • Import and register the command in your main bot file'));
  } else if (options.type === 'event') {
    console.log(chalk.yellow('   • Import and register the event in your main bot file'));
  }
}

async function generateMessageCommand(options: GenerateOptions, projectPath: string, ext: string) {
  const commandsDir = join(projectPath, 'commands');
  
  if (!existsSync(commandsDir)) {
    console.log(chalk.yellow('📁 Creating commands directory...'));
    mkdirSync(commandsDir, { recursive: true });
  }

  const filename = join(commandsDir, `${options.name}.${ext}`);
  
  if (existsSync(filename)) {
    const overwrite = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Command ${options.name}.${ext} already exists. Overwrite?`,
      initial: false,
    });
    
    if (!overwrite.overwrite) {
      console.log(chalk.yellow('⏭️  Skipped generation'));
      return;
    }
  }

  const content = ext === 'ts' ? generateMessageCommandTS(options) : generateMessageCommandJS(options);
  
  writeFileSync(filename, content);
  console.log(chalk.green(`✅ Created: commands/${options.name}.${ext}`));
}

async function generateSlashCommand(options: GenerateOptions, projectPath: string, ext: string) {
  const commandsDir = join(projectPath, 'slash-commands');
  
  if (!existsSync(commandsDir)) {
    console.log(chalk.yellow('📁 Creating slash-commands directory...'));
    mkdirSync(commandsDir, { recursive: true });
  }

  const filename = join(commandsDir, `${options.name}.${ext}`);
  
  if (existsSync(filename)) {
    const overwrite = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Slash command ${options.name}.${ext} already exists. Overwrite?`,
      initial: false,
    });
    
    if (!overwrite.overwrite) {
      console.log(chalk.yellow('⏭️  Skipped generation'));
      return;
    }
  }

  const content = ext === 'ts' ? generateSlashCommandTS(options) : generateSlashCommandJS(options);
  
  writeFileSync(filename, content);
  console.log(chalk.green(`✅ Created: slash-commands/${options.name}.${ext}`));
}

async function generateEventHandler(options: GenerateOptions, projectPath: string, ext: string) {
  const eventsDir = join(projectPath, 'events');
  
  if (!existsSync(eventsDir)) {
    console.log(chalk.yellow('📁 Creating events directory...'));
    mkdirSync(eventsDir, { recursive: true });
  }

  const filename = join(eventsDir, `${options.name}.${ext}`);
  
  if (existsSync(filename)) {
    const overwrite = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Event ${options.name}.${ext} already exists. Overwrite?`,
      initial: false,
    });
    
    if (!overwrite.overwrite) {
      console.log(chalk.yellow('⏭️  Skipped generation'));
      return;
    }
  }

  const content = ext === 'ts' ? generateEventHandlerTS(options) : generateEventHandlerJS(options);
  
  writeFileSync(filename, content);
  console.log(chalk.green(`✅ Created: events/${options.name}.${ext}`));
}

function detectProjectLanguage(projectPath: string): 'typescript' | 'javascript' {
  if (existsSync(join(projectPath, 'tsconfig.json'))) {
    return 'typescript';
  }
  if (existsSync(join(projectPath, 'index.ts'))) {
    return 'typescript';
  }
  return 'javascript';
}

function generateMessageCommandTS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions && options.permissions.length > 0 
    ? `
  // Check permissions
  if (!message.member?.permissions.has([${options.permissions.map(p => `PermissionFlagsBits.${p}`).join(', ')}])) {
    return message.reply('❌ You don\'t have permission to use this command.');
  }`
    : '';

  return `import { Message, PermissionFlagsBits } from 'discord.js';

export const name = '${options.name}';
export const description = '${options.description || `A ${options.name} command`}';
export const category = '${options.category || 'general'}';
export const aliases = ['${options.name.charAt(0)}'];
export const usage = '${options.name} [arguments]';
export const cooldown = 3; // seconds

export async function execute(message: Message, args: string[]) {
  try {${permissionsCheck}
    
    // Command logic here
    await message.reply(\`Hello! This is the ${options.name} command.\`);
    
  } catch (error) {
    console.error(\`Error in ${options.name} command:\`, error);
    await message.reply('❌ An error occurred while executing this command.');
  }
}
`;
}

function generateMessageCommandJS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions && options.permissions.length > 0 
    ? `
  // Check permissions
  if (!message.member?.permissions.has([${options.permissions.map(p => `PermissionFlagsBits.${p}`).join(', ')}])) {
    return message.reply('❌ You don\\'t have permission to use this command.');
  }`
    : '';

  return `const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: '${options.name}',
  description: '${options.description || `A ${options.name} command`}',
  category: '${options.category || 'general'}',
  aliases: ['${options.name.charAt(0)}'],
  usage: '${options.name} [arguments]',
  cooldown: 3, // seconds

  async execute(message, args) {
    try {${permissionsCheck}
      
      // Command logic here
      await message.reply(\`Hello! This is the ${options.name} command.\`);
      
    } catch (error) {
      console.error(\`Error in ${options.name} command:\`, error);
      await message.reply('❌ An error occurred while executing this command.');
    }
  }
};
`;
}

function generateSlashCommandTS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions && options.permissions.length > 0 
    ? `
  // Check permissions
  if (!interaction.memberPermissions?.has([${options.permissions.map(p => `PermissionFlagsBits.${p}`).join(', ')}])) {
    return interaction.reply({ content: '❌ You don\\'t have permission to use this command.', ephemeral: true });
  }`
    : '';

  return `import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('${options.name}')
  .setDescription('${options.description || `A ${options.name} command`}')${options.permissions && options.permissions.length > 0 ? `
  .setDefaultMemberPermissions(PermissionFlagsBits.${options.permissions[0]})` : ''};

export const category = '${options.category || 'general'}';
export const cooldown = 3; // seconds

export async function execute(interaction: CommandInteraction) {
  try {${permissionsCheck}
    
    // Command logic here
    await interaction.reply(\`Hello! This is the ${options.name} slash command.\`);
    
  } catch (error) {
    console.error(\`Error in ${options.name} slash command:\`, error);
    
    const errorMessage = '❌ An error occurred while executing this command.';
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
`;
}

function generateSlashCommandJS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions && options.permissions.length > 0 
    ? `
  // Check permissions
  if (!interaction.memberPermissions?.has([${options.permissions.map(p => `PermissionFlagsBits.${p}`).join(', ')}])) {
    return interaction.reply({ content: '❌ You don\\'t have permission to use this command.', ephemeral: true });
  }`
    : '';

  return `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${options.name}')
    .setDescription('${options.description || `A ${options.name} command`}')${options.permissions && options.permissions.length > 0 ? `
    .setDefaultMemberPermissions(PermissionFlagsBits.${options.permissions[0]})` : ''},
  
  category: '${options.category || 'general'}',
  cooldown: 3, // seconds

  async execute(interaction) {
    try {${permissionsCheck}
      
      // Command logic here
      await interaction.reply(\`Hello! This is the ${options.name} slash command.\`);
      
    } catch (error) {
      console.error(\`Error in ${options.name} slash command:\`, error);
      
      const errorMessage = '❌ An error occurred while executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }
};
`;
}

function generateEventHandlerTS(options: GenerateOptions): string {
  const eventType = (options as any).eventType || 'messageCreate';
  const eventName = eventType === 'custom' ? options.name : eventType;
  
  const eventHandlers: { [key: string]: string } = {
    messageCreate: `import { Message } from 'discord.js';

export const name = 'messageCreate';
export const once = false;

export function execute(message: Message) {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Event logic here
  console.log(\`Message from \${message.author.tag}: \${message.content}\`);
}`,
    
    messageDelete: `import { Message } from 'discord.js';

export const name = 'messageDelete';
export const once = false;

export function execute(message: Message) {
  // Event logic here
  console.log(\`Message deleted: \${message.content || 'Unknown content'}\`);
}`,
    
    guildMemberAdd: `import { GuildMember } from 'discord.js';

export const name = 'guildMemberAdd';
export const once = false;

export function execute(member: GuildMember) {
  // Event logic here
  console.log(\`\${member.user.tag} joined \${member.guild.name}\`);
  
  // Send welcome message
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(\`Welcome to the server, \${member}! 🎉\`);
  }
}`,
    
    ready: `import { Client } from 'discord.js';

export const name = 'ready';
export const once = true;

export function execute(client: Client) {
  console.log(\`Ready! Logged in as \${client.user?.tag}\`);
}`,
    
    custom: `export const name = '${eventName}';
export const once = false;

export function execute(...args: any[]) {
  // Custom event logic here
  console.log('Custom event triggered:', args);
}`
  };

  return eventHandlers[eventType] || eventHandlers['custom'] || '';
}

function generateEventHandlerJS(options: GenerateOptions): string {
  const eventType = (options as any).eventType || 'messageCreate';
  const eventName = eventType === 'custom' ? options.name : eventType;
  
  const eventHandlers: { [key: string]: string } = {
    messageCreate: `module.exports = {
  name: 'messageCreate',
  once: false,

  execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Event logic here
    console.log(\`Message from \${message.author.tag}: \${message.content}\`);
  }
};`,
    
    messageDelete: `module.exports = {
  name: 'messageDelete',
  once: false,

  execute(message) {
    // Event logic here
    console.log(\`Message deleted: \${message.content || 'Unknown content'}\`);
  }
};`,
    
    guildMemberAdd: `module.exports = {
  name: 'guildMemberAdd',
  once: false,

  execute(member) {
    // Event logic here
    console.log(\`\${member.user.tag} joined \${member.guild.name}\`);
    
    // Send welcome message
    const channel = member.guild.systemChannel;
    if (channel) {
      channel.send(\`Welcome to the server, \${member}! 🎉\`);
    }
  }
};`,
    
    ready: `module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(\`Ready! Logged in as \${client.user?.tag}\`);
  }
};`,
    
    custom: `module.exports = {
  name: '${eventName}',
  once: false,

  execute(...args) {
    // Custom event logic here
    console.log('Custom event triggered:', args);
  }
};`
  };

  return eventHandlers[eventType] || eventHandlers['custom'] || '';
}
