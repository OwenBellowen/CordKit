// Economy bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateEconomyCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your or another user\\'s balance')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check balance for')
                .setRequired(false)),
    config: {
        category: 'economy',
        usage: '/balance [user]',
        examples: ['/balance', '/balance @User'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            
            // This would typically fetch from database
            const balance = Math.floor(Math.random() * 10000); // Placeholder
            const bank = Math.floor(Math.random() * 50000); // Placeholder
            
            const embed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle(\`💰 \${targetUser.displayName}'s Balance\`)
                .addFields(
                    { name: '💵 Wallet', value: \`$\${balance.toLocaleString()}\`, inline: true },
                    { name: '🏦 Bank', value: \`$\${bank.toLocaleString()}\`, inline: true },
                    { name: '💎 Total', value: \`$\${(balance + bank).toLocaleString()}\`, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing balance command:', error);
            await interaction.reply({
                content: '❌ An error occurred while checking balance.',
                ephemeral: true
            });
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your or another user\\'s balance')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check balance for')
                .setRequired(false)),
    config: {
        category: 'economy',
        usage: '/balance [user]',
        examples: ['/balance', '/balance @User'],
        permissions: []
    },
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            
            // This would typically fetch from database
            const balance = Math.floor(Math.random() * 10000); // Placeholder
            const bank = Math.floor(Math.random() * 50000); // Placeholder
            
            const embed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle(\`💰 \${targetUser.displayName}'s Balance\`)
                .addFields(
                    { name: '💵 Wallet', value: \`$\${balance.toLocaleString()}\`, inline: true },
                    { name: '🏦 Bank', value: \`$\${bank.toLocaleString()}\`, inline: true },
                    { name: '💎 Total', value: \`$\${(balance + bank).toLocaleString()}\`, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing balance command:', error);
            await interaction.reply({
                content: '❌ An error occurred while checking balance.',
                ephemeral: true
            });
        }
    }
};`;
  }
}
