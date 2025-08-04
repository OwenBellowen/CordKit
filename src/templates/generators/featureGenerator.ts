// Feature generators for CordKit projects (logging, webhooks, docker, testing)
import type { InitOptions } from "../initTemplate";

export function generateLogger(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'discord-bot' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;`;
  } else {
    return `const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'discord-bot' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;`;
  }
}

export function generateWebhook(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;

app.use(express.json());

// Webhook verification middleware
function verifySignature(req: any, res: any, next: any) {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return res.status(401).send('Unauthorized');
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const digest = 'sha256=' + hmac.digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Unauthorized');
  }
  
  next();
}

// Discord webhook endpoint
app.post('/webhook/discord', verifySignature, (req, res) => {
  console.log('Received Discord webhook:', req.body);
  
  // Process webhook payload here
  
  res.status(200).send('OK');
});

// GitHub webhook endpoint (example)
app.post('/webhook/github', verifySignature, (req, res) => {
  console.log('Received GitHub webhook:', req.body);
  
  // Process GitHub events here
  
  res.status(200).send('OK');
});

export function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(\`Webhook server running on port \${PORT}\`);
  });
}`;
  } else {
    return `const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;

app.use(express.json());

// Webhook verification middleware
function verifySignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return res.status(401).send('Unauthorized');
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const digest = 'sha256=' + hmac.digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Unauthorized');
  }
  
  next();
}

// Discord webhook endpoint
app.post('/webhook/discord', verifySignature, (req, res) => {
  console.log('Received Discord webhook:', req.body);
  
  // Process webhook payload here
  
  res.status(200).send('OK');
});

// GitHub webhook endpoint (example)
app.post('/webhook/github', verifySignature, (req, res) => {
  console.log('Received GitHub webhook:', req.body);
  
  // Process GitHub events here
  
  res.status(200).send('OK');
});

function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(\`Webhook server running on port \${PORT}\`);
  });
}

module.exports = { startWebhookServer };`;
  }
}

export function generateDockerfile(): string {
  return `FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p logs data

# Expose port for webhooks
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the bot
CMD ["bun", "run", "start"]`;
}

export function generateDockerCompose(): string {
  return `version: '3.8'

services:
  discord-bot:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    ports:
      - "3000:3000"
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  redis_data:`;
}

export function generateDockerIgnore(): string {
  return `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
Dockerfile
docker-compose.yml
.dockerignore
logs/
data/
coverage/
.nyc_output/`;
}

export function generateTestConfig(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;`;
  } else {
    return `module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};`;
  }
}

export function generateSampleTest(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { describe, test, expect } from '@jest/globals';

describe('Discord Bot', () => {
  test('should initialize properly', () => {
    expect(true).toBe(true);
  });

  test('ping command should respond with pong', async () => {
    // Mock Discord message
    const mockMessage = {
      reply: jest.fn().mockResolvedValue({
        createdTimestamp: Date.now() + 100,
        edit: jest.fn()
      }),
      createdTimestamp: Date.now()
    };

    // Test ping command logic here
    expect(mockMessage.reply).toBeDefined();
  });
});`;
  } else {
    return `const { describe, test, expect } = require('@jest/globals');

describe('Discord Bot', () => {
  test('should initialize properly', () => {
    expect(true).toBe(true);
  });

  test('ping command should respond with pong', async () => {
    // Mock Discord message
    const mockMessage = {
      reply: jest.fn().mockResolvedValue({
        createdTimestamp: Date.now() + 100,
        edit: jest.fn()
      }),
      createdTimestamp: Date.now()
    };

    // Test ping command logic here
    expect(mockMessage.reply).toBeDefined();
  });
});`;
  }
}
