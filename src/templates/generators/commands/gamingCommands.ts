// Gaming bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateGamingCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll dice')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides on the dice')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of dice to roll')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),
    config: {
        category: 'gaming',
        usage: '/roll [sides] [count]',
        examples: ['/roll', '/roll 20', '/roll 6 3'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            const sides = interaction.options.getInteger('sides') || 6;
            const count = interaction.options.getInteger('count') || 1;
            
            const rolls: number[] = [];
            for (let i = 0; i < count; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }
            
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            
            const embed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('🎲 Dice Roll Results')
                .addFields(
                    { name: '🎯 Rolls', value: rolls.join(', '), inline: true },
                    { name: '📊 Total', value: total.toString(), inline: true },
                    { name: '⚙️ Config', value: \`\${count}d\${sides}\`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing roll command:', error);
            await interaction.reply({
                content: '❌ An error occurred while rolling dice.',
                ephemeral: true
            });
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll dice')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides on the dice')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of dice to roll')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),
    config: {
        category: 'gaming',
        usage: '/roll [sides] [count]',
        examples: ['/roll', '/roll 20', '/roll 6 3'],
        permissions: []
    },
    async execute(interaction) {
        try {
            const sides = interaction.options.getInteger('sides') || 6;
            const count = interaction.options.getInteger('count') || 1;
            
            const rolls = [];
            for (let i = 0; i < count; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }
            
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            
            const embed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('🎲 Dice Roll Results')
                .addFields(
                    { name: '🎯 Rolls', value: rolls.join(', '), inline: true },
                    { name: '📊 Total', value: total.toString(), inline: true },
                    { name: '⚙️ Config', value: \`\${count}d\${sides}\`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing roll command:', error);
            await interaction.reply({
                content: '❌ An error occurred while rolling dice.',
                ephemeral: true
            });
        }
    }
};`;
  }
}
