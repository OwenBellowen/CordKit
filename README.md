# CordKit

[![Version](https://img.shields.io/npm/v/cordkit.svg)](https://www.npmjs.com/package/cordkit)
[![Downloads](https://img.shields.io/npm/dm/cordkit.svg)](https://www.npmjs.com/package/cordkit)
[![Bun](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange.svg)](https://bun.sh)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**CordKit** is the most advanced CLI tool for generating Discord.js bot starter projects with Bun runtime. Create professional Discord bots with TypeScript or JavaScript templates, advanced features, plugins, and deployment configurations in seconds.

## 🚀 Features

### Core Features
- **🤖 Multiple Bot Types**: General, Music, Moderation, Utility, Economy, Gaming, and AI bots
- **📘 TypeScript & JavaScript**: Full support for both languages with modern configurations
- **⚡ Bun Optimized**: All generated projects are optimized for Bun runtime
- **🔌 Plugin System**: Extensible plugin architecture with 6+ built-in plugins
- **🔧 Advanced CLI**: 9 powerful commands for complete project lifecycle management
- **📊 Analytics Dashboard**: Comprehensive project insights and health monitoring

### Advanced Capabilities
- **🛡️ Security First**: Built-in rate limiting, input validation, and security best practices
- **🗄️ Database Integration**: SQLite support with migrations and ORM patterns
- **🐳 DevOps Ready**: Docker, Railway, Heroku, and PM2 deployment configurations
- **🧪 Testing Framework**: Jest integration with coverage reporting
- **📝 Advanced Logging**: Winston-based logging with multiple transports
- **🔍 Code Quality**: ESLint and Prettier with modern configurations
- **🎨 Colorful CLI**: Rich console output with colors and emojis for better UX
- **⚡ Component Generation**: Generate commands, events, and components on-demand

## 📦 Installation

### Global Installation (Recommended)
```bash
# Install globally with npm
npm install -g cordkit

# Or with yarn
yarn global add cordkit

# Or with pnpm
pnpm add -g cordkit

# Or with bun
bun add -g cordkit
```

### Local Development Installation
```bash
# Clone the repository
git clone https://github.com/your-username/cordkit
cd cordkit

# Install dependencies
npm install
# or: bun install

# Build the project
npm run build

# Create your first bot
cordkit init
```

### Prerequisites
- Node.js v18.0.0+ (required for npm installation)
- [Bun](https://bun.sh/) v1.0.0+ (optional, for optimal performance)

### Quick Start
```bash
# After global installation
cordkit init

# Follow the interactive prompts to create your bot
```

## 🛠️ CLI Commands

### Core Commands

#### `cordkit init` - Project Generation
Create a new Discord bot project with interactive prompts or CLI flags.

```bash
# Interactive mode
cordkit init

# With specific options
cordkit init --name my-bot --template typescript --bot-type music --database --logging --docker

# All available options
cordkit init [options]
  -n, --name <name>      Project name
  -t, --template <type>  typescript or javascript
  --bot-type <type>      general, music, moderation, utility, economy, gaming, ai
  --dotenv              Include environment variable management
  --commands            Include message command handler
  --slash               Include slash command support
  --database            Include SQLite database integration
  --logging             Include Winston logging system
  --webhooks            Include webhook server support
  --docker              Include Docker configuration
  --testing             Include Jest testing framework
  --linting             Include ESLint and Prettier
```

#### `cordkit generate` - Component Generation
Generate new commands, events, and bot components with interactive prompts.

```bash
cordkit generate                       # Interactive mode
cordkit generate --type command --name modkick    # Generate message command
cordkit generate --type slash-command --name ban  # Generate slash command
cordkit generate --type event --name memberJoin   # Generate event handler

# Options
  -t, --type <type>      Component type: command, slash-command, event
  -n, --name <name>      Component name
  -p, --path <path>      Project path (default: current directory)
  -l, --language <lang>  Language: typescript or javascript (auto-detected)
```

**Supported Components:**
- 📝 **Message Commands**: Traditional `!command` style commands with permission checks
- ⚡ **Slash Commands**: Modern `/command` style interactions with Discord API
- 🎯 **Event Handlers**: Discord event listeners (messageCreate, guildMemberAdd, etc.)

#### `cordkit list` - Browse Options
Explore all available templates, features, and plugins.

```bash
cordkit list                    # Show everything
cordkit list --templates        # Bot templates only
cordkit list --features         # Core features only
cordkit list --plugins          # Available plugins
cordkit list --commands         # CLI commands
```

#### `cordkit plugins` - Plugin Management
Install and manage bot plugins for extended functionality.

```bash
cordkit plugins --list                    # List available plugins
cordkit plugins --install economy         # Install economy plugin
cordkit plugins --remove auto-mod         # Remove auto-mod plugin
cordkit plugins --path ./my-bot           # Specify project path
```

**Available Plugins:**
- 🛡️ **auto-mod**: Automatic message filtering and user moderation
- 💰 **economy**: Virtual currency and economy features
- 📈 **levels**: User experience and leveling system
- 🎫 **tickets**: Support ticket system with categories
- 📊 **polls**: Create polls and voting systems
- 🎭 **react-roles**: Role assignment via message reactions

#### `cordkit dashboard` - Project Analytics
Get comprehensive insights about your bot project.

```bash
cordkit dashboard                          # Basic analytics
cordkit dashboard --detailed               # Detailed analysis
cordkit dashboard --json                   # JSON output
cordkit dashboard --path ./my-bot          # Specific project
```

**Dashboard Features:**
- 📊 Code statistics and file counts
- 🎯 Bot type and feature detection
- 📦 Dependency analysis
- 🏥 Project health checks
- 💡 Personalized recommendations

#### `cordkit config` - Configuration Management
Manage bot configuration with a powerful settings system.

```bash
cordkit config --init                     # Initialize config file
cordkit config --list                     # Show all settings
cordkit config --get prefix               # Get specific value
cordkit config --set prefix "?"           # Set configuration
cordkit config --set features.economy true # Nested configuration
```

#### `cordkit migrate` - Project Migration
Update and modernize existing Discord bot projects.

```bash
cordkit migrate --list                    # List available migrations
cordkit migrate --all                     # Run all migrations
cordkit migrate --all --dry-run           # Preview changes
cordkit migrate --specific update-discord-js-v14  # Specific migration
```

**Available Migrations:**
- 🔄 **update-discord-js-v14**: Update to Discord.js v14 with breaking changes
- ⚡ **add-bun-support**: Add Bun runtime optimization
- 🛡️ **add-error-handling**: Improve error handling and logging
- 📘 **modernize-tsconfig**: Update TypeScript configuration
- 🔒 **add-security-features**: Add security best practices

#### `cordkit update` - Project Updates
Update dependencies and configurations in existing projects.

```bash
cordkit update                            # Update everything
cordkit update --dependencies             # Dependencies only
cordkit update --scripts                  # Package.json scripts
cordkit update --config                   # Configuration files
```

#### `cordkit deploy` - Deployment Configuration
Generate deployment configurations for various platforms.

```bash
cordkit deploy                           # Generate Docker config
cordkit deploy --railway                 # Railway deployment
cordkit deploy --heroku                  # Heroku configuration
cordkit deploy --pm2                     # PM2 ecosystem file
cordkit deploy --docker                  # Docker + Docker Compose
```

## 🎯 Bot Templates

### General Purpose Bot
Basic Discord bot with essential features and extensibility.
```bash
cordkit init --bot-type general --commands --slash --dotenv
```

### Music Bot
Advanced music streaming with voice channel support and queue management.
```bash
cordkit init --bot-type music --database --logging --docker
```

### Moderation Bot
Comprehensive moderation tools with auto-mod and administration features.
```bash
cordkit init --bot-type moderation --database --logging --webhooks
```

### Utility Bot
Server management tools and utility commands for administrators.
```bash
cordkit init --bot-type utility --slash --database --testing
```

### Economy Bot
Virtual currency system with trading, shops, and gamification.
```bash
cordkit init --bot-type economy --database --logging --linting
```

### Gaming Bot
Gaming-focused features with integrations and competition tools.
```bash
cordkit init --bot-type gaming --database --webhooks --docker
```

### AI Bot
AI-powered responses with chat integration and intelligent features.
```bash
cordkit init --bot-type ai --webhooks --logging --testing
```

## 📁 Generated Project Structure

### Complete Project Layout
```
my-discord-bot/
├── 📄 index.ts/js              # Main bot entry point
├── 📁 commands/                # Message commands (!command)
│   ├── ping.ts                 # Example ping command
│   └── help.ts                 # Auto-generated help command
├── 📁 slash-commands/          # Slash commands (/command)
│   ├── ping.ts                 # Example slash ping
│   └── info.ts                 # Bot information command
├── 📁 plugins/                 # Installed plugins
│   ├── economy.ts              # Economy system
│   └── levels.ts               # Leveling system
├── 📁 database/                # Database schema and operations
│   ├── schema.ts               # Database initialization
│   └── migrations/             # Database migrations
├── 📁 utils/                   # Utility functions
│   ├── logger.ts               # Winston logging configuration
│   └── security.ts             # Security utilities
├── 📁 webhooks/                # Webhook server
│   └── server.ts               # Express webhook server
├── 📁 tests/                   # Test suites
│   ├── bot.test.ts             # Bot functionality tests
│   └── commands.test.ts        # Command tests
├── 📁 logs/                    # Log files
├── 📁 data/                    # Database files
├── 📄 package.json             # Dependencies and scripts
├── 📄 config.json              # Bot configuration
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 .eslintrc.json           # ESLint configuration
├── 📄 .prettierrc              # Prettier configuration
├── 📄 jest.config.ts           # Jest testing configuration
├── 📄 Dockerfile               # Docker container
├── 📄 docker-compose.yml       # Docker Compose setup
├── 📄 .env                     # Environment variables
├── 📄 .env.example             # Environment template
├── 📄 .gitignore               # Git ignore rules
└── 📄 README.md                # Project documentation
```

## ⚡ Quick Examples

### Create a Music Bot
```bash
# Full-featured music bot with all modern tools
cordkit init \\
  --name "awesome-music-bot" \\
  --template typescript \\
  --bot-type music \\
  --database \\
  --logging \\
  --docker \\
  --testing \\
  --linting

cd awesome-music-bot
bun install

# Add some custom commands and events
cordkit generate --type command --name nowplaying
cordkit generate --type event --name voiceUpdate
cordkit generate --type slash-command --name play

# Configure your bot token in .env
bun run start
```

### Add Economy Features
```bash
# Add economy plugin to existing bot
cordkit plugins --install economy --path ./my-bot

# Configure economy settings
cordkit config --set features.economy true
cordkit config --set economy.startingBalance 1000
```

### Deploy to Production
```bash
# Generate deployment configurations
cordkit deploy --docker --railway

# Run migrations and updates
cordkit migrate --all
cordkit update --dependencies

# Check project health
cordkit dashboard --detailed
```

## 🔧 Advanced Configuration

### Bot Configuration (config.json)
```json
{
  "prefix": "!",
  "owners": ["your-user-id"],
  "features": {
    "autoMod": true,
    "economy": false,
    "levels": true,
    "tickets": false,
    "reactionRoles": true
  },
  "channels": {
    "logs": "channel-id",
    "welcome": "channel-id",
    "rules": "channel-id"
  },
  "roles": {
    "muted": "role-id",
    "moderator": "role-id",
    "admin": "role-id"
  },
  "permissions": {
    "requireRoles": false,
    "allowedChannels": []
  }
}
```

### Environment Variables (.env)
```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Database
DATABASE_URL=./data/bot.db

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/bot.log

# Webhooks
WEBHOOK_PORT=3000
WEBHOOK_SECRET=your_webhook_secret

# Features
ENABLE_AUTO_MOD=true
ENABLE_ECONOMY=false
```

## 🧪 Development & Testing

### Running Tests
```bash
# Run all tests
bun run test

# Run with coverage
bun run test:coverage

# Watch mode
bun run test:watch
```

### Code Quality
```bash
# Lint code
bun run lint

# Fix linting issues
bun run lint:fix

# Format code
bun run format
```

### Development Mode
```bash
# Start with auto-reload
bun run dev

# Start normally
bun run start
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker build -t my-discord-bot .
docker run -d --env-file .env my-discord-bot

# Or use Docker Compose
docker-compose up -d
```

### Railway Deployment
```bash
# Deploy to Railway
railway login
railway init
railway up
```

### PM2 Process Management
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 monit
```

## 📊 Project Analytics

CordKit provides comprehensive analytics about your bot projects:

- **📈 Code Metrics**: Lines of code, file counts, complexity analysis
- **🔍 Feature Detection**: Automatically detect installed features and plugins
- **🏥 Health Checks**: Project health scoring and recommendations
- **📦 Dependency Analysis**: Security vulnerabilities and outdated packages
- **⚡ Performance Insights**: Optimization suggestions and best practices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/your-repo/cordkit
cd cordkit
bun install
bun run dev
```

### Adding New Features
1. **New CLI Commands**: Add to `src/commands/`
2. **Bot Templates**: Update `src/templates/initTemplate.ts`
3. **Plugins**: Create new plugin generators in `src/commands/plugins.ts`
4. **Migrations**: Add to `src/commands/migrate.ts`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Powerful Discord API library
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- [Commander.js](https://github.com/tj/commander.js) - Node.js command-line interfaces
- [Prompts](https://github.com/terkelg/prompts) - Interactive command line prompts

---

**CordKit** - Making Discord bot development faster, easier, and more professional! 🚀

*Built with ❤️ for the Discord developer community*
