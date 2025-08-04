// Command generators for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generateSampleCommand(options: InitOptions): string {
  if (options.template === "typescript") {
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

export function generateSlashCommand(options: InitOptions): string {
  if (options.template === "typescript") {
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
