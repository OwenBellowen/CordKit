// Client structure generator for CordKit projects based on Chibi-bot architecture
import type { InitOptions } from "../initTemplate";

export function generateClient(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { BaseCommand, BaseEvent, BaseButton, BaseModal, BaseSelectMenu } from '../interfaces';
import CommandHandler from './CommandHandler';
import EventHandler from './EventHandler';
import InteractionHandler from './InteractionHandler';
import "dotenv/config";

export default class BotClient extends Client {
    public commands: Collection<string, BaseCommand> = new Collection();
    public events: Collection<string, BaseEvent> = new Collection();
    public buttons: Collection<string, BaseButton> = new Collection();
    public modals: Collection<string, BaseModal> = new Collection();
    public selectMenus: Collection<string, BaseSelectMenu> = new Collection();

    public config: { owners: string[] } = { owners: process.env.OWNERS?.split(',') || [] };

    private commandHandler: CommandHandler;
    private eventHandler: EventHandler;
    private interactionHandler: InteractionHandler;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ],
            allowedMentions: { parse: ["users", "roles"], repliedUser: true },
            shards: "auto",
            presence: {
                status: "online",
                activities: [
                    {
                        name: "your commands!",
                        type: 0 // Playing
                    }
                ]
            }
        });

        this.commandHandler = new CommandHandler(this);
        this.eventHandler = new EventHandler(this);
        this.interactionHandler = new InteractionHandler(this);

        this.setupErrorHandlers();
    }

    private setupErrorHandlers(): void {
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', async (error) => {
            console.error('Uncaught Exception:', error);
            process.exit(1);
        });

        this.on('error', async (error) => {
            console.error('Discord Client Error:', error);
        });
    }

    public async start(): Promise<void> {
        try {
            console.log("🚀 Starting bot...");
            
            // Load components
            await this.loadComponents();
            
            // Register commands
            await this.registerCommands();
            
            // Login to Discord
            await this.login(process.env.TOKEN);
            
            console.log("✅ Bot started successfully!");
        } catch (error) {
            console.error("❌ Failed to start bot:", error);
            process.exit(1);
        }
    }

    private async registerCommands(): Promise<void> {
        try {
            // Check configuration to determine how to register commands
            const useGuildCommands = process.env.USE_GUILD_COMMANDS === 'true';
            const targetGuildId = process.env.GUILD_ID;
            
            if (useGuildCommands && targetGuildId) {
                console.log(\`Using guild-specific commands for guild \${targetGuildId}\`);
                await this.commandHandler.registerCommands('guild', targetGuildId);
            } else {
                console.log("Registering commands globally");
                await this.commandHandler.registerCommands('global');
            }
        } catch (error) {
            console.error(\`Error registering commands: \${error}\`);
            // Non-fatal error, continue bot startup
        }
    }

    private async loadComponents(): Promise<void> {
        try {
            // Load commands
            this.commandHandler.loadCommands();
            
            // Load events
            this.eventHandler.loadEvents();
            
            // Load interactions
            await this.interactionHandler.loadButtons();
            await this.interactionHandler.loadModals();
            await this.interactionHandler.loadSelectMenus();
            
            console.log("All components loaded successfully");
        } catch (error) {
            throw new Error(\`Failed to load components: \${error}\`);
        }
    }

    public isClientReady(): boolean {
        return this.isReady();
    }
}`;
  } else {
    return `const { Client, Collection, GatewayIntentBits } = require('discord.js');
const CommandHandler = require('./CommandHandler');
const EventHandler = require('./EventHandler');
const InteractionHandler = require('./InteractionHandler');
require("dotenv/config");

class BotClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ],
            allowedMentions: { parse: ["users", "roles"], repliedUser: true },
            shards: "auto",
            presence: {
                status: "online",
                activities: [
                    {
                        name: "your commands!",
                        type: 0 // Playing
                    }
                ]
            }
        });

        this.commands = new Collection();
        this.events = new Collection();
        this.buttons = new Collection();
        this.modals = new Collection();
        this.selectMenus = new Collection();

        this.config = { owners: process.env.OWNERS?.split(',') || [] };

        this.commandHandler = new CommandHandler(this);
        this.eventHandler = new EventHandler(this);
        this.interactionHandler = new InteractionHandler(this);

        this.setupErrorHandlers();
    }

    setupErrorHandlers() {
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', async (error) => {
            console.error('Uncaught Exception:', error);
            process.exit(1);
        });

        this.on('error', async (error) => {
            console.error('Discord Client Error:', error);
        });
    }

    async start() {
        try {
            console.log("🚀 Starting bot...");
            
            // Load components
            await this.loadComponents();
            
            // Register commands
            await this.registerCommands();
            
            // Login to Discord
            await this.login(process.env.TOKEN);
            
            console.log("✅ Bot started successfully!");
        } catch (error) {
            console.error("❌ Failed to start bot:", error);
            process.exit(1);
        }
    }

    async registerCommands() {
        try {
            // Check configuration to determine how to register commands
            const useGuildCommands = process.env.USE_GUILD_COMMANDS === 'true';
            const targetGuildId = process.env.GUILD_ID;
            
            if (useGuildCommands && targetGuildId) {
                console.log(\`Using guild-specific commands for guild \${targetGuildId}\`);
                await this.commandHandler.registerCommands('guild', targetGuildId);
            } else {
                console.log("Registering commands globally");
                await this.commandHandler.registerCommands('global');
            }
        } catch (error) {
            console.error(\`Error registering commands: \${error}\`);
            // Non-fatal error, continue bot startup
        }
    }

    async loadComponents() {
        try {
            // Load commands
            this.commandHandler.loadCommands();
            
            // Load events
            this.eventHandler.loadEvents();
            
            // Load interactions
            await this.interactionHandler.loadButtons();
            await this.interactionHandler.loadModals();
            await this.interactionHandler.loadSelectMenus();
            
            console.log("All components loaded successfully");
        } catch (error) {
            throw new Error(\`Failed to load components: \${error}\`);
        }
    }

    isClientReady() {
        return this.isReady();
    }
}

module.exports = BotClient;`;
  }
}
