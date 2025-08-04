// Package.json generator for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generatePackageJson(projectName: string, options: InitOptions) {
  const pkg: any = {
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
    pkg.dependencies.sqlite3 = "^5.1.6";
    pkg.dependencies.sqlite = "^5.1.1";
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
  if (options.botType === "music") {
    pkg.dependencies["@discordjs/voice"] = "^0.16.0";
    pkg.dependencies.ytdl = "^1.0.9";
    pkg.dependencies["play-dl"] = "^1.9.7";
  }

  return pkg;
}
