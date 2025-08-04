// Documentation generators for CordKit projects
import type { InitOptions } from "../initTemplate";

function getDatabaseName(databaseType: string): string {
  switch (databaseType) {
    case "postgres":
      return "PostgreSQL";
    case "mysql":
      return "MySQL";
    case "mongodb":
      return "MongoDB";
    case "sqlite":
    default:
      return "SQLite";
  }
}

function generateDatabaseSetupInstructions(databaseType: string): string {
  switch (databaseType) {
    case "postgres":
      return `
2. **Set up PostgreSQL:**
   - Install PostgreSQL on your system
   - Create a new database: \`createdb botdb\`
   - Update the \`DATABASE_URL\` in your \`.env\` file
   \`\`\`
   DATABASE_URL=postgresql://username:password@localhost:5432/botdb
   \`\`\`
`;
    case "mysql":
      return `
2. **Set up MySQL:**
   - Install MySQL on your system
   - Create a new database: \`CREATE DATABASE botdb;\`
   - Update the database credentials in your \`.env\` file
   \`\`\`
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=botdb
   \`\`\`
`;
    case "mongodb":
      return `
2. **Set up MongoDB:**
   - Install MongoDB on your system or use MongoDB Atlas
   - Update the \`MONGODB_URI\` in your \`.env\` file
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/botdb
   \`\`\`
`;
    case "sqlite":
    default:
      return `
2. **Database setup:**
   - SQLite database will be created automatically in the \`data/\` folder
   - No additional setup required!
`;
  }
}

export function generateReadme(
  projectName: string,
  options: InitOptions,
): string {
  const ext = options.template === "typescript" ? "ts" : "js";

  return `# ${projectName}

A Discord.js bot generated with CordKit.

## Features

- 🤖 Discord.js v14
- ⚡ Bun runtime
- ${options.template === "typescript" ? "📘 TypeScript support" : "📙 JavaScript"}
${options.dotenv ? "- 🔐 Environment variables with dotenv" : ""}
${options.commands ? "- 📁 Slash command handler" : ""}
${options.database ? `- 🗄️ ${getDatabaseName(options.databaseType)} database integration` : ""}
${options.logging ? "- 📝 Advanced logging with Winston" : ""}
${options.webhooks ? "- 🔗 Webhook server support" : ""}
${options.docker ? "- 🐳 Docker configuration included" : ""}

## Setup

1. **Install dependencies:**
   \`\`\`bash
   bun install
   \`\`\`

${options.database ? generateDatabaseSetupInstructions(options.databaseType) : ""}

2. **Configure your bot:**
   ${
     options.dotenv
       ? `
   - Copy \`.env.example\` to \`.env\`
   - Add your Discord bot token to \`.env\`
   ${options.database ? `   - Configure your database connection in \`.env\`` : ""}
   `
       : `
   - Set your \`DISCORD_TOKEN\` environment variable
   ${options.database ? `   - Set your database environment variables` : ""}
   `
   }

3. **Run the bot:**
   \`\`\`bash
   bun run start
   \`\`\`

   For development (with auto-restart):
   \`\`\`bash
   bun run dev
   \`\`\`

## Project Structure

\`\`\`
${projectName}/
├── index.${ext}           # Main bot file
${options.commands ? `├── commands/          # Slash commands\n│   └── ping.${ext}       # Example ping command` : ""}
├── package.json       # Dependencies and scripts
${options.dotenv ? `├── .env               # Environment variables (create this)\n├── .env.example       # Environment variables template` : ""}
${options.template === "typescript" ? `├── tsconfig.json      # TypeScript configuration` : ""}
└── README.md          # This file
\`\`\`

## Commands

${
  options.commands
    ? `### Slash Commands
- \`/ping\` - Test bot responsiveness

`
    : ""
}## Development

This bot is built with:
- [Discord.js](https://discord.js.org/) - Discord API library
- [Bun](https://bun.sh/) - Fast JavaScript runtime
${options.template === "typescript" ? "- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript" : ""}
${options.dotenv ? "- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management" : ""}

## Getting Your Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section
4. Create a bot and copy the token
5. ${options.dotenv ? "Add the token to your `.env` file" : "Set the `DISCORD_TOKEN` environment variable"}

## Adding the Bot to Your Server

1. In the Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select "bot" and "applications.commands" scopes
3. Select the permissions your bot needs
4. Use the generated URL to invite your bot

## License

MIT
`;
}
