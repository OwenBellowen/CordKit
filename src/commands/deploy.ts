// CordKit 'deploy' command implementation
import { Command } from 'commander';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

export const deployCommand = new Command('deploy')
  .description('Generate deployment configurations')
  .option('-p, --path <path>', 'Path to the project directory', '.')
  .option('--docker', 'Generate Docker configuration')
  .option('--railway', 'Generate Railway deployment config')
  .option('--heroku', 'Generate Heroku deployment config')
  .option('--pm2', 'Generate PM2 ecosystem file')
  .action((opts: any) => {
    const projectPath = opts.path;
    
    if (!existsSync(join(projectPath, 'package.json'))) {
      console.error('❌ No package.json found. Are you in a project directory?');
      process.exit(1);
    }
    
    console.log('🚀 Generating deployment configurations...\n');
    
    if (opts.docker || (!opts.docker && !opts.railway && !opts.heroku && !opts.pm2)) {
      generateDockerConfig(projectPath);
    }
    
    if (opts.railway) {
      generateRailwayConfig(projectPath);
    }
    
    if (opts.heroku) {
      generateHerokuConfig(projectPath);
    }
    
    if (opts.pm2) {
      generatePM2Config(projectPath);
    }
    
    console.log('\n✅ Deployment configurations generated successfully!');
  });

function generateDockerConfig(projectPath: string) {
  console.log('🐳 Generating Docker configuration...');
  
  const dockerfile = `FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (if needed for webhooks)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the bot
CMD ["bun", "run", "start"]`;

  const dockerCompose = `version: '3.8'

services:
  discord-bot:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./data:/app/data  # For persistent data like database
    # ports:
    #   - "3000:3000"  # Uncomment if using webhooks
    
  # Optional: Add a database service
  # database:
  #   image: postgres:15
  #   restart: unless-stopped
  #   environment:
  #     POSTGRES_DB: discordbot
  #     POSTGRES_USER: bot
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:`;

  const dockerIgnore = `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
Dockerfile
docker-compose.yml
.dockerignore`;

  writeFileSync(join(projectPath, 'Dockerfile'), dockerfile);
  writeFileSync(join(projectPath, 'docker-compose.yml'), dockerCompose);
  writeFileSync(join(projectPath, '.dockerignore'), dockerIgnore);
  
  console.log('  ✅ Dockerfile created');
  console.log('  ✅ docker-compose.yml created');
  console.log('  ✅ .dockerignore created');
}

function generateRailwayConfig(projectPath: string) {
  console.log('🚄 Generating Railway configuration...');
  
  const railwayConfig = {
    build: {
      builder: 'NIXPACKS'
    },
    deploy: {
      startCommand: 'bun run start',
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 10
    }
  };
  
  writeFileSync(join(projectPath, 'railway.json'), JSON.stringify(railwayConfig, null, 2));
  console.log('  ✅ railway.json created');
}

function generateHerokuConfig(projectPath: string) {
  console.log('🟣 Generating Heroku configuration...');
  
  const procfile = 'worker: bun run start';
  
  writeFileSync(join(projectPath, 'Procfile'), procfile);
  console.log('  ✅ Procfile created');
}

function generatePM2Config(projectPath: string) {
  console.log('⚡ Generating PM2 configuration...');
  
  const pm2Config = {
    apps: [{
      name: 'discord-bot',
      script: 'bun',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }]
  };
  
  writeFileSync(join(projectPath, 'ecosystem.config.js'), 
    `module.exports = ${JSON.stringify(pm2Config, null, 2)};`);
  console.log('  ✅ ecosystem.config.js created');
}
