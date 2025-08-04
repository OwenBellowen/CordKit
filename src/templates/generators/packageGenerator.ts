// Package.json generator for CordKit projects
import type { InitOptions } from "../initTemplate";

interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  type: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  keywords: string[];
  author: string;
  license: string;
}

export function generatePackageJson(
  projectName: string,
  options: InitOptions,
): PackageJson {
  const pkg: PackageJson = {
    name: projectName,
    version: "1.0.0",
    description: `A Discord.js ${options.botType} bot generated with CordKit`,
    main: options.template === "typescript" ? "index.ts" : "index.js",
    type: "module",
    scripts: {
      start:
        options.template === "typescript"
          ? "bun run index.ts"
          : "bun run index.js",
      dev:
        options.template === "typescript"
          ? "bun --watch index.ts"
          : "bun --watch index.js",
    },
    dependencies: {
      "discord.js": "^14.14.1",
    },
    devDependencies: {},
    keywords: ["discord", "bot", "discord.js", "bun", options.botType],
    author: "",
    license: "MIT",
  };

  // Add conditional dependencies
  if (options.dotenv) {
    pkg.dependencies.dotenv = "^16.3.1";
  }

  if (options.database) {
    switch (options.databaseType) {
      case "postgres":
        pkg.dependencies.pg = "^8.11.3";
        if (options.template === "typescript") {
          pkg.devDependencies["@types/pg"] = "^8.10.9";
        }
        break;
      case "mysql":
        pkg.dependencies.mysql2 = "^3.6.5";
        break;
      case "mongodb":
        pkg.dependencies.mongodb = "^6.3.0";
        break;
      case "redis":
        pkg.dependencies.ioredis = "^5.3.2";
        if (options.template === "typescript") {
          pkg.devDependencies["@types/ioredis"] = "^5.0.4";
        }
        break;
      case "prisma":
        pkg.dependencies["@prisma/client"] = "^5.7.0";
        pkg.devDependencies.prisma = "^5.7.0";
        break;
      case "mongoose":
        pkg.dependencies.mongoose = "^8.0.3";
        if (options.template === "typescript") {
          pkg.devDependencies["@types/mongoose"] = "^8.0.4";
        }
        break;
      case "sqlite":
      default:
        pkg.dependencies.sqlite3 = "^5.1.6";
        pkg.dependencies.sqlite = "^5.1.1";
        break;
    }
  }

  if (options.logging) {
    pkg.dependencies.winston = "^3.11.0";
  }

  if (options.webhooks) {
    pkg.dependencies.express = "^4.18.2";
    if (options.template === "typescript") {
      pkg.devDependencies["@types/express"] = "^4.17.21";
    }
  }

  if (options.testing) {
    pkg.devDependencies.jest = "^29.7.0";
    pkg.scripts.test = "jest";
    pkg.scripts["test:watch"] = "jest --watch";
    pkg.scripts["test:coverage"] = "jest --coverage";

    if (options.template === "typescript") {
      pkg.devDependencies["ts-jest"] = "^29.1.1";
      pkg.devDependencies["@types/jest"] = "^29.5.8";
    }
  }

  if (options.linting) {
    pkg.devDependencies.eslint = "^8.56.0";
    pkg.devDependencies.prettier = "^3.1.0";
    pkg.scripts.lint =
      options.template === "typescript"
        ? "eslint . --ext .ts"
        : "eslint . --ext .js";
    pkg.scripts["lint:fix"] =
      options.template === "typescript"
        ? "eslint . --ext .ts --fix"
        : "eslint . --ext .js --fix";
    pkg.scripts.format = "prettier --write .";

    if (options.template === "typescript") {
      pkg.devDependencies["@typescript-eslint/eslint-plugin"] = "^6.13.0";
      pkg.devDependencies["@typescript-eslint/parser"] = "^6.13.0";
    }
  }

  if (options.template === "typescript") {
    pkg.devDependencies.typescript = "^5.3.0";
    pkg.devDependencies["@types/node"] = "^20.0.0";
  }

  // Add bot-type specific dependencies
  switch (options.botType) {
    case "music":
      pkg.dependencies["@discordjs/voice"] = "^0.16.0";
      pkg.dependencies.ytdl = "^1.0.9";
      pkg.dependencies["play-dl"] = "^1.9.7";
      break;
    case "economy":
      pkg.dependencies["quick.db"] = "^9.1.7";
      break;
    case "gaming":
      pkg.dependencies.canvas = "^2.11.2";
      break;
    case "ai":
      pkg.dependencies.openai = "^4.20.1";
      break;
    case "moderation":
      pkg.dependencies["bad-words"] = "^3.0.4";
      break;
    case "utility":
      pkg.dependencies.moment = "^2.29.4";
      break;
  }

  return pkg;
}
