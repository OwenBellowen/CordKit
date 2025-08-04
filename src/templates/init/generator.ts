// Project generation orchestration
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import prompts from "prompts";
import type { InitOptions } from "./options";

// Import generators
import { generatePackageJson } from "../generators/packageGenerator";
import {
  generateEnvFile,
  generateEnvExampleFile,
} from "../generators/envGenerator";
import { generateMainFile } from "../generators/mainFileGenerator";
import {
  generateSampleCommand,
  generateSlashCommand,
  generateSampleEvent,
} from "../generators/commandGenerator";
import {
  generateTsConfig,
  generateESLintConfig,
  generatePrettierConfig,
  generatePrettierIgnore,
  generateGitignore,
} from "../generators/configGenerator";
import {
  generateDatabaseSchema,
  generateDatabaseConfig,
} from "../generators/databaseGenerator";
import {
  generateMigrationTypes,
  generateMigrationRunner,
  generateMigrationTemplate,
} from "../generators/migrationGenerator";
import { generateDatabaseManager } from "../generators/databaseManagerGenerator";
import {
  generateLogger,
  generateWebhook,
  generateDockerfile,
  generateDockerCompose,
  generateDockerIgnore,
  generateTestConfig,
  generateSampleTest,
} from "../generators/featureGenerator";
import { generateReadme } from "../generators/docGenerator";
import { generateInterfaces } from "../generators/interfaceGenerator";
import {
  generateCommandHandler,
  generateEventHandler,
  generateInteractionHandler,
} from "../generators/handlerGenerator";
import { generateClient } from "../generators/clientGenerator";
import { generateInteractionCreateEvent } from "../generators/interactionGenerator";

export async function promptProjectName(projectName?: string): Promise<string> {
  if (projectName) {
    return projectName;
  }

  const projectNamePrompt = await prompts({
    type: "text" as const,
    name: "projectName",
    message: "Project name:",
    initial: "my-discord-bot",
    validate: (value: string) =>
      value.length > 0 ? true : "Project name is required",
  });

  if (!projectNamePrompt.projectName) {
    console.error("❌ Project name is required!");
    process.exit(1);
  }

  return projectNamePrompt.projectName;
}

export function createProjectDirectory(projectName: string): string {
  const projectPath = join(process.cwd(), projectName);

  // Check if directory already exists
  if (existsSync(projectPath)) {
    console.error(`❌ Directory '${projectName}' already exists!`);
    process.exit(1);
  }

  console.log(`📁 Creating project directory: ${projectName}`);
  mkdirSync(projectPath, { recursive: true });

  return projectPath;
}

export function generateCoreFiles(
  projectPath: string,
  projectName: string,
  options: InitOptions,
) {
  console.log("📦 Generating package.json...");
  const packageJson = generatePackageJson(projectName, options);
  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );

  if (options.dotenv) {
    console.log("🔐 Generating .env file...");
    const envContent = generateEnvFile(options);
    writeFileSync(join(projectPath, ".env"), envContent);

    const envExampleContent = generateEnvExampleFile(options);
    writeFileSync(join(projectPath, ".env.example"), envExampleContent);
  }

  console.log(
    `🤖 Generating main bot file (index.${options.template === "typescript" ? "ts" : "js"})...`,
  );
  const mainFile = generateMainFile(options);
  const mainFileName = `index.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(projectPath, mainFileName), mainFile);
}

export function generateCommandStructure(
  projectPath: string,
  options: InitOptions,
) {
  // Create structures folder
  console.log("🏗️ Creating structures folder...");
  const structuresPath = join(projectPath, "structures");
  mkdirSync(structuresPath, { recursive: true });

  // Generate Client
  const clientContent = generateClient(options);
  const clientFileName = `Client.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(structuresPath, clientFileName), clientContent);

  // Generate CommandHandler
  const commandHandlerContent = generateCommandHandler(options);
  const commandHandlerFileName = `CommandHandler.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(
    join(structuresPath, commandHandlerFileName),
    commandHandlerContent,
  );

  // Generate EventHandler
  const eventHandlerContent = generateEventHandler(options);
  const eventHandlerFileName = `EventHandler.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(
    join(structuresPath, eventHandlerFileName),
    eventHandlerContent,
  );

  // Generate InteractionHandler
  const interactionHandlerContent = generateInteractionHandler(options);
  const interactionHandlerFileName = `InteractionHandler.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(
    join(structuresPath, interactionHandlerFileName),
    interactionHandlerContent,
  );

  // Create interfaces folder (TypeScript only)
  if (options.template === "typescript") {
    console.log("� Creating interfaces folder...");
    const interfacesPath = join(projectPath, "interfaces");
    mkdirSync(interfacesPath, { recursive: true });

    const interfacesContent = generateInterfaces(options);
    writeFileSync(join(interfacesPath, "index.ts"), interfacesContent);
  }

  // Create commands folder with categories
  console.log("⚡ Creating commands folder...");
  const commandsPath = join(projectPath, "commands");
  mkdirSync(commandsPath, { recursive: true });

  // Create command categories
  const categories = ["info", "fun", "utility", "moderation"];
  for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    mkdirSync(categoryPath, { recursive: true });
  }

  // Generate sample command in info category
  const sampleCommand = generateSampleCommand(options);
  const commandFileName = `test.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(commandsPath, "info", commandFileName), sampleCommand);

  // Generate ping command in info category
  const slashCommand = generateSlashCommand(options);
  const slashFileName = `ping.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(commandsPath, "info", slashFileName), slashCommand);

  // Create events folder with categories
  console.log("📡 Creating events folder...");
  const eventsPath = join(projectPath, "events");
  mkdirSync(eventsPath, { recursive: true });

  // Create event categories
  const eventCategories = ["client", "guild", "interaction"];
  for (const category of eventCategories) {
    const categoryPath = join(eventsPath, category);
    mkdirSync(categoryPath, { recursive: true });
  }

  // Generate ready event in client category
  const sampleEvent = generateSampleEvent(options);
  const eventFileName = `ready.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(join(eventsPath, "client", eventFileName), sampleEvent);

  // Generate interaction event in interaction category
  const interactionEvent = generateInteractionCreateEvent(options);
  const interactionEventFileName = `interactionCreate.${options.template === "typescript" ? "ts" : "js"}`;
  writeFileSync(
    join(eventsPath, "interaction", interactionEventFileName),
    interactionEvent,
  );

  // Create interactions folder structure
  console.log("🔘 Creating interactions folder...");
  const interactionsPath = join(projectPath, "interactions");
  mkdirSync(interactionsPath, { recursive: true });

  // Create interaction subfolders
  const interactionTypes = ["buttons", "modals", "selectMenus"];
  for (const type of interactionTypes) {
    const typePath = join(interactionsPath, type);
    mkdirSync(typePath, { recursive: true });
  }
}

export function generateDatabaseStructure(
  projectPath: string,
  options: InitOptions,
) {
  if (options.database) {
    console.log("🗄️ Setting up database...");

    const dbPath = join(projectPath, "database");
    mkdirSync(dbPath, { recursive: true });

    const configPath = join(projectPath, "config");
    mkdirSync(configPath, { recursive: true });

    const migrationsPath = join(projectPath, "migrations");
    mkdirSync(migrationsPath, { recursive: true });

    const typesPath = join(projectPath, "types");
    mkdirSync(typesPath, { recursive: true });

    const schema = generateDatabaseSchema(options);
    const fileName = `schema.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(dbPath, fileName), schema);

    const dbConfig = generateDatabaseConfig(options);
    const configFileName = `database.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(configPath, configFileName), dbConfig);

    const dbManager = generateDatabaseManager(options);
    const managerFileName = `db.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(dbPath, managerFileName), dbManager); // Setup migrations if not using Prisma (which has its own migration system)
    if (options.databaseType !== "prisma") {
      // Generate migration types
      const migrationTypes = generateMigrationTypes(options);
      const migrationTypesFileName = `migration.${options.template === "typescript" ? "ts" : "js"}`;
      writeFileSync(join(typesPath, migrationTypesFileName), migrationTypes);

      // Generate migration runner
      const migrationRunner = generateMigrationRunner(options);
      const runnerFileName = `migrator.${options.template === "typescript" ? "ts" : "js"}`;
      writeFileSync(join(dbPath, runnerFileName), migrationRunner);

      // Generate initial migration
      const initialMigration = generateMigrationTemplate(options);
      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "");
      const migrationFileName = `${timestamp}_initial.${options.template === "typescript" ? "ts" : "js"}`;
      writeFileSync(join(migrationsPath, migrationFileName), initialMigration);
    }

    // Special handling for Prisma
    if (options.databaseType === "prisma") {
      console.log("🔧 Setting up Prisma...");

      // Create prisma directory
      const prismaPath = join(projectPath, "prisma");
      mkdirSync(prismaPath, { recursive: true });

      // Generate prisma schema file
      const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  discordId String   @unique
  username  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Guild {
  id        String   @id @default(cuid())
  discordId String   @unique
  name      String
  prefix    String   @default("!")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("guilds")
}`;
      writeFileSync(join(prismaPath, "schema.prisma"), prismaSchema);
    }

    const dbSchema = generateDatabaseSchema(options);
    const dbFileName = `schema.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(dbPath, dbFileName), dbSchema);
  }
}

export function generateUtilityFeatures(
  projectPath: string,
  options: InitOptions,
) {
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
}

export function generateDevTools(
  projectPath: string,
  projectName: string,
  options: InitOptions,
) {
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
    const sampleTestFileName = `sample.test.${options.template === "typescript" ? "ts" : "js"}`;
    writeFileSync(join(testsPath, sampleTestFileName), sampleTest);
  }

  // Generate configuration files if linting is enabled
  if (options.linting) {
    console.log("🔧 Setting up linting...");

    if (options.template === "typescript") {
      const tsconfig = generateTsConfig();
      writeFileSync(
        join(projectPath, "tsconfig.json"),
        JSON.stringify(tsconfig, null, 2),
      );
    }

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

  // Generate .gitignore
  const gitignore = generateGitignore();
  writeFileSync(join(projectPath, ".gitignore"), gitignore);

  // Generate README.md
  console.log("📖 Generating README.md...");
  const readme = generateReadme(projectName, options);
  writeFileSync(join(projectPath, "README.md"), readme);
}

export function displaySuccessMessage(
  projectName: string,
  options: InitOptions,
) {
  console.log(`\n✅ Project '${projectName}' created successfully!`);
  console.log("\n📋 Next steps:");
  console.log(`   cd ${projectName}`);

  if (options.dotenv) {
    console.log("   Edit .env file with your bot token");
  }

  console.log("   npm install");

  // Database-specific instructions
  if (options.database) {
    switch (options.databaseType) {
      case "prisma":
        console.log("\n🗄️ Prisma setup:");
        console.log("   npx prisma generate");
        console.log("   npx prisma db push");
        break;
      case "mongodb":
      case "mongoose":
        console.log("\n🗄️ MongoDB setup:");
        console.log("   Make sure MongoDB is running");
        console.log("   Check your .env file for MONGODB_URI");
        break;
      case "postgres":
        console.log("\n🗄️ PostgreSQL setup:");
        console.log("   Make sure PostgreSQL is running");
        console.log("   Create a database for your bot");
        console.log("   Check your .env file for database credentials");
        break;
      case "mysql":
        console.log("\n🗄️ MySQL setup:");
        console.log("   Make sure MySQL is running");
        console.log("   Create a database for your bot");
        console.log("   Check your .env file for database credentials");
        break;
      case "redis":
        console.log("\n🗄️ Redis setup:");
        console.log("   Make sure Redis is running");
        console.log("   Check your .env file for Redis configuration");
        break;
      case "sqlite":
        console.log("\n🗄️ SQLite setup:");
        console.log("   SQLite database will be created automatically");
        break;
    }
  }

  console.log("   npm run dev");

  console.log("\n🔗 Useful links:");
  console.log(
    "   Discord Developer Portal: https://discord.com/developers/applications",
  );
  console.log(
    "   CordKit Documentation: https://github.com/YourUsername/cordkit",
  );

  if (options.docker) {
    console.log("\n🐳 Docker commands:");
    console.log("   docker-compose up -d");
  }
}

export async function generateProject(
  options: InitOptions,
  projectName?: string,
) {
  const finalProjectName = await promptProjectName(projectName);
  const projectPath = createProjectDirectory(finalProjectName);

  // Generate all project components
  generateCoreFiles(projectPath, finalProjectName, options);
  generateCommandStructure(projectPath, options);
  generateDatabaseStructure(projectPath, options);
  generateUtilityFeatures(projectPath, options);
  generateDevTools(projectPath, finalProjectName, options);

  displaySuccessMessage(finalProjectName, options);
}
