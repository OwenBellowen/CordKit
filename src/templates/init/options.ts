// Project initialization options and prompting logic
import prompts from "prompts";

export interface InitOptions {
  template: "typescript" | "javascript";
  dotenv: boolean;
  commands: boolean;
  database: boolean;
  databaseType:
    | "sqlite"
    | "postgres"
    | "mysql"
    | "mongodb"
    | "redis"
    | "prisma"
    | "mongoose";
  logging: boolean;
  webhooks: boolean;
  docker: boolean;
  testing: boolean;
  linting: boolean;
  botType:
    | "general"
    | "music"
    | "moderation"
    | "utility"
    | "economy"
    | "gaming"
    | "ai";
}

interface CliOptions {
  template?: "typescript" | "javascript";
  dotenv?: boolean;
  commands?: boolean;
  database?: boolean;
  databaseType?:
    | "sqlite"
    | "postgres"
    | "mysql"
    | "mongodb"
    | "redis"
    | "prisma"
    | "mongoose";
  logging?: boolean;
  webhooks?: boolean;
  docker?: boolean;
  testing?: boolean;
  linting?: boolean;
  botType?:
    | "general"
    | "music"
    | "moderation"
    | "utility"
    | "economy"
    | "gaming"
    | "ai";
  yes?: boolean;
}

export function getDefaultOptions(cliOpts: CliOptions): InitOptions {
  return {
    template: cliOpts.template || "typescript",
    dotenv: cliOpts.dotenv !== undefined ? cliOpts.dotenv : true,
    commands: cliOpts.commands !== undefined ? cliOpts.commands : true,
    botType: cliOpts.botType || "general",
    database: cliOpts.database !== undefined ? cliOpts.database : false,
    databaseType: cliOpts.databaseType || "sqlite",
    logging: cliOpts.logging !== undefined ? cliOpts.logging : true,
    webhooks: cliOpts.webhooks !== undefined ? cliOpts.webhooks : false,
    docker: cliOpts.docker !== undefined ? cliOpts.docker : false,
    testing: cliOpts.testing !== undefined ? cliOpts.testing : false,
    linting: cliOpts.linting !== undefined ? cliOpts.linting : true,
  };
}

export function buildPromptQuestions(
  cliOpts: CliOptions,
): prompts.PromptObject[] {
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
      message: "Include slash commands?",
      initial: true,
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
        { title: "Economy Bot", value: "economy" },
        { title: "Gaming Bot", value: "gaming" },
        { title: "AI Bot", value: "ai" },
      ],
      initial: 0,
    });
  }

  if (cliOpts.database === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "database",
      message: "Include database support?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (
    cliOpts.databaseType === undefined &&
    (cliOpts.database || questions.some((q) => q.name === "database"))
  ) {
    questions.push({
      type: "select" as const,
      name: "databaseType",
      message: "Choose database type:",
      choices: [
        { title: "SQLite (File-based, no setup required)", value: "sqlite" },
        {
          title: "PostgreSQL (Powerful relational database)",
          value: "postgres",
        },
        { title: "MySQL (Popular relational database)", value: "mysql" },
        { title: "MongoDB (NoSQL document database)", value: "mongodb" },
        {
          title: "Redis (In-memory data store, great for caching)",
          value: "redis",
        },
        { title: "Prisma ORM (Type-safe database client)", value: "prisma" },
        { title: "Mongoose (MongoDB object modeling)", value: "mongoose" },
      ],
      initial: 0,
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
      message: "Include webhook server?",
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
      message: "Include testing setup (Jest)?",
      initial: false,
      active: "yes",
      inactive: "no",
    });
  }

  if (cliOpts.linting === undefined) {
    questions.push({
      type: "toggle" as const,
      name: "linting",
      message: "Include ESLint and Prettier?",
      initial: true,
      active: "yes",
      inactive: "no",
    });
  }

  return questions;
}

export function mergeOptionsWithAnswers(
  cliOpts: CliOptions,
  answers: Partial<InitOptions>,
): InitOptions {
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
    botType: cliOpts.botType || answers.botType || "general",
    database:
      cliOpts.database !== undefined
        ? cliOpts.database
        : answers.database !== undefined
          ? answers.database
          : false,
    databaseType: cliOpts.databaseType || answers.databaseType || "sqlite",
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

export async function promptInitOptions(
  cliOpts: CliOptions,
): Promise<InitOptions> {
  // If --yes flag is provided, skip all prompts and use defaults
  if (cliOpts.yes) {
    return getDefaultOptions(cliOpts);
  }

  const questions = buildPromptQuestions(cliOpts);

  if (questions.length === 0) {
    // All options provided via CLI
    return getDefaultOptions(cliOpts);
  }

  const answers = await prompts(questions);
  return mergeOptionsWithAnswers(cliOpts, answers);
}
