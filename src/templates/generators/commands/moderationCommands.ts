// Moderation bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateModerationCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction, GuildMember, PermissionFlagsBits } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),
    config: {
        category: 'moderation',
        usage: '/ban <user> [reason]',
        examples: ['/ban @User Spamming', '/ban @User'],
        permissions: [PermissionFlagsBits.BanMembers]
    },
    async execute(interaction: CommandInteraction) {
        try {
            const userToBan = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.member as GuildMember;
            
            if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return await interaction.reply({
                    content: '❌ You don\\'t have permission to ban members!',
                    ephemeral: true
                });
            }

            await interaction.guild?.members.ban(userToBan, { reason });
            
            await interaction.reply({
                content: \`✅ Successfully banned \${userToBan.tag} for: \${reason}\`,
                ephemeral: true
            });
            
        } catch (error) {
            console.error('Error executing ban command:', error);
            await interaction.reply({
                content: '❌ Failed to ban user. Check permissions and try again.',
                ephemeral: true
            });
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),
    config: {
        category: 'moderation',
        usage: '/ban <user> [reason]',
        examples: ['/ban @User Spamming', '/ban @User'],
        permissions: [PermissionFlagsBits.BanMembers]
    },
    async execute(interaction) {
        try {
            const userToBan = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.member;
            
            if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return await interaction.reply({
                    content: '❌ You don\\'t have permission to ban members!',
                    ephemeral: true
                });
            }

            await interaction.guild?.members.ban(userToBan, { reason });
            
            await interaction.reply({
                content: \`✅ Successfully banned \${userToBan.tag} for: \${reason}\`,
                ephemeral: true
            });
            
        } catch (error) {
            console.error('Error executing ban command:', error);
            await interaction.reply({
                content: '❌ Failed to ban user. Check permissions and try again.',
                ephemeral: true
            });
        }
    }
};`;
  }
}
