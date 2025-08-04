// Main bot file generators for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generateMainFile(options: InitOptions): string {
  if (options.template === "typescript") {
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

  if (options.botType === "music") {
    imports += `\nimport { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';`;
  }

  let intents = `GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent`;

  if (options.botType === "music") {
    intents += `,
    GatewayIntentBits.GuildVoiceStates`;
  }

  if (options.botType === "moderation") {
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
    clientSetup += `\n\n// Initialize database\nlet db: any;\ninitDatabase().then(database => {\n  db = database;\n  ${options.logging ? "logger.info('Database initialized');" : "console.log('Database initialized');"}\n});`;
  }

  let commandLoader = "";
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

  let slashCommandLoader = "";
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
  ${options.logging ? "logger.info(`✅ Ready! Logged in as ${client.user?.tag}`);" : "console.log(`✅ Ready! Logged in as ${client.user?.tag}`);"}
  ${options.webhooks ? "\n  startWebhookServer();" : ""}
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
    await command.execute(message, args${options.database ? ", db" : ""});
  } catch (error) {
    ${options.logging ? "logger.error('Error executing command:', error);" : "console.error('Error executing command:', error);"}
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
    await command.execute(interaction${options.database ? ", db" : ""});
  } catch (error) {
    ${options.logging ? "logger.error('Error executing slash command:', error);" : "console.error('Error executing slash command:', error);"}
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
  if (options.botType === "moderation") {
    eventHandlers += `

// Moderation event handlers
client.on('guildMemberAdd', (member) => {
  ${options.logging ? "logger.info(`New member joined: ${member.user.tag}`);" : "console.log(`New member joined: ${member.user.tag}`);"}
  // Welcome message logic here
});

client.on('messageDelete', (message) => {
  ${options.logging ? "logger.info(`Message deleted: ${message.content}`);" : "console.log(`Message deleted: ${message.content}`);"}
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

  let commandLoader = "";
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

  let slashCommandLoader = "";
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
