// Interface generators for CordKit projects based on Chibi-bot architecture
import type { InitOptions } from "../initTemplate";

export function generateInterfaces(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import {
    CommandInteraction,
    Awaitable,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    ClientEvents,
    PermissionResolvable,
    AutocompleteInteraction,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ButtonInteraction
} from "discord.js";
import BotClient from "../structures/Client";

// Category types for commands
type CategoryType =
    "admin"             |
    "moderation"        |
    "utility"           |
    "dev"               |
    "info"              |
    "fun"               |
    "general"           ;

// Command configuration interface
interface CommandConfig {
    // Category of the command
    category: CategoryType;
    // Usage of the command
    usage: string;
    // Examples of how to use the command
    examples: string[];
    // Permissions required to use the command
    permissions: PermissionResolvable[];
}

// Base command interface
export interface BaseCommand {
    // Slash command data
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandGroupBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandOptionsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">;
    // Command configuration
    config: CommandConfig;
    // Command execution function
    execute: (interaction: CommandInteraction) => Awaitable<unknown>;
    // Autocomplete function (optional)
    autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<unknown>;
}

// Base event interface
export interface BaseEvent {
    // Event name
    name: keyof ClientEvents;
    // Whether the event should be executed only once
    once?: boolean;
    // Event execution function
    execute: (client: BotClient, ...args: ClientEvents[keyof ClientEvents]) => Awaitable<unknown>;
}

// Base select menu interface
export interface BaseSelectMenu {
    // Custom ID of the select menu
    customId: string;
    // Select menu execution function
    execute: (interaction: StringSelectMenuInteraction) => Awaitable<unknown>;
}

// Base modal interface
export interface BaseModal {
    // Custom ID of the modal
    customId: string;
    // Modal execution function
    execute: (interaction: ModalSubmitInteraction) => Awaitable<unknown>;
}

// Base button interface
export interface BaseButton {
    // Custom ID of the button
    customId: string;
    // Button execution function
    execute: (interaction: ButtonInteraction) => Awaitable<unknown>;
}`;
  } else {
    return `// Base interfaces for JavaScript projects
// Note: These are for documentation purposes only since JavaScript doesn't have native interfaces

/*
BaseCommand structure:
{
    data: SlashCommandBuilder,
    config: {
        category: string,
        usage: string,
        examples: string[],
        permissions: string[]
    },
    execute: async function(interaction) {},
    autocomplete?: async function(interaction) {} // optional
}

BaseEvent structure:
{
    name: string, // Event name like 'ready', 'messageCreate', etc.
    once: boolean, // Whether to execute only once
    execute: async function(client, ...args) {}
}

BaseButton structure:
{
    customId: string,
    execute: async function(interaction) {}
}

BaseModal structure:
{
    customId: string,
    execute: async function(interaction) {}
}

BaseSelectMenu structure:
{
    customId: string,
    execute: async function(interaction) {}
}
*/

module.exports = {};`;
  }
}
