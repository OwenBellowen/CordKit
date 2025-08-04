// Music bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateMusicCommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction, GuildMember } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)),
    config: {
        category: 'music',
        usage: '/play <song>',
        examples: ['/play Never Gonna Give You Up', '/play https://youtube.com/watch?v=...'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            const member = interaction.member as GuildMember;
            const voiceChannel = member?.voice?.channel;
            
            if (!voiceChannel) {
                return await interaction.reply({
                    content: '❌ You need to be in a voice channel to play music!',
                    ephemeral: true
                });
            }

            const query = interaction.options.get('query')?.value as string;
            
            await interaction.reply({
                content: \`🎵 Searching for: \${query}...\`,
                ephemeral: true
            });
            
            // Music playback logic would go here
            // This is a basic template - full implementation requires audio libraries
            
        } catch (error) {
            console.error('Error executing play command:', error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ An error occurred while playing music.',
                    ephemeral: true
                });
            }
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)),
    config: {
        category: 'music',
        usage: '/play <song>',
        examples: ['/play Never Gonna Give You Up', '/play https://youtube.com/watch?v=...'],
        permissions: []
    },
    async execute(interaction) {
        try {
            const member = interaction.member;
            const voiceChannel = member?.voice?.channel;
            
            if (!voiceChannel) {
                return await interaction.reply({
                    content: '❌ You need to be in a voice channel to play music!',
                    ephemeral: true
                });
            }

            const query = interaction.options.get('query')?.value;
            
            await interaction.reply({
                content: \`🎵 Searching for: \${query}...\`,
                ephemeral: true
            });
            
            // Music playback logic would go here
            // This is a basic template - full implementation requires audio libraries
            
        } catch (error) {
            console.error('Error executing play command:', error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ An error occurred while playing music.',
                    ephemeral: true
                });
            }
        }
    }
};`;
  }
}
