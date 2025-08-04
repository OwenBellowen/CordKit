// Event handler generators
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import type { GenerateOptions } from "./utils";

export async function generateEvent(
  options: GenerateOptions,
  projectPath: string,
  ext: string,
) {
  const eventsDir = join(projectPath, "events");

  // Create events directory if it doesn't exist
  if (!existsSync(eventsDir)) {
    mkdirSync(eventsDir, { recursive: true });
  }

  const fileName = `${options.name}.${ext}`;
  const filePath = join(eventsDir, fileName);

  if (existsSync(filePath)) {
    console.log(
      chalk.yellow(`⚠️  File ${fileName} already exists. Skipping...`),
    );
    return;
  }

  const content =
    ext === "ts" ? generateEventTS(options) : generateEventJS(options);

  writeFileSync(filePath, content);

  const relativePath = `events/${fileName}`;
  console.log(chalk.green(`✅ Generated event: ${relativePath}`));
}

export function generateEventTS(options: GenerateOptions): string {
  return `import { Events } from 'discord.js';

export const name = Events.${getEventName(options.name)};
export const once = ${options.name.includes("ready") ? "true" : "false"};

export async function execute(...args: any[]) {
  // ${options.description}
  try {
    console.log('Event ${options.name} triggered');
    
    // Your event logic here
    
  } catch (error) {
    console.error('Error in ${options.name} event:', error);
  }
}`;
}

export function generateEventJS(options: GenerateOptions): string {
  return `const { Events } = require('discord.js');

module.exports = {
  name: Events.${getEventName(options.name)},
  once: ${options.name.includes("ready") ? "true" : "false"},

  async execute(...args) {
    // ${options.description}
    try {
      console.log('Event ${options.name} triggered');
      
      // Your event logic here
      
    } catch (error) {
      console.error('Error in ${options.name} event:', error);
    }
  },
};`;
}

function getEventName(eventName: string): string {
  // Map common event names to Discord.js Events enum
  const eventMap: Record<string, string> = {
    ready: "ClientReady",
    messageCreate: "MessageCreate",
    messageDelete: "MessageDelete",
    messageUpdate: "MessageUpdate",
    guildMemberAdd: "GuildMemberAdd",
    guildMemberRemove: "GuildMemberRemove",
    interactionCreate: "InteractionCreate",
    voiceStateUpdate: "VoiceStateUpdate",
    guildCreate: "GuildCreate",
    guildDelete: "GuildDelete",
    error: "Error",
    warn: "Warn",
    debug: "Debug",
  };

  return eventMap[eventName] || "ClientReady";
}
