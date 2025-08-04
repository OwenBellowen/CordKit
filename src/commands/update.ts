// CordKit 'update' command implementation
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const updateCommand = new Command('update')
  .description('Update an existing CordKit project')
  .option('-p, --path <path>', 'Path to the project directory', '.')
  .option('--dependencies', 'Update dependencies to latest versions')
  .option('--scripts', 'Update package.json scripts')
  .option('--config', 'Update configuration files')
  .action((opts: any) => {
    const projectPath = opts.path;
    const packageJsonPath = join(projectPath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.error('❌ No package.json found. Are you in a CordKit project?');
      process.exit(1);
    }
    
    console.log('🔄 Updating CordKit project...\n');
    
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (opts.dependencies || (!opts.dependencies && !opts.scripts && !opts.config)) {
        console.log('📦 Updating dependencies...');
        updateDependencies(pkg);
        writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Dependencies updated');
      }
      
      if (opts.scripts || (!opts.dependencies && !opts.scripts && !opts.config)) {
        console.log('📜 Updating scripts...');
        updateScripts(pkg);
        writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Scripts updated');
      }
      
      if (opts.config || (!opts.dependencies && !opts.scripts && !opts.config)) {
        console.log('⚙️ Updating configuration...');
        updateConfig(projectPath);
        console.log('✅ Configuration updated');
      }
      
      console.log('\n🎉 Project updated successfully!');
      console.log('💡 Run "bun install" to install updated dependencies');
      
    } catch (err) {
      console.error('❌ Error updating project:', err);
      process.exit(1);
    }
  });

function updateDependencies(pkg: any) {
  // Update Discord.js and common dependencies to latest versions
  if (pkg.dependencies) {
    if (pkg.dependencies['discord.js']) {
      pkg.dependencies['discord.js'] = '^14.14.1';
    }
    if (pkg.dependencies['dotenv']) {
      pkg.dependencies['dotenv'] = '^16.3.1';
    }
    if (pkg.dependencies['winston']) {
      pkg.dependencies['winston'] = '^3.11.0';
    }
    if (pkg.dependencies['sqlite3']) {
      pkg.dependencies['sqlite3'] = '^5.1.6';
    }
  }
  
  if (pkg.devDependencies) {
    if (pkg.devDependencies['typescript']) {
      pkg.devDependencies['typescript'] = '^5.3.0';
    }
    if (pkg.devDependencies['@types/node']) {
      pkg.devDependencies['@types/node'] = '^20.0.0';
    }
    if (pkg.devDependencies['eslint']) {
      pkg.devDependencies['eslint'] = '^8.56.0';
    }
    if (pkg.devDependencies['prettier']) {
      pkg.devDependencies['prettier'] = '^3.1.0';
    }
  }
}

function updateScripts(pkg: any) {
  if (!pkg.scripts) pkg.scripts = {};
  
  // Ensure Bun-optimized scripts
  const isTypeScript = pkg.main?.endsWith('.ts') || pkg.devDependencies?.typescript;
  const mainFile = isTypeScript ? 'index.ts' : 'index.js';
  
  pkg.scripts.start = `bun run ${mainFile}`;
  pkg.scripts.dev = `bun --watch ${mainFile}`;
  
  if (pkg.devDependencies?.eslint) {
    pkg.scripts.lint = 'eslint . --ext .ts,.js';
    pkg.scripts['lint:fix'] = 'eslint . --ext .ts,.js --fix';
  }
  
  if (pkg.devDependencies?.prettier) {
    pkg.scripts.format = 'prettier --write .';
  }
  
  if (pkg.devDependencies?.jest) {
    pkg.scripts.test = 'jest';
    pkg.scripts['test:watch'] = 'jest --watch';
  }
}

function updateConfig(projectPath: string) {
  const tsConfigPath = join(projectPath, 'tsconfig.json');
  
  if (existsSync(tsConfigPath)) {
    const modernTsConfig = {
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
    
    writeFileSync(tsConfigPath, JSON.stringify(modernTsConfig, null, 2));
  }
}
