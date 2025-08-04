// CordKit 'list' command implementation
import { Command } from "commander";
import chalk from "chalk";

export const listCommand = new Command("list")
  .description("List available templates and features")
  .option("-t, --templates", "List available bot templates")
  .option("-f, --features", "List available features")
  .option("-p, --plugins", "List available plugins")
  .option("-c, --commands", "List available CLI commands")
  .action((opts: any) => {
    console.log(chalk.blue.bold("📋 CordKit Available Options\n"));

    if (
      opts.templates ||
      (!opts.templates && !opts.features && !opts.plugins && !opts.commands)
    ) {
      console.log(chalk.cyan.bold("🤖 Bot Templates:"));
      console.log(
        chalk.white("  • ") +
          chalk.green("general") +
          chalk.gray("     - General purpose Discord bot with basic features"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("music") +
          chalk.gray(
            "       - Music streaming bot with queue management and voice features",
          ),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("moderation") +
          chalk.gray("  - Server moderation with auto-mod and admin tools"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("utility") +
          chalk.gray("     - Utility commands, tools, and server management"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("economy") +
          chalk.gray("     - Economy system with currency and trading"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("gaming") +
          chalk.gray("      - Gaming-focused features and integrations"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.green("ai") +
          chalk.gray("          - AI-powered responses and chat integration\n"),
      );
    }

    if (
      opts.features ||
      (!opts.templates && !opts.features && !opts.plugins && !opts.commands)
    ) {
      console.log(chalk.cyan.bold("⚡ Core Features:"));
      console.log(
        chalk.white("  • ") +
          chalk.yellow("dotenv") +
          chalk.gray("      - Environment variable management"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("commands") +
          chalk.gray("    - Message command handler (!command)"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("slash") +
          chalk.gray("       - Slash command support (/command)"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("database") +
          chalk.gray("    - SQLite database integration"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("logging") +
          chalk.gray("     - Advanced logging with Winston"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("webhooks") +
          chalk.gray("    - Webhook integration support"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("docker") +
          chalk.gray("      - Docker containerization"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("testing") +
          chalk.gray("     - Jest testing framework"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("linting") +
          chalk.gray("     - ESLint + Prettier code formatting"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("security") +
          chalk.gray("    - Rate limiting and input validation"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.yellow("monitoring") +
          chalk.gray("  - Health checks and performance metrics\n"),
      );
    }

    if (opts.plugins) {
      console.log(chalk.cyan.bold("🔌 Available Plugins:"));
      console.log(
        chalk.white("  • ") +
          chalk.magenta("auto-mod") +
          chalk.gray("       - Automatic message filtering and moderation"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("economy") +
          chalk.gray("        - Virtual currency and economy features"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("levels") +
          chalk.gray("         - User experience and leveling system"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("tickets") +
          chalk.gray("        - Support ticket system with categories"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("polls") +
          chalk.gray("          - Create polls and voting systems"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("react-roles") +
          chalk.gray("    - Role assignment via message reactions"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("welcome") +
          chalk.gray("        - Welcome messages and member screening"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("announcements") +
          chalk.gray("  - Automated announcement system"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("giveaways") +
          chalk.gray("      - Giveaway and contest management"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.magenta("reminders") +
          chalk.gray("      - Reminder and scheduling system\n"),
      );
    }

    if (opts.commands) {
      console.log(chalk.cyan.bold("🛠️ CLI Commands:"));
      console.log(
        chalk.white("  • ") +
          chalk.blue("init") +
          chalk.gray("        - Initialize a new Discord bot project"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("generate") +
          chalk.gray("    - Generate new commands, events, or components"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("list") +
          chalk.gray("        - List available templates and features"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("update") +
          chalk.gray("      - Update an existing CordKit project"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("deploy") +
          chalk.gray("      - Generate deployment configurations"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("plugins") +
          chalk.gray("     - Manage bot plugins and extensions"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("config") +
          chalk.gray("      - Manage bot configuration"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("migrate") +
          chalk.gray("     - Migrate and update existing projects"),
      );
      console.log(
        chalk.white("  • ") +
          chalk.blue("dashboard") +
          chalk.gray("   - Show project analytics and insights\n"),
      );
    }

    console.log(chalk.green.bold("💡 Usage Examples:"));
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("init") +
        chalk.gray(" --bot-type music --database --logging --docker"),
    );
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("generate") +
        chalk.gray(" --type command --name modkick"),
    );
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("plugins") +
        chalk.gray(" --install economy"),
    );
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("config") +
        chalk.gray(' --set prefix "?"'),
    );
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("dashboard") +
        chalk.gray(" --detailed"),
    );
    console.log(
      chalk.white("  ") +
        chalk.gray("cordkit ") +
        chalk.yellow("migrate") +
        chalk.gray(" --all --dry-run"),
    );
  });
