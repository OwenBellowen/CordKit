// CordKit 'init' command implementation
import { Command } from "commander";
import { promptInitOptions, generateProject } from "../templates/initTemplate";
import chalk from "chalk";

export const initCommand = new Command("init")
  .description("Initialize a new Discord.js bot project")
  .option("-n, --name <name>", "Project name")
  .option("-t, --template <type>", "Project template: typescript or javascript")
  .option("--dotenv", "Include dotenv support")
  .option("--commands", "Include slash commands")
  .option(
    "--bot-type <type>",
    "Bot type: general, music, moderation, utility, economy, gaming, ai",
  )
  .option("--database", "Include database support")
  .option(
    "--database-type <type>",
    "Database type: sqlite, postgres, mysql, mongodb, redis, prisma, mongoose",
  )
  .option("--logging", "Include advanced logging")
  .option("--webhooks", "Include webhook support")
  .option("--docker", "Include Docker configuration")
  .option("--testing", "Include testing setup")
  .option("--linting", "Include ESLint/Prettier")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(async (opts: any) => {
    try {
      console.log(
        chalk.blue.bold("🚀 Initializing new Discord.js bot project...\n"),
      );
      const options = await promptInitOptions(opts);
      await generateProject(options, opts.name);
    } catch (err) {
      console.error(chalk.red("❌ Error initializing project:"), err);
      process.exit(1);
    }
  });
