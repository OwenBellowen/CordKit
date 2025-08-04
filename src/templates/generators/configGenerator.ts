// Configuration generators for CordKit projects
import type { InitOptions } from "../initTemplate";

interface TSConfig {
  compilerOptions: {
    target: string;
    module: string;
    moduleResolution: string;
    allowImportingTsExtensions: boolean;
    allowSyntheticDefaultImports: boolean;
    esModuleInterop: boolean;
    forceConsistentCasingInFileNames: boolean;
    strict: boolean;
    skipLibCheck: boolean;
    resolveJsonModule: boolean;
    noEmit: boolean;
  };
  include: string[];
  exclude: string[];
}

interface ESLintConfig {
  env: {
    node: boolean;
    es2022: boolean;
  };
  extends: string[];
  parserOptions: {
    ecmaVersion: string;
    sourceType: string;
  };
  rules: Record<string, string>;
  parser?: string;
  plugins?: string[];
}

interface PrettierConfig {
  semi: boolean;
  trailingComma: string;
  singleQuote: boolean;
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
}

export function generateTsConfig(): TSConfig {
  return {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      resolveJsonModule: true,
      noEmit: true,
    },
    include: ["**/*.ts"],
    exclude: ["node_modules"],
  };
}

export function generateESLintConfig(options: InitOptions): ESLintConfig {
  const baseConfig: ESLintConfig = {
    env: {
      node: true,
      es2022: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",
    },
  };

  if (options.template === "typescript") {
    baseConfig.extends.push("@typescript-eslint/recommended");
    baseConfig.parser = "@typescript-eslint/parser";
    baseConfig.plugins = ["@typescript-eslint"];
  }

  return baseConfig;
}

export function generatePrettierConfig(): PrettierConfig {
  return {
    semi: true,
    trailingComma: "es5",
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
  };
}

export function generatePrettierIgnore(): string {
  return `node_modules
coverage
dist
build
logs
*.log
.env*`;
}

export function generateGitignore(): string {
  return `# Dependencies
node_modules/
bun.lockb

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/

# Database
*.db
*.sqlite
*.sqlite3

# Testing
coverage/
.nyc_output/

# Docker
.dockerignore
`;
}
