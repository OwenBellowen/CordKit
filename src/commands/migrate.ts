// CordKit 'migrate' command implementation
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

interface MigrationTask {
  id: string;
  description: string;
  execute: (projectPath: string) => Promise<boolean>;
}

const migrations: MigrationTask[] = [
  {
    id: 'update-discord-js-v14',
    description: 'Update Discord.js to v14 and fix breaking changes',
    execute: async (projectPath: string) => {
      const packagePath = join(projectPath, 'package.json');
      if (!existsSync(packagePath)) return false;
      
      const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      // Update Discord.js version
      if (pkg.dependencies['discord.js']) {
        pkg.dependencies['discord.js'] = '^14.14.1';
      }
      
      writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
      
      // Update code files for v14 changes
      const files = ['index.ts', 'index.js'];
      for (const file of files) {
        const filePath = join(projectPath, file);
        if (existsSync(filePath)) {
          let content = readFileSync(filePath, 'utf-8');
          
          // Update imports
          content = content.replace(
            /import { Client, Intents }/g,
            'import { Client, GatewayIntentBits }'
          );
          
          // Update intents
          content = content.replace(
            /Intents\.FLAGS\.(\\w+)/g,
            'GatewayIntentBits.$1'
          );
          
          writeFileSync(filePath, content);
        }
      }
      
      return true;
    }
  },
  {
    id: 'add-bun-support',
    description: 'Add Bun runtime support and optimize scripts',
    execute: async (projectPath: string) => {
      const packagePath = join(projectPath, 'package.json');
      if (!existsSync(packagePath)) return false;
      
      const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      // Update scripts for Bun
      const isTypeScript = pkg.main?.endsWith('.ts') || pkg.devDependencies?.typescript;
      const mainFile = isTypeScript ? 'index.ts' : 'index.js';
      
      pkg.scripts = {
        ...pkg.scripts,
        start: `bun run ${mainFile}`,
        dev: `bun --watch ${mainFile}`
      };
      
      // Add type: module if not present
      if (!pkg.type) {
        pkg.type = 'module';
      }
      
      writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
      return true;
    }
  },
  {
    id: 'add-error-handling',
    description: 'Improve error handling and logging',
    execute: async (projectPath: string) => {
      const files = ['index.ts', 'index.js'];
      
      for (const file of files) {
        const filePath = join(projectPath, file);
        if (existsSync(filePath)) {
          let content = readFileSync(filePath, 'utf-8');
          
          // Add unhandled rejection handler if not present
          if (!content.includes('unhandledRejection')) {
            const errorHandler = `
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

`;
            content = errorHandler + content;
            writeFileSync(filePath, content);
          }
        }
      }
      
      return true;
    }
  },
  {
    id: 'modernize-tsconfig',
    description: 'Update TypeScript configuration for modern standards',
    execute: async (projectPath: string) => {
      const tsconfigPath = join(projectPath, 'tsconfig.json');
      if (!existsSync(tsconfigPath)) return false;
      
      const modernConfig = {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
          resolveJsonModule: true,
          noEmit: true
        },
        include: ['**/*.ts'],
        exclude: ['node_modules', 'dist']
      };
      
      writeFileSync(tsconfigPath, JSON.stringify(modernConfig, null, 2));
      return true;
    }
  },
  {
    id: 'add-security-features',
    description: 'Add security best practices and rate limiting',
    execute: async (projectPath: string) => {
      const securityPath = join(projectPath, 'utils', 'security.ts');
      const utilsDir = join(projectPath, 'utils');
      
      if (!existsSync(utilsDir)) {
        mkdirSync(utilsDir, { recursive: true });
      }
      
      const securityUtils = `// Security utilities
import { User, GuildMember } from 'discord.js';

interface RateLimitData {
  count: number;
  resetTime: number;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private rateLimits = new Map<string, RateLimitData>();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS = 10;

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimits.set(userId, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (userLimit.count >= this.MAX_REQUESTS) {
      return false;
    }

    userLimit.count++;
    this.rateLimits.set(userId, userLimit);
    return true;
  }

  validatePermissions(member: GuildMember, requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => 
      member.permissions.has(permission as any)
    );
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  isValidSnowflake(id: string): boolean {
    return /^\\d{17,19}$/.test(id);
  }
}`;
      
      writeFileSync(securityPath, securityUtils);
      return true;
    }
  }
];

export const migrateCommand = new Command('migrate')
  .description('Migrate and update existing CordKit projects')
  .option('-p, --path <path>', 'Path to the project directory', '.')
  .option('-l, --list', 'List available migrations')
  .option('-a, --all', 'Run all available migrations')
  .option('-s, --specific <id>', 'Run a specific migration')
  .option('--dry-run', 'Show what would be changed without making changes')
  .action(async (opts: any) => {
    const projectPath = opts.path;
    
    if (!existsSync(join(projectPath, 'package.json'))) {
      console.error('❌ No package.json found. Are you in a project directory?');
      process.exit(1);
    }
    
    if (opts.list) {
      listMigrations();
      return;
    }
    
    if (opts.all) {
      await runAllMigrations(projectPath, opts.dryRun);
      return;
    }
    
    if (opts.specific) {
      await runSpecificMigration(projectPath, opts.specific, opts.dryRun);
      return;
    }
    
    // Default: show help
    console.log('🔄 CordKit Migration Tool\n');
    console.log('Commands:');
    console.log('  --list                List available migrations');
    console.log('  --all                 Run all available migrations');
    console.log('  --specific <id>       Run a specific migration');
    console.log('  --dry-run             Preview changes without applying them');
    console.log('\nExample: cordkit migrate --all --dry-run');
  });

function listMigrations() {
  console.log('🔄 Available Migrations\n');
  
  migrations.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration.id}`);
    console.log(`   ${migration.description}\n`);
  });
  
  console.log('💡 Run with: cordkit migrate --specific <id>');
}

async function runAllMigrations(projectPath: string, dryRun: boolean) {
  console.log(`🔄 ${dryRun ? 'Previewing' : 'Running'} all migrations...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const migration of migrations) {
    try {
      console.log(`📦 ${migration.description}...`);
      
      if (!dryRun) {
        const success = await migration.execute(projectPath);
        if (success) {
          console.log(`  ✅ Completed: ${migration.id}`);
          successCount++;
        } else {
          console.log(`  ⚠️ Skipped: ${migration.id} (not applicable)`);
        }
      } else {
        console.log(`  👀 Would run: ${migration.id}`);
        successCount++;
      }
    } catch (error) {
      console.error(`  ❌ Failed: ${migration.id} - ${error}`);
      failCount++;
    }
    console.log('');
  }
  
  console.log(`🎉 Migration ${dryRun ? 'preview' : 'execution'} complete!`);
  console.log(`✅ Successful: ${successCount}`);
  if (failCount > 0) console.log(`❌ Failed: ${failCount}`);
  
  if (dryRun) {
    console.log('\n💡 Run without --dry-run to apply changes');
  } else {
    console.log('\n💡 Run "bun install" to install any new dependencies');
  }
}

async function runSpecificMigration(projectPath: string, migrationId: string, dryRun: boolean) {
  const migration = migrations.find(m => m.id === migrationId);
  
  if (!migration) {
    console.error(`❌ Migration '${migrationId}' not found.`);
    console.log('\nAvailable migrations:');
    migrations.forEach(m => console.log(`  - ${m.id}`));
    process.exit(1);
  }
  
  console.log(`🔄 ${dryRun ? 'Previewing' : 'Running'} migration: ${migration.description}...\n`);
  
  try {
    if (!dryRun) {
      const success = await migration.execute(projectPath);
      if (success) {
        console.log(`✅ Migration completed: ${migration.id}`);
      } else {
        console.log(`⚠️ Migration not applicable: ${migration.id}`);
      }
    } else {
      console.log(`👀 Would run migration: ${migration.id}`);
      console.log(`📝 ${migration.description}`);
    }
  } catch (error) {
    console.error(`❌ Migration failed: ${error}`);
    process.exit(1);
  }
}
