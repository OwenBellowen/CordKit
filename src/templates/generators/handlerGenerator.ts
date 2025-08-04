// Handler generators for CordKit projects based on Chibi-bot architecture
import type { InitOptions } from "../initTemplate";

export function generateCommandHandler(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { readdirSync } from "fs";
import { join } from "path";
import { BaseCommand } from "../interfaces";
import BotClient from "./Client";
import { REST, Routes, RESTGetAPIApplicationCommandsResult } from "discord.js";

/**
 * Represents a command handler that loads and registers commands for a Discord bot.
 */
export default class CommandHandler {
    /**
     * Creates a new instance of the CommandHandler class.
     * @param client The Discord bot client.
     */
    constructor(private client: BotClient) {}

    /**
     * Loads all the commands from the command folders and adds them to the client's command collection.
     */
    public loadCommands(): void {
        const commandFolders = readdirSync(join(__dirname, "..", "commands"));
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(join(__dirname, "..", "commands", folder)).filter(file => file.endsWith(".ts"));
            for (const file of commandFiles) {
                const command = require(join(__dirname, "..", "commands", folder, file)).default as BaseCommand;
                this.client.commands.set(command.data.name, command);
            }
        }

        console.log("Commands loaded.");
    }

    /**
     * Registers the application commands with Discord.
     * @param type The type of registration: "global" or "guild"
     * @param guildId The ID of the guild to register commands for (if type is "guild")
     */
    public async registerCommands(type: "global" | "guild" = "global", guildId?: string): Promise<void> {
        if (!process.env.TOKEN) throw new Error("No token provided.");
        if (!process.env.CLIENT_ID) throw new Error("No client ID provided.");

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const clientId = process.env.CLIENT_ID;
        const commands = this.client.commands.map(command => command.data.toJSON());
        
        try {
            if (type === "global") {
                console.log("Started registering global application commands.");
                await rest.put(Routes.applicationCommands(clientId), { body: commands });
                console.log("Successfully registered global application commands.");
            } else if (type === "guild") {
                if (!guildId) throw new Error("No guild ID provided for guild command registration.");
                console.log(\`Started registering application commands for guild \${guildId}.\`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
                console.log(\`Successfully registered application commands for guild \${guildId}.\`);
            }
        } catch (error) {
            console.error(\`Failed to register application commands: \${error}\`);
            throw error;
        }
    }
}`;
  } else {
    return `const { readdirSync } = require("fs");
const { join } = require("path");
const { REST, Routes } = require("discord.js");

/**
 * Represents a command handler that loads and registers commands for a Discord bot.
 */
class CommandHandler {
    /**
     * Creates a new instance of the CommandHandler class.
     * @param {import("./Client")} client The Discord bot client.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Loads all the commands from the command folders and adds them to the client's command collection.
     */
    loadCommands() {
        const commandFolders = readdirSync(join(__dirname, "..", "commands"));
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(join(__dirname, "..", "commands", folder)).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(join(__dirname, "..", "commands", folder, file));
                this.client.commands.set(command.data.name, command);
            }
        }

        console.log("Commands loaded.");
    }

    /**
     * Registers the application commands with Discord.
     * @param {"global" | "guild"} type The type of registration: "global" or "guild"
     * @param {string} guildId The ID of the guild to register commands for (if type is "guild")
     */
    async registerCommands(type = "global", guildId) {
        if (!process.env.TOKEN) throw new Error("No token provided.");
        if (!process.env.CLIENT_ID) throw new Error("No client ID provided.");

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const clientId = process.env.CLIENT_ID;
        const commands = this.client.commands.map(command => command.data.toJSON());
        
        try {
            if (type === "global") {
                console.log("Started registering global application commands.");
                await rest.put(Routes.applicationCommands(clientId), { body: commands });
                console.log("Successfully registered global application commands.");
            } else if (type === "guild") {
                if (!guildId) throw new Error("No guild ID provided for guild command registration.");
                console.log(\`Started registering application commands for guild \${guildId}.\`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
                console.log(\`Successfully registered application commands for guild \${guildId}.\`);
            }
        } catch (error) {
            console.error(\`Failed to register application commands: \${error}\`);
            throw error;
        }
    }
}

module.exports = CommandHandler;`;
  }
}

export function generateEventHandler(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { readdirSync } from "fs";
import { join } from "path";
import { BaseEvent } from "../interfaces";
import BotClient from "./Client";

/**
 * Represents an event handler that loads and handles events for a bot client.
 */
export default class EventHandler {
    constructor(private client: BotClient) {}

    /**
     * Loads events from event folders and sets up event listeners for each event.
     */
    public loadEvents(): void {
        const eventFolders = readdirSync(join(__dirname, "..", "events"));
        for (const folder of eventFolders) {
            const eventFiles = readdirSync(join(__dirname, "..", "events", folder)).filter(file => file.endsWith(".ts"));
            for (const file of eventFiles) {
                const event = require(join(__dirname, "..", "events", folder, file)).default as BaseEvent;
                this.client.events.set(event.name, event);

                if (event.once) {
                    this.client.once(event.name, (...args) => event.execute(this.client, ...args));
                } else {
                    this.client.on(event.name, (...args) => event.execute(this.client, ...args));
                }
            }
        }

        console.log("Events loaded.");
    }
}`;
  } else {
    return `const { readdirSync } = require("fs");
const { join } = require("path");

/**
 * Represents an event handler that loads and handles events for a bot client.
 */
class EventHandler {
    /**
     * @param {import("./Client")} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Loads events from event folders and sets up event listeners for each event.
     */
    loadEvents() {
        const eventFolders = readdirSync(join(__dirname, "..", "events"));
        for (const folder of eventFolders) {
            const eventFiles = readdirSync(join(__dirname, "..", "events", folder)).filter(file => file.endsWith(".js"));
            for (const file of eventFiles) {
                const event = require(join(__dirname, "..", "events", folder, file));
                this.client.events.set(event.name, event);

                if (event.once) {
                    this.client.once(event.name, (...args) => event.execute(this.client, ...args));
                } else {
                    this.client.on(event.name, (...args) => event.execute(this.client, ...args));
                }
            }
        }

        console.log("Events loaded.");
    }
}

module.exports = EventHandler;`;
  }
}

export function generateInteractionHandler(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { readdirSync, statSync } from "fs";
import { join } from "path";
import { BaseSelectMenu, BaseModal, BaseButton } from "../interfaces";
import BotClient from "./Client";

/**
 * Represents an InteractionHandler class.
 */
export default class InteractionHandler {
    private readonly loadedComponents = {
        selectMenus: 0,
        modals: 0,
        buttons: 0
    };

    /**
     * Creates an instance of InteractionHandler.
     * @param {BotClient} client - The BotClient instance.
     */
    public constructor(private client: BotClient) { }
    
    private loadFilesFromDirectory(directory: string, callback: (file: string) => void): void {
        try {
            if (!statSync(directory).isDirectory()) {
                console.warn(\`Directory \${directory} does not exist\`);
                return;
            }

            const files = readdirSync(directory, { withFileTypes: true });

            for (const file of files) {
                const fullPath = join(directory, file.name);
                if (file.isDirectory()) {
                    this.loadFilesFromDirectory(fullPath, callback);
                } else if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".js"))) {
                    callback(fullPath);
                }
            }
        } catch (error) {
            console.error(\`Error loading files from directory \${directory}: \${error}\`);
        }
    }

    private async loadComponent<T extends { customId: string }>(
        filePath: string,
        collection: Map<string, T>,
        componentType: string
    ): Promise<boolean> {
        try {
            delete require.cache[require.resolve(filePath)];
            const component = require(filePath).default as T;
            
            if (!component || !component.customId) {
                console.warn(\`Invalid \${componentType} at \${filePath}: missing customId\`);
                return false;
            }
            
            collection.set(component.customId, component);
            return true;
        } catch (error) {
            console.error(\`Failed to load \${componentType} from \${filePath}: \${error}\`);
            return false;
        }
    }

    /**
     * Loads buttons with enhanced error handling.
     */
    public async loadButtons(): Promise<void> {
        const buttonsPath = join(__dirname, "..", "interactions", "buttons");
        let loaded = 0;

        this.loadFilesFromDirectory(buttonsPath, async (file) => {
            if (await this.loadComponent(file, this.client.buttons, "button")) {
                loaded++;
            }
        });

        this.loadedComponents.buttons = loaded;
        console.log(\`Loaded \${loaded} buttons.\`);
    }

    /**
     * Loads modals with enhanced error handling.
     */
    public async loadModals(): Promise<void> {
        const modalsPath = join(__dirname, "..", "interactions", "modals");
        let loaded = 0;

        this.loadFilesFromDirectory(modalsPath, async (file) => {
            if (await this.loadComponent(file, this.client.modals, "modal")) {
                loaded++;
            }
        });

        this.loadedComponents.modals = loaded;
        console.log(\`Loaded \${loaded} modals.\`);
    }

    /**
     * Loads select menus with enhanced error handling.
     */
    public async loadSelectMenus(): Promise<void> {
        const selectMenusPath = join(__dirname, "..", "interactions", "selectMenus");
        let loaded = 0;

        this.loadFilesFromDirectory(selectMenusPath, async (file) => {
            if (await this.loadComponent(file, this.client.selectMenus, "select menu")) {
                loaded++;
            }
        });

        this.loadedComponents.selectMenus = loaded;
        console.log(\`Loaded \${loaded} select menus.\`);
    }

    /**
     * Gets statistics about loaded components
     */
    public getStats(): typeof this.loadedComponents {
        return { ...this.loadedComponents };
    }
}`;
  } else {
    return `const { readdirSync, statSync } = require("fs");
const { join } = require("path");

/**
 * Represents an InteractionHandler class.
 */
class InteractionHandler {
    /**
     * Creates an instance of InteractionHandler.
     * @param {import("./Client")} client - The client instance.
     */
    constructor(client) {
        this.client = client;
        this.loadedComponents = {
            selectMenus: 0,
            modals: 0,
            buttons: 0
        };
    }
    
    loadFilesFromDirectory(directory, callback) {
        try {
            if (!statSync(directory).isDirectory()) {
                console.warn(\`Directory \${directory} does not exist\`);
                return;
            }

            const files = readdirSync(directory, { withFileTypes: true });

            for (const file of files) {
                const fullPath = join(directory, file.name);
                if (file.isDirectory()) {
                    this.loadFilesFromDirectory(fullPath, callback);
                } else if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".js"))) {
                    callback(fullPath);
                }
            }
        } catch (error) {
            console.error(\`Error loading files from directory \${directory}: \${error}\`);
        }
    }

    async loadComponent(filePath, collection, componentType) {
        try {
            delete require.cache[require.resolve(filePath)];
            const component = require(filePath);
            
            if (!component || !component.customId) {
                console.warn(\`Invalid \${componentType} at \${filePath}: missing customId\`);
                return false;
            }
            
            collection.set(component.customId, component);
            return true;
        } catch (error) {
            console.error(\`Failed to load \${componentType} from \${filePath}: \${error}\`);
            return false;
        }
    }

    /**
     * Loads buttons with enhanced error handling.
     */
    async loadButtons() {
        const buttonsPath = join(__dirname, "..", "interactions", "buttons");
        let loaded = 0;

        this.loadFilesFromDirectory(buttonsPath, async (file) => {
            if (await this.loadComponent(file, this.client.buttons, "button")) {
                loaded++;
            }
        });

        this.loadedComponents.buttons = loaded;
        console.log(\`Loaded \${loaded} buttons.\`);
    }

    /**
     * Loads modals with enhanced error handling.
     */
    async loadModals() {
        const modalsPath = join(__dirname, "..", "interactions", "modals");
        let loaded = 0;

        this.loadFilesFromDirectory(modalsPath, async (file) => {
            if (await this.loadComponent(file, this.client.modals, "modal")) {
                loaded++;
            }
        });

        this.loadedComponents.modals = loaded;
        console.log(\`Loaded \${loaded} modals.\`);
    }

    /**
     * Loads select menus with enhanced error handling.
     */
    async loadSelectMenus() {
        const selectMenusPath = join(__dirname, "..", "interactions", "selectMenus");
        let loaded = 0;

        this.loadFilesFromDirectory(selectMenusPath, async (file) => {
            if (await this.loadComponent(file, this.client.selectMenus, "select menu")) {
                loaded++;
            }
        });

        this.loadedComponents.selectMenus = loaded;
        console.log(\`Loaded \${loaded} select menus.\`);
    }

    /**
     * Gets statistics about loaded components
     */
    getStats() {
        return { ...this.loadedComponents };
    }
}

module.exports = InteractionHandler;`;
  }
}
