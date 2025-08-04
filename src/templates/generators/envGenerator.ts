// Environment file generators for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generateEnvFile(options?: InitOptions): string {
  let envContent = `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;

  if (options?.database) {
    switch (options.databaseType) {
      case "postgres":
        envContent += `
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/botdb
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=botdb
`;
        break;
      case "mysql":
        envContent += `
# MySQL Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/botdb
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=botdb
`;
        break;
      case "mongodb":
        envContent += `
# MongoDB Database Configuration
MONGODB_URI=mongodb://localhost:27017/botdb
`;
        break;
      case "redis":
        envContent += `
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
`;
        break;
      case "sqlite":
        envContent += `
# SQLite Configuration
DB_PATH=./data/bot.db
`;
        break;
      case "prisma":
        envContent += `
# Prisma Database Configuration
# For PostgreSQL:
DATABASE_URL=postgresql://username:password@localhost:5432/botdb
# For MySQL:
# DATABASE_URL=mysql://root:password@localhost:3306/botdb
# For SQLite:
# DATABASE_URL=file:./data/bot.db
`;
        break;
      case "mongoose":
        envContent += `
# MongoDB Database Configuration (for Mongoose)
MONGODB_URI=mongodb://localhost:27017/botdb
`;
        break;
    }
  }

  return envContent;
}

export function generateEnvExampleFile(options?: InitOptions): string {
  let envContent = `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional: Guild ID for testing slash commands
GUILD_ID=your_guild_id_here
`;

  if (options?.database) {
    switch (options.databaseType) {
      case "postgres":
        envContent += `
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/botdb
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=botdb
`;
        break;
      case "mysql":
        envContent += `
# MySQL Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/botdb
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=botdb
`;
        break;
      case "mongodb":
        envContent += `
# MongoDB Database Configuration
MONGODB_URI=mongodb://localhost:27017/botdb
`;
        break;
      case "redis":
        envContent += `
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
`;
        break;
      case "sqlite":
        envContent += `
# SQLite Configuration
DB_PATH=./data/bot.db
`;
        break;
      case "prisma":
        envContent += `
# Prisma Database Configuration
# For PostgreSQL:
DATABASE_URL=postgresql://username:password@localhost:5432/botdb
# For MySQL:
# DATABASE_URL=mysql://root:password@localhost:3306/botdb
# For SQLite:
# DATABASE_URL=file:./data/bot.db
`;
        break;
      case "mongoose":
        envContent += `
# MongoDB Database Configuration (for Mongoose)
MONGODB_URI=mongodb://localhost:27017/botdb
`;
        break;
    }
  }

  return envContent;
}
