// CordKit 'dashboard' command implementation
import { Command } from "commander";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import chalk from "chalk";

interface ProjectStats {
  name: string;
  version: string;
  template: "typescript" | "javascript";
  features: string[];
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  scripts: { [key: string]: string };
  fileCount: number;
  totalLines: number;
  lastModified: Date;
  botType?: string;
}

export const dashboardCommand = new Command("dashboard")
  .description("Show project analytics and insights")
  .option("-p, --path <path>", "Path to the project directory", ".")
  .option("--detailed", "Show detailed analysis")
  .option("--json", "Output as JSON")
  .action((opts: any) => {
    const projectPath = opts.path;

    if (!existsSync(join(projectPath, "package.json"))) {
      console.error(
        chalk.red("❌ No package.json found. Are you in a CordKit project?"),
      );
      process.exit(1);
    }

    try {
      const stats = analyzeProject(projectPath);

      if (opts.json) {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        displayDashboard(stats, opts.detailed);
      }
    } catch (error) {
      console.error(chalk.red("❌ Error analyzing project:"), error);
      process.exit(1);
    }
  });

function analyzeProject(projectPath: string): ProjectStats {
  const packageJsonPath = join(projectPath, "package.json");
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  // Determine template type
  const isTypeScript =
    pkg.main?.endsWith(".ts") ||
    pkg.devDependencies?.typescript ||
    existsSync(join(projectPath, "tsconfig.json"));

  // Detect features
  const features: string[] = [];
  if (pkg.dependencies?.dotenv) features.push("dotenv");
  if (pkg.dependencies?.winston) features.push("logging");
  if (pkg.dependencies?.sqlite3 || pkg.dependencies?.sqlite)
    features.push("database");
  if (pkg.dependencies?.express) features.push("webhooks");
  if (pkg.devDependencies?.jest) features.push("testing");
  if (pkg.devDependencies?.eslint) features.push("linting");
  if (existsSync(join(projectPath, "Dockerfile"))) features.push("docker");
  if (existsSync(join(projectPath, "commands"))) features.push("commands");
  if (existsSync(join(projectPath, "slash-commands")))
    features.push("slash-commands");
  if (existsSync(join(projectPath, "plugins"))) features.push("plugins");

  // Check for music bot features
  if (pkg.dependencies?.["@discordjs/voice"] || pkg.dependencies?.["play-dl"]) {
    features.push("music");
  }

  // Detect bot type from keywords or features
  let botType = "general";
  if (pkg.keywords?.includes("music") || features.includes("music"))
    botType = "music";
  else if (features.includes("automod") || pkg.dependencies?.["bad-words"])
    botType = "moderation";
  else if (features.includes("economy") || features.includes("levels"))
    botType = "utility";

  // Count files and lines
  const { fileCount, totalLines } = countProjectFiles(
    projectPath,
    isTypeScript ? ".ts" : ".js",
  );

  // Get last modified date
  const stats = statSync(packageJsonPath);

  return {
    name: pkg.name,
    version: pkg.version,
    template: isTypeScript ? "typescript" : "javascript",
    features,
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {},
    scripts: pkg.scripts || {},
    fileCount,
    totalLines,
    lastModified: stats.mtime,
    botType,
  };
}

function countProjectFiles(
  projectPath: string,
  extension: string,
): { fileCount: number; totalLines: number } {
  let fileCount = 0;
  let totalLines = 0;

  const searchDirectories = [
    "",
    "commands",
    "slash-commands",
    "utils",
    "plugins",
    "database",
    "webhooks",
  ];

  for (const dir of searchDirectories) {
    const dirPath = join(projectPath, dir);
    if (!existsSync(dirPath)) continue;

    try {
      const files = readdirSync(dirPath);
      for (const file of files) {
        const filePath = join(dirPath, file);
        if (statSync(filePath).isFile() && file.endsWith(extension)) {
          fileCount++;
          try {
            const content = readFileSync(filePath, "utf-8");
            totalLines += content.split("\\n").length;
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  }

  return { fileCount, totalLines };
}

function displayDashboard(stats: ProjectStats, detailed: boolean) {
  console.log(chalk.blue.bold(`📊 CordKit Project Dashboard`));
  console.log(chalk.gray(`${"=".repeat(50)}\n`));

  // Basic Information
  console.log(
    `🤖 ${chalk.cyan("Project:")} ${chalk.white.bold(stats.name)} ${chalk.gray("v" + stats.version)}`,
  );
  console.log(
    `📝 ${chalk.cyan("Template:")} ${stats.template === "typescript" ? chalk.blue("📘 TypeScript") : chalk.yellow("📙 JavaScript")}`,
  );
  console.log(
    `🎯 ${chalk.cyan("Bot Type:")} ${getBotTypeEmoji(stats.botType)} ${chalk.green(stats.botType)}`,
  );
  console.log(
    `📅 ${chalk.cyan("Last Modified:")} ${chalk.white(stats.lastModified.toLocaleDateString())}`,
  );
  console.log("");

  // Code Statistics
  console.log(chalk.yellow.bold(`📈 Code Statistics:`));
  console.log(
    `   ${chalk.cyan("Files:")} ${chalk.white.bold(stats.fileCount)}`,
  );
  console.log(
    `   ${chalk.cyan("Lines of Code:")} ${chalk.white.bold(stats.totalLines.toLocaleString())}`,
  );
  console.log("");

  // Features
  console.log(chalk.yellow.bold(`⚡ Features (${stats.features.length}):`));
  if (stats.features.length > 0) {
    const featureRows = [];
    for (let i = 0; i < stats.features.length; i += 3) {
      const row = stats.features
        .slice(i, i + 3)
        .map((f) => getFeatureEmoji(f) + chalk.green(f))
        .join("  ");
      featureRows.push("   " + row);
    }
    console.log(featureRows.join("\\n"));
  } else {
    console.log(chalk.gray("   No additional features detected"));
  }
  console.log("");

  // Dependencies Overview
  const depCount = Object.keys(stats.dependencies).length;
  const devDepCount = Object.keys(stats.devDependencies).length;
  console.log(
    `📦 ${chalk.cyan("Dependencies:")} ${chalk.white.bold(depCount)} production, ${chalk.white.bold(devDepCount)} development`,
  );

  if (detailed) {
    console.log("");
    console.log(chalk.magenta.bold("📋 Detailed Analysis:"));
    console.log(chalk.gray("-".repeat(30)));

    // Scripts
    console.log("\\n" + chalk.yellow.bold("🚀 Available Scripts:"));
    Object.entries(stats.scripts).forEach(([name, command]) => {
      console.log(`   ${chalk.cyan(name)}: ${chalk.gray(command)}`);
    });

    // Key Dependencies
    console.log("\\n" + chalk.yellow.bold("📚 Key Dependencies:"));
    const keyDeps = [
      "discord.js",
      "dotenv",
      "winston",
      "sqlite3",
      "@discordjs/voice",
    ];
    keyDeps.forEach((dep) => {
      if (stats.dependencies[dep]) {
        console.log(
          `   ${chalk.cyan(dep)}: ${chalk.white(stats.dependencies[dep])}`,
        );
      }
    });

    // Development Tools
    console.log("\\n" + chalk.yellow.bold("🛠️ Development Tools:"));
    const devTools = ["typescript", "eslint", "prettier", "jest"];
    devTools.forEach((tool) => {
      if (stats.devDependencies[tool]) {
        console.log(
          `   ${chalk.cyan(tool)}: ${chalk.white(stats.devDependencies[tool])}`,
        );
      }
    });

    // Project Health
    console.log("\\n" + chalk.yellow.bold("🏥 Project Health:"));
    const healthChecks = checkProjectHealth(stats);
    healthChecks.forEach((check) => {
      console.log(`   ${check.status} ${chalk.white(check.message)}`);
    });
  }

  // Recommendations
  console.log("\\n" + chalk.green.bold("💡 Recommendations:"));
  const recommendations = generateRecommendations(stats);
  recommendations.forEach((rec) => {
    console.log(`   ${chalk.gray("•")} ${chalk.white(rec)}`);
  });
}

function getBotTypeEmoji(type?: string): string {
  const emojis: { [key: string]: string } = {
    general: "🤖",
    music: "🎵",
    moderation: "🛡️",
    utility: "🔧",
  };
  return emojis[type || "general"] || "🤖";
}

function getFeatureEmoji(feature: string): string {
  const emojis: { [key: string]: string } = {
    dotenv: "🔐",
    logging: "📝",
    database: "🗄️",
    webhooks: "🔗",
    testing: "🧪",
    linting: "🔍",
    docker: "🐳",
    commands: "⚡",
    "slash-commands": "🔗",
    plugins: "🔌",
    music: "🎵",
  };
  return emojis[feature] || "✨";
}

function checkProjectHealth(
  stats: ProjectStats,
): Array<{ status: string; message: string }> {
  const checks = [];

  // Check for essential dependencies
  if (stats.dependencies["discord.js"]) {
    const version = stats.dependencies["discord.js"];
    if (version.includes("14.")) {
      checks.push({ status: "✅", message: "Using Discord.js v14 (latest)" });
    } else {
      checks.push({
        status: "⚠️",
        message: "Discord.js version may be outdated",
      });
    }
  }

  // Check for TypeScript setup
  if (stats.template === "typescript") {
    if (stats.devDependencies.typescript) {
      checks.push({ status: "✅", message: "TypeScript properly configured" });
    } else {
      checks.push({
        status: "❌",
        message: "TypeScript missing from devDependencies",
      });
    }
  }

  // Check for testing
  if (stats.devDependencies.jest) {
    checks.push({ status: "✅", message: "Testing framework configured" });
  } else {
    checks.push({ status: "⚠️", message: "No testing framework detected" });
  }

  // Check for linting
  if (stats.devDependencies.eslint) {
    checks.push({ status: "✅", message: "Code linting configured" });
  } else {
    checks.push({ status: "⚠️", message: "No linting tool detected" });
  }

  // Check file count
  if (stats.fileCount > 20) {
    checks.push({
      status: "✅",
      message: "Well-structured project with multiple files",
    });
  } else if (stats.fileCount < 5) {
    checks.push({ status: "⚠️", message: "Minimal project structure" });
  }

  return checks;
}

function generateRecommendations(stats: ProjectStats): string[] {
  const recommendations = [];

  // Feature recommendations
  if (!stats.features.includes("logging")) {
    recommendations.push("Add logging with Winston for better debugging");
  }

  if (!stats.features.includes("database") && stats.botType !== "general") {
    recommendations.push("Consider adding a database for persistent data");
  }

  if (!stats.features.includes("testing")) {
    recommendations.push("Add Jest testing framework for code reliability");
  }

  if (!stats.features.includes("linting")) {
    recommendations.push("Add ESLint and Prettier for code quality");
  }

  if (!stats.features.includes("docker")) {
    recommendations.push("Add Docker support for easy deployment");
  }

  // Security recommendations
  if (!stats.features.includes("dotenv")) {
    recommendations.push(
      "Use dotenv for secure environment variable management",
    );
  }

  // Performance recommendations
  if (stats.totalLines > 1000 && stats.template === "javascript") {
    recommendations.push(
      "Consider migrating to TypeScript for better maintainability",
    );
  }

  // Deployment recommendations
  if (stats.features.includes("docker") && !stats.dependencies.express) {
    recommendations.push("Add health check endpoints for monitoring");
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your project looks great! Consider adding more features with plugins",
    );
  }

  return recommendations;
}
