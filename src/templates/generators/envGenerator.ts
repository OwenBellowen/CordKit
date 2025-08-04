// Environment file generators for CordKit projects

export function generateEnvFile(): string {
  return `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;
}

export function generateEnvExampleFile(): string {
  return `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;
}
