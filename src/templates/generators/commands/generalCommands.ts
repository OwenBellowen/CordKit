// General bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateGeneralCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('A test command to verify the bot is working'),
    config: {
        category: 'info',
        usage: '/test',
        examples: ['/test'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            await interaction.reply({
                content: '✅ Test command is working!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error executing test command:', error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ An error occurred while executing this command.',
                    ephemeral: true
                });
            }
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('A test command to verify the bot is working'),
    config: {
        category: 'info',
        usage: '/test',
        examples: ['/test'],
        permissions: []
    },
    async execute(interaction) {
        try {
            await interaction.reply({
                content: '✅ Test command is working!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error executing test command:', error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ An error occurred while executing this command.',
                    ephemeral: true
                });
            }
        }
    }
};`;
  }
}
