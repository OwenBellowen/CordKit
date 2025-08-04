// Validation utilities for generate command
import { existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";

export function validateProjectPath(projectPath: string): boolean {
  if (!existsSync(projectPath)) {
    console.error(chalk.red("❌ Project path does not exist."));
    console.log(
      chalk.yellow(
        "💡 Please run this command in a Discord bot project directory.",
      ),
    );
    return false;
  }

  const packageJsonPath = join(projectPath, "package.json");
  if (!existsSync(packageJsonPath)) {
    console.error(
      chalk.red("❌ No package.json found in the current directory."),
    );
    console.log(
      chalk.yellow(
        "💡 Please run this command in a Discord bot project directory.",
      ),
    );
    return false;
  }

  return true;
}

export function validateCommandName(name: string): boolean {
  if (!name || name.trim() === "") {
    console.error(chalk.red("❌ Command name cannot be empty."));
    return false;
  }

  if (!/^[a-z0-9_-]+$/i.test(name)) {
    console.error(
      chalk.red(
        "❌ Command name can only contain letters, numbers, underscores, and hyphens.",
      ),
    );
    return false;
  }

  if (name.length > 32) {
    console.error(
      chalk.red("❌ Command name cannot be longer than 32 characters."),
    );
    return false;
  }

  return true;
}

export function validateEventName(name: string): boolean {
  const validEvents = [
    "ready",
    "messageCreate",
    "messageDelete",
    "messageUpdate",
    "guildMemberAdd",
    "guildMemberRemove",
    "interactionCreate",
    "voiceStateUpdate",
    "guildCreate",
    "guildDelete",
    "error",
    "warn",
    "debug",
  ];

  if (!validEvents.includes(name)) {
    console.warn(
      chalk.yellow(`⚠️  Event '${name}' is not a common Discord.js event.`),
    );
    console.log(chalk.gray(`Valid events: ${validEvents.join(", ")}`));
  }

  return true;
}

export function validateDescription(description: string): boolean {
  if (!description || description.trim() === "") {
    console.error(chalk.red("❌ Description cannot be empty."));
    return false;
  }

  if (description.length > 100) {
    console.error(
      chalk.red("❌ Description cannot be longer than 100 characters."),
    );
    return false;
  }

  return true;
}

export function validateCategory(category: string): boolean {
  if (category && !/^[a-z0-9_-]+$/i.test(category)) {
    console.error(
      chalk.red(
        "❌ Category name can only contain letters, numbers, underscores, and hyphens.",
      ),
    );
    return false;
  }

  return true;
}

export function validatePermissions(permissions: string[]): boolean {
  const validPermissions = [
    "Administrator",
    "ManageGuild",
    "ManageRoles",
    "ManageChannels",
    "KickMembers",
    "BanMembers",
    "ManageMessages",
    "SendMessages",
    "ViewChannel",
    "Connect",
    "Speak",
    "MuteMembers",
    "DeafenMembers",
    "MoveMembers",
    "UseVAD",
    "ChangeNickname",
    "ManageNicknames",
    "UseSlashCommands",
    "UseExternalEmojis",
    "AddReactions",
    "AttachFiles",
    "EmbedLinks",
    "ReadMessageHistory",
    "MentionEveryone",
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      console.error(chalk.red(`❌ Invalid permission: ${permission}`));
      console.log(
        chalk.gray(`Valid permissions: ${validPermissions.join(", ")}`),
      );
      return false;
    }
  }

  return true;
}
