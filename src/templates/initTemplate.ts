// Project initialization logic for CordKit
import prompts from 'prompts';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface InitOptions {
  template: 'typescript' | 'javascript';
  dotenv: boolean;
  commands: boolean;
  slash: boolean;
  database: boolean;
  logging: boolean;
  webhooks: boolean;
  docker: boolean;
  testing: boolean;
  linting: boolean;
  botType: 'general' | 'music' | 'moderation' | 'utility';
}

export async function promptInitOptions(cliOpts: any): Promise<InitOptions> {
  const questions: prompts.PromptObject[] = [];
  
  // Only prompt for options that weren't provided via CLI flags
  if (!cliOpts.template) {
    questions.push({
      type: 'select' as const,
      name: 'template',
      message: 'Choose a template',
      choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
      ],
      initial: 0,
    });
  }
  
  if (cliOpts.dotenv === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'dotenv',
      message: 'Include dotenv support?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    });
  }
  
  if (cliOpts.commands === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'commands',
      message: 'Include command folders?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    });
  }
  
  if (cliOpts.slash === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'slash',
      message: 'Include slash command support?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.botType === undefined) {
    questions.push({
      type: 'select' as const,
      name: 'botType',
      message: 'Choose bot type:',
      choices: [
        { title: 'General Purpose Bot', value: 'general' },
        { title: 'Music Bot', value: 'music' },
        { title: 'Moderation Bot', value: 'moderation' },
        { title: 'Utility Bot', value: 'utility' },
      ],
      initial: 0,
    });
  }

  if (cliOpts.database === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'database',
      message: 'Include database support (SQLite)?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.logging === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'logging',
      message: 'Include advanced logging?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.webhooks === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'webhooks',
      message: 'Include webhook support?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.docker === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'docker',
      message: 'Include Docker configuration?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.testing === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'testing',
      message: 'Include testing setup?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
  }

  if (cliOpts.linting === undefined) {
    questions.push({
      type: 'toggle' as const,
      name: 'linting',
      message: 'Include ESLint/Prettier?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    });
  }

  const answers = questions.length ? await prompts(questions) : {};
  
  return {
    template: cliOpts.template || answers.template || 'typescript',
    dotenv: cliOpts.dotenv !== undefined ? cliOpts.dotenv : (answers.dotenv !== undefined ? answers.dotenv : true),
    commands: cliOpts.commands !== undefined ? cliOpts.commands : (answers.commands !== undefined ? answers.commands : true),
    slash: cliOpts.slash !== undefined ? cliOpts.slash : (answers.slash !== undefined ? answers.slash : false),
    botType: cliOpts.botType || answers.botType || 'general',
    database: cliOpts.database !== undefined ? cliOpts.database : (answers.database !== undefined ? answers.database : false),
    logging: cliOpts.logging !== undefined ? cliOpts.logging : (answers.logging !== undefined ? answers.logging : true),
    webhooks: cliOpts.webhooks !== undefined ? cliOpts.webhooks : (answers.webhooks !== undefined ? answers.webhooks : false),
    docker: cliOpts.docker !== undefined ? cliOpts.docker : (answers.docker !== undefined ? answers.docker : false),
    testing: cliOpts.testing !== undefined ? cliOpts.testing : (answers.testing !== undefined ? answers.testing : false),
    linting: cliOpts.linting !== undefined ? cliOpts.linting : (answers.linting !== undefined ? answers.linting : true),
  };
}

export async function generateProject(options: InitOptions, projectName?: string) {
  let finalProjectName = projectName;
  
  // Prompt for project name if not provided
  if (!finalProjectName) {
    const projectNamePrompt = await prompts({
      type: 'text' as const,
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-discord-bot',
      validate: (value: string) => value.length > 0 ? true : 'Project name is required'
    });
    finalProjectName = projectNamePrompt.projectName;
  }

  // Ensure we have a project name
  if (!finalProjectName) {
    console.error('❌ Project name is required!');
    process.exit(1);
  }

  const projectPath = join(process.cwd(), finalProjectName);

  // Check if directory already exists
  if (existsSync(projectPath)) {
    console.error(`❌ Directory '${finalProjectName}' already exists!`);
    process.exit(1);
  }

  console.log(`📁 Creating project directory: ${finalProjectName}`);
  mkdirSync(projectPath, { recursive: true });

  // Generate package.json
  console.log('📦 Generating package.json...');
  const packageJson = generatePackageJson(finalProjectName, options);
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Generate .env file if dotenv is enabled
  if (options.dotenv) {
    console.log('🔐 Generating .env file...');
    const envContent = generateEnvFile();
    writeFileSync(join(projectPath, '.env'), envContent);
    
    // Also create .env.example
    const envExampleContent = generateEnvExampleFile();
    writeFileSync(join(projectPath, '.env.example'), envExampleContent);
  }

  // Generate main bot file
  console.log(`🤖 Generating main bot file (index.${options.template === 'typescript' ? 'ts' : 'js'})...`);
  const mainFile = generateMainFile(options);
  const mainFileName = `index.${options.template === 'typescript' ? 'ts' : 'js'}`;
  writeFileSync(join(projectPath, mainFileName), mainFile);

  // Generate commands folder and sample command if enabled
  if (options.commands) {
    console.log('⚡ Creating commands folder...');
    const commandsPath = join(projectPath, 'commands');
    mkdirSync(commandsPath, { recursive: true });
    
    const sampleCommand = generateSampleCommand(options);
    const commandFileName = `ping.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(commandsPath, commandFileName), sampleCommand);
  }

  // Generate slash command if enabled
  if (options.slash) {
    console.log('🔗 Creating slash commands...');
    const slashCommandsPath = join(projectPath, 'slash-commands');
    mkdirSync(slashCommandsPath, { recursive: true });
    
    const slashCommand = generateSlashCommand(options);
    const slashFileName = `ping.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(slashCommandsPath, slashFileName), slashCommand);
  }

  // Generate database configuration if enabled
  if (options.database) {
    console.log('🗄️ Setting up database...');
    const dbPath = join(projectPath, 'database');
    mkdirSync(dbPath, { recursive: true });
    
    const dbSchema = generateDatabaseSchema(options);
    const dbFileName = `schema.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(dbPath, dbFileName), dbSchema);
  }

  // Generate logging configuration if enabled
  if (options.logging) {
    console.log('📝 Setting up logging...');
    const utilsPath = join(projectPath, 'utils');
    mkdirSync(utilsPath, { recursive: true });
    
    const logger = generateLogger(options);
    const loggerFileName = `logger.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(utilsPath, loggerFileName), logger);
  }

  // Generate webhook configuration if enabled
  if (options.webhooks) {
    console.log('🔗 Setting up webhooks...');
    const webhooksPath = join(projectPath, 'webhooks');
    mkdirSync(webhooksPath, { recursive: true });
    
    const webhook = generateWebhook(options);
    const webhookFileName = `server.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(webhooksPath, webhookFileName), webhook);
  }

  // Generate Docker configuration if enabled
  if (options.docker) {
    console.log('🐳 Setting up Docker...');
    const dockerfile = generateDockerfile();
    writeFileSync(join(projectPath, 'Dockerfile'), dockerfile);
    
    const dockerCompose = generateDockerCompose();
    writeFileSync(join(projectPath, 'docker-compose.yml'), dockerCompose);
    
    const dockerIgnore = generateDockerIgnore();
    writeFileSync(join(projectPath, '.dockerignore'), dockerIgnore);
  }

  // Generate testing configuration if enabled
  if (options.testing) {
    console.log('🧪 Setting up testing...');
    const testsPath = join(projectPath, 'tests');
    mkdirSync(testsPath, { recursive: true });
    
    const testConfig = generateTestConfig(options);
    const testFileName = options.template === 'typescript' ? 'jest.config.ts' : 'jest.config.js';
    writeFileSync(join(projectPath, testFileName), testConfig);
    
    const sampleTest = generateSampleTest(options);
    const sampleTestFileName = `bot.test.${options.template === 'typescript' ? 'ts' : 'js'}`;
    writeFileSync(join(testsPath, sampleTestFileName), sampleTest);
  }

  // Generate linting configuration if enabled
  if (options.linting) {
    console.log('🔍 Setting up ESLint and Prettier...');
    const eslintConfig = generateESLintConfig(options);
    writeFileSync(join(projectPath, '.eslintrc.json'), JSON.stringify(eslintConfig, null, 2));
    
    const prettierConfig = generatePrettierConfig();
    writeFileSync(join(projectPath, '.prettierrc'), JSON.stringify(prettierConfig, null, 2));
    
    const prettierIgnore = generatePrettierIgnore();
    writeFileSync(join(projectPath, '.prettierignore'), prettierIgnore);
  }

  // Generate TypeScript config if needed
  if (options.template === 'typescript') {
    console.log('⚙️ Generating tsconfig.json...');
    const tsConfig = generateTsConfig();
    writeFileSync(join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  }

  // Generate README
  console.log('📝 Generating README.md...');
  const readme = generateReadme(finalProjectName, options);
  writeFileSync(join(projectPath, 'README.md'), readme);

  // Generate .gitignore
  console.log('🙈 Generating .gitignore...');
  const gitignore = generateGitignore();
  writeFileSync(join(projectPath, '.gitignore'), gitignore);

  console.log('\n✅ Project generated successfully!');
  console.log(`\n📋 Next steps:`);
  console.log(`   cd ${finalProjectName}`);
  console.log(`   bun install`);
  if (options.dotenv) {
    console.log(`   # Edit .env file with your Discord bot token`);
  }
  console.log(`   bun run start\n`);
}

// Helper functions for generating file contents

function generatePackageJson(projectName: string, options: InitOptions) {
  const pkg: any = {
    name: projectName,
    version: '1.0.0',
    description: `A Discord.js ${options.botType} bot generated with CordKit`,
    main: options.template === 'typescript' ? 'index.ts' : 'index.js',
    type: 'module',
    scripts: {
      start: options.template === 'typescript' ? 'bun run index.ts' : 'bun run index.js',
      dev: options.template === 'typescript' ? 'bun --watch index.ts' : 'bun --watch index.js'
    },
    dependencies: {
      'discord.js': '^14.14.1'
    },
    devDependencies: {},
    keywords: ['discord', 'bot', 'discord.js', 'bun', options.botType],
    author: '',
    license: 'MIT'
  };

  // Add conditional dependencies
  if (options.dotenv) {
    pkg.dependencies.dotenv = '^16.3.1';
  }

  if (options.database) {
    pkg.dependencies.sqlite3 = '^5.1.6';
    pkg.dependencies.sqlite = '^5.1.1';
  }

  if (options.logging) {
    pkg.dependencies.winston = '^3.11.0';
  }

  if (options.webhooks) {
    pkg.dependencies.express = '^4.18.2';
    if (options.template === 'typescript') {
      pkg.devDependencies['@types/express'] = '^4.17.21';
    }
  }

  if (options.testing) {
    pkg.devDependencies.jest = '^29.7.0';
    pkg.scripts.test = 'jest';
    pkg.scripts['test:watch'] = 'jest --watch';
    pkg.scripts['test:coverage'] = 'jest --coverage';
    
    if (options.template === 'typescript') {
      pkg.devDependencies['ts-jest'] = '^29.1.1';
      pkg.devDependencies['@types/jest'] = '^29.5.8';
    }
  }

  if (options.linting) {
    pkg.devDependencies.eslint = '^8.56.0';
    pkg.devDependencies.prettier = '^3.1.0';
    pkg.scripts.lint = options.template === 'typescript' ? 'eslint . --ext .ts' : 'eslint . --ext .js';
    pkg.scripts['lint:fix'] = options.template === 'typescript' ? 'eslint . --ext .ts --fix' : 'eslint . --ext .js --fix';
    pkg.scripts.format = 'prettier --write .';
    
    if (options.template === 'typescript') {
      pkg.devDependencies['@typescript-eslint/eslint-plugin'] = '^6.13.0';
      pkg.devDependencies['@typescript-eslint/parser'] = '^6.13.0';
    }
  }

  if (options.template === 'typescript') {
    pkg.devDependencies.typescript = '^5.3.0';
    pkg.devDependencies['@types/node'] = '^20.0.0';
  }

  // Add bot-type specific dependencies
  if (options.botType === 'music') {
    pkg.dependencies['@discordjs/voice'] = '^0.16.0';
    pkg.dependencies.ytdl = '^1.0.9';
    pkg.dependencies['play-dl'] = '^1.9.7';
  }

  return pkg;
}

function generateEnvFile(): string {
  return `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;
}

function generateEnvExampleFile(): string {
  return `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;
}

function generateMainFile(options: InitOptions): string {
  if (options.template === 'typescript') {
    return generateMainFileTypeScript(options);
  } else {
    return generateMainFileJavaScript(options);
  }
}

function generateMainFileTypeScript(options: InitOptions): string {
  let imports = `import { Client, GatewayIntentBits, Collection } from 'discord.js';`;
  
  if (options.dotenv) {
    imports += `\nimport 'dotenv/config';`;
  }
  
  if (options.commands || options.slash) {
    imports += `\nimport { readdirSync } from 'fs';\nimport { join } from 'path';`;
  }

  if (options.database) {
    imports += `\nimport { initDatabase } from './database/schema';`;
  }

  if (options.logging) {
    imports += `\nimport logger from './utils/logger';`;
  }

  if (options.webhooks) {
    imports += `\nimport { startWebhookServer } from './webhooks/server';`;
  }

  if (options.botType === 'music') {
    imports += `\nimport { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';`;
  }

  let intents = `GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent`;

  if (options.botType === 'music') {
    intents += `,
    GatewayIntentBits.GuildVoiceStates`;
  }

  if (options.botType === 'moderation') {
    intents += `,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration`;
  }

  let clientSetup = `
// Create a new client instance
const client = new Client({
  intents: [
    ${intents},
  ],
});`;

  if (options.commands || options.slash) {
    clientSetup += `\n\n// Extend client to include commands collection\ndeclare module 'discord.js' {\n  interface Client {\n    commands: Collection<string, any>;\n  }\n}\n\nclient.commands = new Collection();`;
  }

  if (options.database) {
    clientSetup += `\n\n// Initialize database\nlet db: any;\ninitDatabase().then(database => {\n  db = database;\n  ${options.logging ? 'logger.info(\'Database initialized\');' : 'console.log(\'Database initialized\');'}\n});`;
  }

  let commandLoader = '';
  if (options.commands) {
    commandLoader = `
// Load message commands
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(\`./commands/\${file}\`);
  if (command.name && command.execute) {
    client.commands.set(command.name, command);
  }
}`;
  }

  let slashCommandLoader = '';
  if (options.slash) {
    slashCommandLoader = `
// Load slash commands
const slashCommandFiles = readdirSync('./slash-commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of slashCommandFiles) {
  const command = await import(\`./slash-commands/\${file}\`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}`;
  }

  let eventHandlers = `
// When the client is ready, run this code
client.once('ready', () => {
  ${options.logging ? 'logger.info(`✅ Ready! Logged in as ${client.user?.tag}`);' : 'console.log(`✅ Ready! Logged in as ${client.user?.tag}`);'}
  ${options.webhooks ? '\n  startWebhookServer();' : ''}
});`;

  if (options.commands) {
    eventHandlers += `

// Handle message commands
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args${options.database ? ', db' : ''});
  } catch (error) {
    ${options.logging ? 'logger.error(\'Error executing command:\', error);' : 'console.error(\'Error executing command:\', error);'}
    await message.reply('There was an error executing that command.');
  }
});`;
  }

  if (options.slash) {
    eventHandlers += `

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction${options.database ? ', db' : ''});
  } catch (error) {
    ${options.logging ? 'logger.error(\'Error executing slash command:\', error);' : 'console.error(\'Error executing slash command:\', error);'}
    const reply = { content: 'There was an error executing that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});`;
  }

  // Add bot-type specific event handlers
  if (options.botType === 'moderation') {
    eventHandlers += `

// Moderation event handlers
client.on('guildMemberAdd', (member) => {
  ${options.logging ? 'logger.info(`New member joined: ${member.user.tag}`);' : 'console.log(`New member joined: ${member.user.tag}`);'}
  // Welcome message logic here
});

client.on('messageDelete', (message) => {
  ${options.logging ? 'logger.info(`Message deleted: ${message.content}`);' : 'console.log(`Message deleted: ${message.content}`);'}
  // Log deleted messages
});`;
  }

  const login = `
// Login to Discord
client.login(process.env.DISCORD_TOKEN);`;

  return `${imports}${clientSetup}${commandLoader}${slashCommandLoader}${eventHandlers}${login}`;
}

function generateMainFileJavaScript(options: InitOptions): string {
  let imports = `const { Client, GatewayIntentBits, Collection } = require('discord.js');`;
  
  if (options.dotenv) {
    imports += `\nrequire('dotenv').config();`;
  }
  
  if (options.commands) {
    imports += `\nconst { readdirSync } = require('fs');\nconst { join } = require('path');`;
  }

  let clientSetup = `
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});`;

  if (options.commands || options.slash) {
    clientSetup += `\n\n// Add commands collection to client\nclient.commands = new Collection();`;
  }

  let commandLoader = '';
  if (options.commands) {
    commandLoader = `
// Load message commands
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(\`./commands/\${file}\`);
  if (command.name && command.execute) {
    client.commands.set(command.name, command);
  }
}`;
  }

  let slashCommandLoader = '';
  if (options.slash) {
    slashCommandLoader = `
// Load slash commands
const slashCommandFiles = readdirSync('./slash-commands').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
  const command = require(\`./slash-commands/\${file}\`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}`;
  }

  let eventHandlers = `
// When the client is ready, run this code
client.once('ready', () => {
  console.log(\`✅ Ready! Logged in as \${client.user?.tag}\`);
});`;

  if (options.commands) {
    eventHandlers += `

// Handle message commands
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error('Error executing command:', error);
    await message.reply('There was an error executing that command.');
  }
});`;
  }

  if (options.slash) {
    eventHandlers += `

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing slash command:', error);
    const reply = { content: 'There was an error executing that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});`;
  }

  const login = `
// Login to Discord
client.login(process.env.DISCORD_TOKEN);`;

  return `${imports}${clientSetup}${commandLoader}${slashCommandLoader}${eventHandlers}${login}`;
}

function generateSampleCommand(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import { Message } from 'discord.js';

export const name = 'ping';
export const description = 'Ping command to test bot responsiveness';

export async function execute(message: Message, args: string[]) {
  const sent = await message.reply('Pinging...');
  const timeDiff = sent.createdTimestamp - message.createdTimestamp;
  await sent.edit(\`🏓 Pong! Latency: \${timeDiff}ms\`);
}`;
  } else {
    return `module.exports = {
  name: 'ping',
  description: 'Ping command to test bot responsiveness',
  async execute(message, args) {
    const sent = await message.reply('Pinging...');
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(\`🏓 Pong! Latency: \${timeDiff}ms\`);
  },
};`;
  }
}

function generateSlashCommand(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping command to test bot responsiveness');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
  const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
  await interaction.editReply(\`🏓 Pong! Latency: \${timeDiff}ms\`);
}`;
  } else {
    return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping command to test bot responsiveness'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(\`🏓 Pong! Latency: \${timeDiff}ms\`);
  },
};`;
  }
}

function generateTsConfig() {
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      resolveJsonModule: true,
      noEmit: true
    },
    include: ['**/*.ts'],
    exclude: ['node_modules']
  };
}

function generateReadme(projectName: string, options: InitOptions): string {
  const ext = options.template === 'typescript' ? 'ts' : 'js';
  
  return `# ${projectName}

A Discord.js bot generated with CordKit.

## Features

- 🤖 Discord.js v14
- ⚡ Bun runtime
- ${options.template === 'typescript' ? '📘 TypeScript support' : '📙 JavaScript'}
${options.dotenv ? '- 🔐 Environment variables with dotenv' : ''}
${options.commands ? '- 📁 Message command handler' : ''}
${options.slash ? '- 🔗 Slash command support' : ''}

## Setup

1. **Install dependencies:**
   \`\`\`bash
   bun install
   \`\`\`

2. **Configure your bot:**
   ${options.dotenv ? `
   - Copy \`.env.example\` to \`.env\`
   - Add your Discord bot token to \`.env\`
   ` : `
   - Set your \`DISCORD_TOKEN\` environment variable
   `}

3. **Run the bot:**
   \`\`\`bash
   bun run start
   \`\`\`

   For development (with auto-restart):
   \`\`\`bash
   bun run dev
   \`\`\`

## Project Structure

\`\`\`
${projectName}/
├── index.${ext}           # Main bot file
${options.commands ? `├── commands/          # Message commands\n│   └── ping.${ext}       # Example ping command` : ''}
${options.slash ? `├── slash-commands/     # Slash commands\n│   └── ping.${ext}       # Example slash ping command` : ''}
├── package.json       # Dependencies and scripts
${options.dotenv ? `├── .env               # Environment variables (create this)\n├── .env.example       # Environment variables template` : ''}
${options.template === 'typescript' ? `├── tsconfig.json      # TypeScript configuration` : ''}
└── README.md          # This file
\`\`\`

## Commands

${options.commands ? `### Message Commands
- \`!ping\` - Test bot responsiveness

` : ''}${options.slash ? `### Slash Commands
- \`/ping\` - Test bot responsiveness

` : ''}## Development

This bot is built with:
- [Discord.js](https://discord.js.org/) - Discord API library
- [Bun](https://bun.sh/) - Fast JavaScript runtime
${options.template === 'typescript' ? '- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript' : ''}
${options.dotenv ? '- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management' : ''}

## Getting Your Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section
4. Create a bot and copy the token
5. ${options.dotenv ? 'Add the token to your `.env` file' : 'Set the `DISCORD_TOKEN` environment variable'}

## Adding the Bot to Your Server

1. In the Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select "bot" and "applications.commands" scopes
3. Select the permissions your bot needs
4. Use the generated URL to invite your bot

## License

MIT
`;
}

function generateGitignore(): string {
  return `# Dependencies
node_modules/
bun.lockb

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/

# Database
*.db
*.sqlite
*.sqlite3

# Testing
coverage/
.nyc_output/

# Docker
.dockerignore
`;
}

// New helper functions for additional features

function generateDatabaseSchema(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

// Database connection
export async function initDatabase() {
  const db = await open({
    filename: join(process.cwd(), 'data', 'bot.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(\`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prefix TEXT DEFAULT '!',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return db;
}

// User operations
export async function getUser(db: any, userId: string) {
  return await db.get('SELECT * FROM users WHERE id = ?', userId);
}

export async function createUser(db: any, userId: string, username: string) {
  return await db.run('INSERT INTO users (id, username) VALUES (?, ?)', userId, username);
}

// Guild operations
export async function getGuild(db: any, guildId: string) {
  return await db.get('SELECT * FROM guilds WHERE id = ?', guildId);
}

export async function createGuild(db: any, guildId: string, name: string) {
  return await db.run('INSERT INTO guilds (id, name) VALUES (?, ?)', guildId, name);
}`;
  } else {
    return `const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { join } = require('path');

// Database connection
async function initDatabase() {
  const db = await open({
    filename: join(process.cwd(), 'data', 'bot.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(\`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prefix TEXT DEFAULT '!',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return db;
}

// User operations
async function getUser(db, userId) {
  return await db.get('SELECT * FROM users WHERE id = ?', userId);
}

async function createUser(db, userId, username) {
  return await db.run('INSERT INTO users (id, username) VALUES (?, ?)', userId, username);
}

// Guild operations
async function getGuild(db, guildId) {
  return await db.get('SELECT * FROM guilds WHERE id = ?', guildId);
}

async function createGuild(db, guildId, name) {
  return await db.run('INSERT INTO guilds (id, name) VALUES (?, ?)', guildId, name);
}

module.exports = {
  initDatabase,
  getUser,
  createUser,
  getGuild,
  createGuild
};`;
  }
}

function generateLogger(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'discord-bot' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;`;
  } else {
    return `const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'discord-bot' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;`;
  }
}

function generateWebhook(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;

app.use(express.json());

// Webhook verification middleware
function verifySignature(req: any, res: any, next: any) {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return res.status(401).send('Unauthorized');
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const digest = 'sha256=' + hmac.digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Unauthorized');
  }
  
  next();
}

// Discord webhook endpoint
app.post('/webhook/discord', verifySignature, (req, res) => {
  console.log('Received Discord webhook:', req.body);
  
  // Process webhook payload here
  
  res.status(200).send('OK');
});

// GitHub webhook endpoint (example)
app.post('/webhook/github', verifySignature, (req, res) => {
  console.log('Received GitHub webhook:', req.body);
  
  // Process GitHub events here
  
  res.status(200).send('OK');
});

export function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(\`Webhook server running on port \${PORT}\`);
  });
}`;
  } else {
    return `const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;

app.use(express.json());

// Webhook verification middleware
function verifySignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return res.status(401).send('Unauthorized');
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const digest = 'sha256=' + hmac.digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Unauthorized');
  }
  
  next();
}

// Discord webhook endpoint
app.post('/webhook/discord', verifySignature, (req, res) => {
  console.log('Received Discord webhook:', req.body);
  
  // Process webhook payload here
  
  res.status(200).send('OK');
});

// GitHub webhook endpoint (example)
app.post('/webhook/github', verifySignature, (req, res) => {
  console.log('Received GitHub webhook:', req.body);
  
  // Process GitHub events here
  
  res.status(200).send('OK');
});

function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(\`Webhook server running on port \${PORT}\`);
  });
}

module.exports = { startWebhookServer };`;
  }
}

function generateDockerfile(): string {
  return `FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p logs data

# Expose port for webhooks
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the bot
CMD ["bun", "run", "start"]`;
}

function generateDockerCompose(): string {
  return `version: '3.8'

services:
  discord-bot:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    ports:
      - "3000:3000"
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  redis_data:`;
}

function generateDockerIgnore(): string {
  return `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
Dockerfile
docker-compose.yml
.dockerignore
logs/
data/
coverage/
.nyc_output/`;
}

function generateTestConfig(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;`;
  } else {
    return `module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};`;
  }
}

function generateSampleTest(options: InitOptions): string {
  if (options.template === 'typescript') {
    return `import { describe, test, expect } from '@jest/globals';

describe('Discord Bot', () => {
  test('should initialize properly', () => {
    expect(true).toBe(true);
  });

  test('ping command should respond with pong', async () => {
    // Mock Discord message
    const mockMessage = {
      reply: jest.fn().mockResolvedValue({
        createdTimestamp: Date.now() + 100,
        edit: jest.fn()
      }),
      createdTimestamp: Date.now()
    };

    // Test ping command logic here
    expect(mockMessage.reply).toBeDefined();
  });
});`;
  } else {
    return `const { describe, test, expect } = require('@jest/globals');

describe('Discord Bot', () => {
  test('should initialize properly', () => {
    expect(true).toBe(true);
  });

  test('ping command should respond with pong', async () => {
    // Mock Discord message
    const mockMessage = {
      reply: jest.fn().mockResolvedValue({
        createdTimestamp: Date.now() + 100,
        edit: jest.fn()
      }),
      createdTimestamp: Date.now()
    };

    // Test ping command logic here
    expect(mockMessage.reply).toBeDefined();
  });
});`;
  }
}

function generateESLintConfig(options: InitOptions): any {
  const baseConfig = {
    env: {
      node: true,
      es2022: true
    },
    extends: [
      'eslint:recommended'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error'
    }
  };

  if (options.template === 'typescript') {
    baseConfig.extends.push('@typescript-eslint/recommended');
    (baseConfig as any).parser = '@typescript-eslint/parser';
    (baseConfig as any).plugins = ['@typescript-eslint'];
  }

  return baseConfig;
}

function generatePrettierConfig(): any {
  return {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false
  };
}

function generatePrettierIgnore(): string {
  return `node_modules
coverage
dist
build
logs
*.log
.env*`;
}
