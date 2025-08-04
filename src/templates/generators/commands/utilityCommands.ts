// Utility bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateUtilityCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the current server'),
    config: {
        category: 'utility',
        usage: '/serverinfo',
        examples: ['/serverinfo'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            const guild = interaction.guild;
            if (!guild) {
                return await interaction.reply({
                    content: '❌ This command can only be used in a server!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(\`📊 \${guild.name} Server Information\`)
                .setThumbnail(guild.iconURL() || '')
                .addFields(
                    { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
                    { name: '📅 Created', value: \`<t:\${Math.floor(guild.createdTimestamp / 1000)}:D>\`, inline: true },
                    { name: '👑 Owner', value: \`<@\${guild.ownerId}>\`, inline: true },
                    { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true },
                    { name: '💬 Channels', value: guild.channels.cache.size.toString(), inline: true },
                    { name: '🚀 Boost Level', value: \`Level \${guild.premiumTier}\`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing serverinfo command:', error);
            await interaction.reply({
                content: '❌ An error occurred while getting server information.',
                ephemeral: true
            });
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the current server'),
    config: {
        category: 'utility',
        usage: '/serverinfo',
        examples: ['/serverinfo'],
        permissions: []
    },
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            if (!guild) {
                return await interaction.reply({
                    content: '❌ This command can only be used in a server!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(\`📊 \${guild.name} Server Information\`)
                .setThumbnail(guild.iconURL() || '')
                .addFields(
                    { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
                    { name: '📅 Created', value: \`<t:\${Math.floor(guild.createdTimestamp / 1000)}:D>\`, inline: true },
                    { name: '👑 Owner', value: \`<@\${guild.ownerId}>\`, inline: true },
                    { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true },
                    { name: '💬 Channels', value: guild.channels.cache.size.toString(), inline: true },
                    { name: '🚀 Boost Level', value: \`Level \${guild.premiumTier}\`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error executing serverinfo command:', error);
            await interaction.reply({
                content: '❌ An error occurred while getting server information.',
                ephemeral: true
            });
        }
    }
};`;
  }
}
