// Main file generator for bot projects based on Chibi-bot architecture
import type { InitOptions } from "../initTemplate";

export function generateMainFile(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import BotClient from "./structures/Client";

const client = new BotClient();

// Start the bot
client.start().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\\n🛑 Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});`;
  } else {
    return `const BotClient = require("./structures/Client");

const client = new BotClient();

// Start the bot
client.start().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\\n🛑 Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});`;
  }
}
