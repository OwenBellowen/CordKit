// Utility functions for the generate command
import { existsSync } from "fs";
import { join } from "path";

export function detectProjectLanguage(
  projectPath: string,
): "typescript" | "javascript" {
  const packageJsonPath = join(projectPath, "package.json");
  if (existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    if (packageJson.devDependencies?.typescript) {
      return "typescript";
    }
  }
  return "javascript";
}

export interface GenerateOptions {
  type: "slash-command" | "event";
  name: string;
  description?: string;
  category?: string;
  permissions?: string[];
}
