// Project initialization logic for CordKit
import prompts from "prompts";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Import generators
import { generatePackageJson } from "./generators/packageGenerator";
import {
  generateEnvFile,
  generateEnvExampleFile,
} from "./generators/envGenerator";
import { generateMainFile } from "./generators/mainFileGenerator";
import {
  generateSampleCommand,
  generateSlashCommand,
} from "./generators/commandGenerator";
import {
  generateTsConfig,
  generateESLintConfig,
  generatePrettierConfig,
  generatePrettierIgnore,
  generateGitignore,
} from "./generators/configGenerator";
import { generateDatabaseSchema } from "./generators/databaseGenerator";
import {
  generateLogger,
  generateWebhook,
  generateDockerfile,
  generateDockerCompose,
  generateDockerIgnore,
  generateTestConfig,
  generateSampleTest,
} from "./generators/featureGenerator";
import { generateReadme } from "./generators/docGenerator";

export interface InitOptions {
  template: "typescript" | "javascript";
  dotenv: boolean;
  commands: boolean;
  slash: boolean;
  database: boolean;
  logging: boolean;
  webhooks: boolean;
  docker: boolean;
  testing: boolean;
  linting: boolean;
  botType: "general" | "music" | "moderation" | "utility";
}

export async function promptInitOptions(cliOpts: any): Promise<InitOptions> {
  // If --yes flag is provided, skip all prompts and use defaults
  if (cliOpts.yes) {
    return {
      template: cliOpts.template || "typescript",
      dotenv: cliOpts.dotenv !== undefined ? cliOpts.dotenv : true,
      commands: cliOpts.commands !== undefined ? cliOpts.commands : true,
      slash: cliOpts.slash !== undefined ? cliOpts.slash : false,
      botType: cliOpts.botType || "general",
      database: cliOpts.database !== undefined ? cliOpts.database : false,
      logging: cliOpts.logging !== undefined ? cliOpts.logging : true,
      webhooks: cliOpts.webhooks !== undefined ? cliOpts.webhooks : false,
      docker: cliOpts.docker !== undefined ? cliOpts.docker : false,
      testing: cliOpts.testing !== undefined ? cliOpts.testing : false,
      linting: cliOpts.linting !== undefined ? cliOpts.linting : true,
    };
  }

  const questions: prompts.PromptObject[] = [];

  // Only prompt for options that weren't provided via CLI flags
  if (!cliOpts.template) {
    questions.push({
      type: "select" as const,
      name: "template",
      message: "Choose a template",
      choices: [
        { title: "TypeScript", value: "typescript" },
        { title: "JavaScript", value: "javascript" },
      ],
      initial: 0,
    });
  }

  if (cliOpts.dotenv === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "dotenv",
      message: "Include dotenv support?",
      initial: true,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.commands === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "commands",
      message: "Include command folders?",
      initial: true,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.slash === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "slash",
      message: "Include slash command support?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.botType === undefined) {
    questions.push({
      type: "select" as const,
      name: "botType",
      message: "Choose bot type:",
      choices: [
        { title: "General Purpose Bot", value: "general" },
        { title: "Music Bot", value: "music" },
        { title: "Moderation Bot", value: "moderation" },
        { title: "Utility Bot", value: "utility" },
      ],
      initial: 0,
    });
  }

  if (cliOpts.database === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "database",
      message: "Include database support (SQLite)?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.logging === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "logging",
      message: "Include advanced logging?",
      initial: true,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.webhooks === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "webhooks",
      message: "Include webhook support?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.docker === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "docker",
      message: "Include Docker configuration?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.testing === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "testing",
      message: "Include testing setup?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.linting === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "linting",
      message: "Include ESLint/Prettier?",
      initial: true,
      active: "yes",
      inactive: "no",
    });
  }

  const answers = questions.length ? await prompts(questions) : {};

  return {
    template: cliOpts.template || answers.template || "typescript",
    dotenv:
      cliOpts.dotenv !== undefined
        ? cliOpts.dotenv
        : answers.dotenv !== undefined
          ? answers.dotenv
          : true,
    commands:
      cliOpts.commands !== undefined
        ? cliOpts.commands
        : answers.commands !== undefined
          ? answers.commands
          : true,
    slash:
      cliOpts.slash !== undefined
        ? cliOpts.slash
        : answers.slash !== undefined
          ? answers.slash
          : false,
    botType: cliOpts.botType || answers.botType || "general",
    database:
      cliOpts.database !== undefined
        ? cliOpts.database
        : answers.database !== undefined
          ? answers.database
          : false,
    logging:
      cliOpts.logging !== undefined
        ? cliOpts.logging
        : answers.logging !== undefined
          ? answers.logging
          : true,
    webhooks:
      cliOpts.webhooks !== undefined
        ? cliOpts.webhooks
        : answers.webhooks !== undefined
          ? answers.webhooks
          : false,
    docker:
      cliOpts.docker !== undefined
        ? cliOpts.docker
        : answers.docker !== undefined
          ? answers.docker
          : false,
    testing:
      cliOpts.testing !== undefined
        ? cliOpts.testing
        : answers.testing !== undefined
          ? answers.testing
          : false,
    linting:
      cliOpts.linting !== undefined
        ? cliOpts.linting
        : answers.linting !== undefined
          ? answers.linting
          : true,
  };
}

export async function generateProject(
  options: InitOptions,
  projectName?: string,
) {
  let finalProjectName = projectName;

  // Prompt for project name if not provided
  if (!finalProjectName) {
    const projectNamePrompt = await prompts({
      type: "text" as const,
      name: "projectName",
      message: "Project name:",
      initial: "my-discord-bot",
      validate: (value: string) =>
        value.length > 0 ? true : "Project name is required",
    });
    finalProjectName = projectNamePrompt.projectName;
  }

  // Ensure we have a project name
  if (!finalProjectName) {
    console.error("❌ Project name is required!");
    process.exit(1);
  }

  const projectPath = join(process.cwd(), finalProjectName);

  // Check if directory already exists
  if (existsSync(projectPath)) {
    console.error(`❌ Directory '${finalProjectName}' already exists!`);
    process.exit(1);
  }

  console.log(`📁 Creating project directory: ${finalProjectName}`);
  mkdirSync(projectPath, { recursive: true });

  // Generate package.json
  console.log("📦 Generating package.json...");
  const packageJson = generatePackageJson(finalProjectName, options);
  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );

  // Generate .env file if dotenv is enabled
  if (options.dotenv) {
    console.log("🔐 Generating .env file...");
    const envContent = generateEnvFile();
    writeFileSync(join(projectPath, ".env"), envContent);

    // Also create .env.example
    const envExampleContent = generateEnvExampleFile();
    writeFileSync(join(projectPath, ".env.example"), envExampleContent);
  }

  // Generate main bot file
  console.log(
    `🤖 Generating main bot file (index.${options.template === "typescript" ? "ts" : "js"})...`,
  );
  const mainFile = generateMainFile(options);
  const mainFileName = `index.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(projectPath, mainFileName), mainFile);

  // Generate commands folder and sample command if enabled
  if (options.commands) {
    console.log("⚡ Creating commands folder...");
    const commandsPath = join(projectPath, "commands");
    mkdirSync(commandsPath, { recursive: true });

    const sampleCommand = generateSampleCommand(options);
    const commandFileName = `ping.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(commandsPath, commandFileName), sampleCommand);
  }

  // Generate slash command if enabled
  if (options.slash) {
    console.log("🔗 Creating slash commands...");
    const slashCommandsPath = join(projectPath, "slash-commands");
    mkdirSync(slashCommandsPath, { recursive: true });

    const slashCommand = generateSlashCommand(options);
    const slashFileName = `ping.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(slashCommandsPath, slashFileName), slashCommand);
  }

  // Generate database configuration if enabled
  if (options.database) {
    console.log("🗄️ Setting up database...");
    const dbPath = join(projectPath, "database");
    mkdirSync(dbPath, { recursive: true });

    const dbSchema = generateDatabaseSchema(options);
    const dbFileName = `schema.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(dbPath, dbFileName), dbSchema);
  }

  // Generate logging configuration if enabled
  if (options.logging) {
    console.log("📝 Setting up logging...");
    const utilsPath = join(projectPath, "utils");
    mkdirSync(utilsPath, { recursive: true });

    const logger = generateLogger(options);
    const loggerFileName = `logger.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(utilsPath, loggerFileName), logger);
  }

  // Generate webhook configuration if enabled
  if (options.webhooks) {
    console.log("🔗 Setting up webhooks...");
    const webhooksPath = join(projectPath, "webhooks");
    mkdirSync(webhooksPath, { recursive: true });

    const webhook = generateWebhook(options);
    const webhookFileName = `server.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(webhooksPath, webhookFileName), webhook);
  }

  // Generate Docker configuration if enabled
  if (options.docker) {
    console.log("🐳 Setting up Docker...");
    const dockerfile = generateDockerfile();
    writeFileSync(join(projectPath, "Dockerfile"), dockerfile);

    const dockerCompose = generateDockerCompose();
    writeFileSync(join(projectPath, "docker-compose.yml"), dockerCompose);

    const dockerIgnore = generateDockerIgnore();
    writeFileSync(join(projectPath, ".dockerignore"), dockerIgnore);
  }

  // Generate testing configuration if enabled
  if (options.testing) {
    console.log("🧪 Setting up testing...");
    const testsPath = join(projectPath, "tests");
    mkdirSync(testsPath, { recursive: true });

    const testConfig = generateTestConfig(options);
    const testFileName =
      options.template === "typescript" ? "jest.config.ts" : "jest.config.js";
    writeFileSync(join(projectPath, testFileName), testConfig);

    const sampleTest = generateSampleTest(options);
    const sampleTestFileName = `bot.test.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(testsPath, sampleTestFileName), sampleTest);
  }

  // Generate linting configuration if enabled
  if (options.linting) {
    console.log("🔍 Setting up ESLint and Prettier...");
    const eslintConfig = generateESLintConfig(options);
    writeFileSync(
      join(projectPath, ".eslintrc.json"),
      JSON.stringify(eslintConfig, null, 2),
    );

    const prettierConfig = generatePrettierConfig();
    writeFileSync(
      join(projectPath, ".prettierrc"),
      JSON.stringify(prettierConfig, null, 2),
    );

    const prettierIgnore = generatePrettierIgnore();
    writeFileSync(join(projectPath, ".prettierignore"), prettierIgnore);
  }

  // Generate TypeScript config if needed
  if (options.template === "typescript") {
    console.log("⚙️ Generating tsconfig.json...");
    const tsConfig = generateTsConfig();
    writeFileSync(
      join(projectPath, "tsconfig.json"),
      JSON.stringify(tsConfig, null, 2),
    );
  }

  // Generate README
  console.log("📝 Generating README.md...");
  const readme = generateReadme(finalProjectName, options);
  writeFileSync(join(projectPath, "README.md"), readme);

  // Generate .gitignore
  console.log("🙈 Generating .gitignore...");
  const gitignore = generateGitignore();
  writeFileSync(join(projectPath, ".gitignore"), gitignore);

  console.log("\n✅ Project generated successfully!");
  console.log(`\n📋 Next steps:`);
  console.log(`   cd ${finalProjectName}`);
  console.log(`   bun install`);
  if (options.dotenv) {
    console.log(`   # Edit .env file with your Discord bot token`);
  }
  console.log(`   bun run start\n`);
}
