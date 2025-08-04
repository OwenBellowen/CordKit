// AI bot command generators
import type { InitOptions } from "../../initTemplate";

export function generateAICommand(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseCommand } from "../../interfaces";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the AI a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question for the AI')
                .setRequired(true)),
    config: {
        category: 'ai',
        usage: '/ask <question>',
        examples: ['/ask What is the meaning of life?', '/ask How do I code a Discord bot?'],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        try {
            const question = interaction.options.getString('question', true);
            
            await interaction.deferReply();
            
            // This would integrate with OpenAI or another AI service
            // For now, we'll provide a placeholder response
            const responses = [
                "That's an interesting question! 🤔",
                "Let me think about that... 💭",
                "According to my knowledge... 📚",
                "That's a great question! 🌟",
                "I'd say... 🎯"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            await interaction.editReply({
                content: \`🤖 **Question:** \${question}\\n\\n**AI Response:** \${randomResponse}\\n\\n*Note: This is a placeholder. Connect to OpenAI API for real AI responses.*\`
            });
            
        } catch (error) {
            console.error('Error executing ask command:', error);
            await interaction.editReply({
                content: '❌ An error occurred while processing your question.'
            });
        }
    }
};`;
  } else {
    return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the AI a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question for the AI')
                .setRequired(true)),
    config: {
        category: 'ai',
        usage: '/ask <question>',
        examples: ['/ask What is the meaning of life?', '/ask How do I code a Discord bot?'],
        permissions: []
    },
    async execute(interaction) {
        try {
            const question = interaction.options.getString('question', true);
            
            await interaction.deferReply();
            
            // This would integrate with OpenAI or another AI service
            // For now, we'll provide a placeholder response
            const responses = [
                "That's an interesting question! 🤔",
                "Let me think about that... 💭",
                "According to my knowledge... 📚",
                "That's a great question! 🌟",
                "I'd say... 🎯"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            await interaction.editReply({
                content: \`🤖 **Question:** \${question}\\n\\n**AI Response:** \${randomResponse}\\n\\n*Note: This is a placeholder. Connect to OpenAI API for real AI responses.*\`
            });
            
        } catch (error) {
            console.error('Error executing ask command:', error);
            await interaction.editReply({
                content: '❌ An error occurred while processing your question.'
            });
        }
    }
};`;
  }
}
