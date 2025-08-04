// Main command generator exports
import type { InitOptions } from "../../initTemplate";
import { generateMusicCommand } from "./musicCommands";
import { generateModerationCommand } from "./moderationCommands";
import { generateEconomyCommand } from "./economyCommands";
import { generateGamingCommand } from "./gamingCommands";
import { generateAICommand } from "./aiCommands";
import { generateUtilityCommand } from "./utilityCommands";
import { generateGeneralCommand } from "./generalCommands";

export function generateSampleEvent(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseEvent } from "../interfaces";
import { Events, Client } from "discord.js";
import BotClient from "../structures/Client";

export default <BaseEvent>{
    name: Events.ClientReady,
    once: true,
    async execute(client: BotClient) {
        console.log(\`Logged in as \${client.user?.tag}\`);
        console.log(\`Ready to serve \${client.guilds.cache.size} guilds\`);
    }
};`;
  } else {
    return `const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(\`Logged in as \${client.user?.tag}\`);
        console.log(\`Ready to serve \${client.guilds.cache.size} guilds\`);
    },
};`;
  }
}

export function generateSampleCommand(options: InitOptions): string {
  // Generate commands based on bot type
  switch (options.botType) {
    case "music":
      return generateMusicCommand(options);
    case "moderation":
      return generateModerationCommand(options);
    case "economy":
      return generateEconomyCommand(options);
    case "gaming":
      return generateGamingCommand(options);
    case "ai":
      return generateAICommand(options);
    case "utility":
      return generateUtilityCommand(options);
    case "general":
    default:
      return generateGeneralCommand(options);
  }
}

export function generateSlashCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),
    config: {
        category: 'info',
        usage: '/ping',
        examples: ['/ping'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true 
        });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(\`🏓 Pong! Latency: \${timeDiff}ms\`);
    }
};`;
  } else {
    return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),
    config: {
        category: 'info',
        usage: '/ping',
        examples: ['/ping'],
        permissions: []
    },
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true 
        });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(\`🏓 Pong! Latency: \${timeDiff}ms\`);
    }
};`;
  }
}
