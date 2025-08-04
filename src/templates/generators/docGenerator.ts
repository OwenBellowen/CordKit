// Documentation generators for CordKit projects
import type { InitOptions } from "../initTemplate";

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
${options.commands ? "- 📁 Message command handler" : ""}
${options.slash ? "- 🔗 Slash command support" : ""}

## Setup

1. **Install dependencies:**
   \`\`\`bash
   bun install
   \`\`\`

2. **Configure your bot:**
   ${
     options.dotenv
       ? `
   - Copy \`.env.example\` to \`.env\`
   - Add your Discord bot token to \`.env\`
   `
       : `
   - Set your \`DISCORD_TOKEN\` environment variable
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
${options.commands ? `├── commands/          # Message commands\n│   └── ping.${ext}       # Example ping command` : ""}
${options.slash ? `├── slash-commands/     # Slash commands\n│   └── ping.${ext}       # Example slash ping command` : ""}
├── package.json       # Dependencies and scripts
${options.dotenv ? `├── .env               # Environment variables (create this)\n├── .env.example       # Environment variables template` : ""}
${options.template === "typescript" ? `├── tsconfig.json      # TypeScript configuration` : ""}
└── README.md          # This file
\`\`\`

## Commands

${
  options.commands
    ? `### Message Commands
- \`!ping\` - Test bot responsiveness

`
    : ""
}${
    options.slash
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
