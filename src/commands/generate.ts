// CordKit 'generate' command implementation
import { Command } from "commander";
import { join } from "path";
import chalk from "chalk";
import { type GenerateOptions, detectProjectLanguage } from "./generate/utils";
import { promptGenerateOptions } from "./generate/prompter";
import { generateSlashCommand } from "./generate/slash-commands";
import { generateEvent } from "./generate/event-handlers";
import { validateProjectPath } from "./generate/validators";

export const generateCommand = new Command("generate")
  .alias("g")
  .description("Generate new slash commands, events, or other bot components")
  .option("-t, --type <type>", "Component type: slash-command, event")
  .option("-n, --name <n>", "Component name")
  .option("-p, --path <path>", "Project path", ".")
  .option("-l, --language <lang>", "Language: typescript or javascript")
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold("\n🛠️  CordKit Component Generator\n"));

      const projectPath = join(process.cwd(), options.path);

      // Validate project path
      if (!validateProjectPath(projectPath)) {
        return;
      }

      // Determine project language
      const language = options.language || detectProjectLanguage(projectPath);

      // Get generation options
      const answers = await promptGenerateOptions(options);

      // Generate component
      await generateComponent(answers, projectPath, language);
    } catch (error) {
      console.error(
        chalk.red("❌ Error:"),
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  });

async function generateComponent(
  options: GenerateOptions,
  projectPath: string,
  language: string,
) {
  const ext = language === "typescript" ? "ts" : "js";

  try {
    switch (options.type) {
      case "slash-command":
        await generateSlashCommand(options, projectPath, ext);
        break;
      case "event":
        await generateEvent(options, projectPath, ext);
        break;
      default:
        throw new Error(`Unknown component type: ${options.type}`);
    }

    console.log(chalk.green("\n✅ Generation completed successfully!"));
    console.log(
      chalk.blue(
        "💡 Don't forget to restart your bot to load the new component.",
      ),
    );
  } catch (error) {
    throw new Error(
      `Failed to generate ${options.type}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
