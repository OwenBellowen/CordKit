// Slash command generators
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import type { GenerateOptions } from "./utils";

export async function generateSlashCommand(
  options: GenerateOptions,
  projectPath: string,
  ext: string,
) {
  const commandsDir = join(projectPath, "slash-commands");
  const categoryDir = options.category
    ? join(commandsDir, options.category)
    : commandsDir;

  // Create directories if they don't exist
  if (!existsSync(categoryDir)) {
    mkdirSync(categoryDir, { recursive: true });
  }

  const fileName = `${options.name}.${ext}`;
  const filePath = join(categoryDir, fileName);

  if (existsSync(filePath)) {
    console.log(
      chalk.yellow(`⚠️  File ${fileName} already exists. Skipping...`),
    );
    return;
  }

  const content =
    ext === "ts"
      ? generateSlashCommandTS(options)
      : generateSlashCommandJS(options);

  writeFileSync(filePath, content);

  const relativePath = `slash-commands/${options.category ? `${options.category}/` : ""}${fileName}`;
  console.log(chalk.green(`✅ Generated slash command: ${relativePath}`));
}

export function generateSlashCommandTS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions?.length
    ? `
    // Check permissions
    if (!interaction.memberPermissions?.has([${options.permissions.map((p) => `'${p}'`).join(", ")}])) {
      return interaction.reply({ content: "❌ You don't have permission to use this command.", ephemeral: true });
    }
`
    : "";

  return `import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('${options.name}')
  .setDescription('${options.description}');

export const category = '${options.category}';

export async function execute(interaction: ChatInputCommandInteraction) {${permissionsCheck}
  // ${options.description}
  try {
    await interaction.reply('Hello! This is the ${options.name} slash command.');
  } catch (error) {
    console.error('Error executing ${options.name} command:', error);
    await interaction.reply({ 
      content: '❌ An error occurred while executing this command.', 
      ephemeral: true 
    });
  }
}`;
}

export function generateSlashCommandJS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions?.length
    ? `
    // Check permissions
    if (!interaction.memberPermissions?.has([${options.permissions.map((p) => `'${p}'`).join(", ")}])) {
      return interaction.reply({ content: "❌ You don't have permission to use this command.", ephemeral: true });
    }
`
    : "";

  return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${options.name}')
    .setDescription('${options.description}'),

  category: '${options.category}',

  async execute(interaction) {${permissionsCheck}
    // ${options.description}
    try {
      await interaction.reply('Hello! This is the ${options.name} slash command.');
    } catch (error) {
      console.error('Error executing ${options.name} command:', error);
      await interaction.reply({ 
        content: '❌ An error occurred while executing this command.', 
        ephemeral: true 
      });
    }
  },
};`;
}
