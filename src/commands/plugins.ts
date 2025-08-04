// CordKit 'plugins' command implementation
import { Command } from "commander";
import { existsSync, writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import type { Plugin } from "../plugins/plugin-definitions";
import { availablePlugins } from "../plugins/plugin-definitions";

export const pluginsCommand = new Command("plugins")
  .description("Manage bot plugins and extensions")
  .option("-l, --list", "List available plugins")
  .option("-i, --install <plugin>", "Install a plugin")
  .option("-r, --remove <plugin>", "Remove a plugin")
  .option("-p, --path <path>", "Path to the project directory", ".")
  .action((opts: any) => {
    const projectPath = opts.path;

    if (opts.list) {
      listPlugins();
      return;
    }

    if (opts.install) {
      installPlugin(opts.install, projectPath);
      return;
    }

    if (opts.remove) {
      removePlugin(opts.remove, projectPath);
      return;
    }

    // Default: show help
    console.log(chalk.blue.bold("🔌 CordKit Plugins\n"));
    console.log(chalk.cyan("Available commands:"));
    console.log(
      chalk.white("  --list              ") +
        chalk.gray("List available plugins"),
    );
    console.log(
      chalk.white("  --install <plugin>  ") + chalk.gray("Install a plugin"),
    );
    console.log(
      chalk.white("  --remove <plugin>   ") + chalk.gray("Remove a plugin"),
    );
    console.log(
      chalk.white("  --path <path>       ") +
        chalk.gray("Specify project path"),
    );
    console.log(
      chalk.green("\nExample: ") +
        chalk.yellow("cordkit plugins --install economy"),
    );
  });

function listPlugins() {
  console.log(chalk.blue.bold("🔌 Available CordKit Plugins\n"));

  Object.entries(availablePlugins).forEach(([key, plugin]) => {
    console.log(
      chalk.magenta.bold(`📦 ${plugin.name}`) + chalk.gray(` (${key})`),
    );
    console.log(chalk.white(`   ${plugin.description}`));
    console.log("");
  });

  console.log(
    chalk.green("💡 Install with: ") +
      chalk.yellow("cordkit plugins --install <plugin-name>"),
  );
}

function installPlugin(pluginName: string, projectPath: string) {
  const plugin = availablePlugins[pluginName];

  if (!plugin) {
    console.error(
      chalk.red(
        `❌ Plugin '${pluginName}' not found. Use --list to see available plugins.`,
      ),
    );
    process.exit(1);
  }

  if (!existsSync(join(projectPath, "package.json"))) {
    console.error(
      chalk.red("❌ No package.json found. Are you in a CordKit project?"),
    );
    process.exit(1);
  }

  console.log(
    chalk.cyan(`🔌 Installing plugin: `) +
      chalk.magenta.bold(plugin.name) +
      chalk.cyan("..."),
  );

  // Create plugins directory if it doesn't exist
  const pluginsDir = join(projectPath, "plugins");
  if (!existsSync(pluginsDir)) {
    mkdirSync(pluginsDir, { recursive: true });
  }

  // Install plugin files
  Object.entries(plugin.files).forEach(([filePath, content]) => {
    const fullPath = join(projectPath, filePath);
    const dir = join(fullPath, "..");

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, content);
    console.log(chalk.green(`  ✅ Created `) + chalk.white(filePath));
  });

  // Update package.json with dependencies
  if (plugin.dependencies || plugin.devDependencies || plugin.scripts) {
    const packageJsonPath = join(projectPath, "package.json");
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    if (plugin.dependencies) {
      pkg.dependencies = { ...pkg.dependencies, ...plugin.dependencies };
    }

    if (plugin.devDependencies) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        ...plugin.devDependencies,
      };
    }

    if (plugin.scripts) {
      pkg.scripts = { ...pkg.scripts, ...plugin.scripts };
    }

    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    console.log(chalk.green("  ✅ Updated ") + chalk.white("package.json"));
  }

  console.log(
    chalk.green.bold(`\n🎉 Plugin '${plugin.name}' installed successfully!`),
  );
  console.log(chalk.yellow('💡 Run "bun install" to install new dependencies'));
}

function removePlugin(pluginName: string, projectPath: string) {
  const plugin = availablePlugins[pluginName];

  if (!plugin) {
    console.error(`❌ Plugin '${pluginName}' not found.`);
    process.exit(1);
  }

  console.log(`🗑️ Removing plugin: ${plugin.name}...`);

  // Remove plugin files
  Object.keys(plugin.files).forEach((filePath) => {
    const fullPath = join(projectPath, filePath);
    if (existsSync(fullPath)) {
      writeFileSync(fullPath, ""); // Clear file content
      console.log(`  ✅ Removed ${filePath}`);
    }
  });

  console.log(`\n🎉 Plugin '${plugin.name}' removed successfully!`);
}
