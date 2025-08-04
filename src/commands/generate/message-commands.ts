// Message command generators
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import type { GenerateOptions } from "./utils";

export async function generateMessageCommand(
  options: GenerateOptions,
  projectPath: string,
  ext: string,
) {
  const commandsDir = join(projectPath, "commands");
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
      ? generateMessageCommandTS(options)
      : generateMessageCommandJS(options);

  writeFileSync(filePath, content);

  const relativePath = `commands/${options.category ? `${options.category}/` : ""}${fileName}`;
  console.log(chalk.green(`✅ Generated message command: ${relativePath}`));
}

export function generateMessageCommandTS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions?.length
    ? `
  // Check permissions
  if (!message.member?.permissions.has([${options.permissions.map((p) => `'${p}'`).join(", ")}])) {
    return message.reply("❌ You don't have permission to use this command.");
  }
`
    : "";

  return `import { Message } from 'discord.js';

export const name = '${options.name}';
export const description = '${options.description}';
export const category = '${options.category}';

export async function execute(message: Message, args: string[]) {${permissionsCheck}
  // ${options.description}
  try {
    await message.reply('Hello! This is the ${options.name} command.');
  } catch (error) {
    console.error('Error executing ${options.name} command:', error);
    await message.reply('❌ An error occurred while executing this command.');
  }
}`;
}

export function generateMessageCommandJS(options: GenerateOptions): string {
  const permissionsCheck = options.permissions?.length
    ? `
  // Check permissions
  if (!message.member?.permissions.has([${options.permissions.map((p) => `'${p}'`).join(", ")}])) {
    return message.reply("❌ You don't have permission to use this command.");
  }
`
    : "";

  return `module.exports = {
  name: '${options.name}',
  description: '${options.description}',
  category: '${options.category}',

  async execute(message, args) {${permissionsCheck}
    // ${options.description}
    try {
      await message.reply('Hello! This is the ${options.name} command.');
    } catch (error) {
      console.error('Error executing ${options.name} command:', error);
      await message.reply('❌ An error occurred while executing this command.');
    }
  },
};`;
}
