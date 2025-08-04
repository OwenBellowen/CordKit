// Database migration generator for CordKit projects
import type { InitOptions } from "../initTemplate";

type DatabaseConnection = unknown;

export interface MigrationInterface {
  name: string;
  up: (db: DatabaseConnection) => Promise<void>;
  down: (db: DatabaseConnection) => Promise<void>;
}

// Generate migration interface definition
export function generateMigrationTypes(options: InitOptions): string {
  if (options.template === "typescript") {
    return `export interface MigrationInterface {
  name: string;
  up: (db: unknown) => Promise<void>;
  down: (db: unknown) => Promise<void>;
}

export interface MigrationConfig {
  directory: string;
  tableName: string;
}`;
  } else {
    return `/**
 * @typedef {Object} MigrationInterface
 * @property {string} name
 * @property {Function} up
 * @property {Function} down
 */

/**
 * @typedef {Object} MigrationConfig
 * @property {string} directory
 * @property {string} tableName
 */`;
  }
}

// Generate migration runner
export function generateMigrationRunner(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { MigrationInterface, MigrationConfig } from './types/migration';
import { databaseConfig } from './config/database';
${getMigrationImports(options.databaseType)}

interface MigrationConfig {
  directory: string;
  tableName: string;
}

interface MigrationRecord {
  name: string;
  applied_at: Date;
}

export class Migrator {
  private db: unknown;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    ${getMigrationDbConnection(options.databaseType)}
  }

  async ensureMigrationTable(): Promise<void> {
    ${getMigrationTableCreation(options.databaseType)}
  }

  async getMigratedNames(): Promise<string[]> {
    ${getMigratedNamesCode(options.databaseType)}
  }

  async loadMigrationFiles(): Promise<MigrationInterface[]> {
    const migrationPath = resolve(process.cwd(), this.config.directory);
    const files = await fs.readdir(migrationPath);
    
    const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.ts'))
      .sort(); // Sort to ensure migrations are applied in order
    
    const migrations: MigrationInterface[] = [];
    
    for (const file of jsFiles) {
      const migration = await import(join(migrationPath, file));
      // Get the export (could be default or named export)
      const migrationExport = migration.default || Object.values(migration)[0];
      migrations.push(migrationExport);
    }
    
    return migrations;
  }

  async up(): Promise<void> {
    await this.connect();
    await this.ensureMigrationTable();
    
    const appliedMigrations = await this.getMigratedNames();
    const migrations = await this.loadMigrationFiles();
    
    // Filter out already applied migrations
    const pendingMigrations = migrations.filter(m => !appliedMigrations.includes(m.name));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }
    
    // Apply each pending migration
    for (const migration of pendingMigrations) {
      try {
        console.log(\`Applying migration: \${migration.name}\`);
        await migration.up(this.db);
        await this.recordMigration(migration.name);
        console.log(\`✓ Applied migration: \${migration.name}\`);
      } catch (error) {
        console.error(\`Error applying migration \${migration.name}: \${error.message}\`);
        throw error;
      }
    }
  }

  async down(steps = 1): Promise<void> {
    await this.connect();
    await this.ensureMigrationTable();
    
    const appliedMigrations = await this.getMigratedNames();
    const migrations = await this.loadMigrationFiles();
    
    // Filter to only include applied migrations and sort in reverse order
    const reverseMigrations = migrations
      .filter(m => appliedMigrations.includes(m.name))
      .reverse()
      .slice(0, steps);
    
    if (reverseMigrations.length === 0) {
      console.log('No migrations to roll back');
      return;
    }
    
    // Roll back each migration
    for (const migration of reverseMigrations) {
      try {
        console.log(\`Rolling back migration: \${migration.name}\`);
        await migration.down(this.db);
        await this.removeMigrationRecord(migration.name);
        console.log(\`✓ Rolled back migration: \${migration.name}\`);
      } catch (error) {
        console.error(\`Error rolling back migration \${migration.name}: \${error.message}\`);
        throw error;
      }
    }
  }

  private async recordMigration(name: string): Promise<void> {
    ${getRecordMigrationCode(options.databaseType)}
  }

  private async removeMigrationRecord(name: string): Promise<void> {
    ${getRemoveMigrationCode(options.databaseType)}
  }

  async close(): Promise<void> {
    ${getCloseConnectionCode(options.databaseType)}
  }
}`;
  } else {
    return `const fs = require('fs').promises;
const path = require('path');
const { databaseConfig } = require('./config/database');
${getMigrationImports(options.databaseType, false)}

class Migrator {
  constructor(config) {
    this.config = config;
  }

  async connect() {
    ${getMigrationDbConnection(options.databaseType)}
  }

  async ensureMigrationTable() {
    ${getMigrationTableCreation(options.databaseType)}
  }

  async getMigratedNames() {
    ${getMigratedNamesCode(options.databaseType)}
  }

  async loadMigrationFiles() {
    const migrationPath = path.resolve(process.cwd(), this.config.directory);
    const files = await fs.readdir(migrationPath);
    
    const jsFiles = files.filter(file => file.endsWith('.js'))
      .sort(); // Sort to ensure migrations are applied in order
    
    const migrations = [];
    
    for (const file of jsFiles) {
      const migration = require(path.join(migrationPath, file));
      migrations.push(migration);
    }
    
    return migrations;
  }

  async up() {
    await this.connect();
    await this.ensureMigrationTable();
    
    const appliedMigrations = await this.getMigratedNames();
    const migrations = await this.loadMigrationFiles();
    
    // Filter out already applied migrations
    const pendingMigrations = migrations.filter(m => !appliedMigrations.includes(m.name));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }
    
    // Apply each pending migration
    for (const migration of pendingMigrations) {
      try {
        console.log(\`Applying migration: \${migration.name}\`);
        await migration.up(this.db);
        await this.recordMigration(migration.name);
        console.log(\`✓ Applied migration: \${migration.name}\`);
      } catch (error) {
        console.error(\`Error applying migration \${migration.name}: \${error.message}\`);
        throw error;
      }
    }
  }

  async down(steps = 1) {
    await this.connect();
    await this.ensureMigrationTable();
    
    const appliedMigrations = await this.getMigratedNames();
    const migrations = await this.loadMigrationFiles();
    
    // Filter to only include applied migrations and sort in reverse order
    const reverseMigrations = migrations
      .filter(m => appliedMigrations.includes(m.name))
      .reverse()
      .slice(0, steps);
    
    if (reverseMigrations.length === 0) {
      console.log('No migrations to roll back');
      return;
    }
    
    // Roll back each migration
    for (const migration of reverseMigrations) {
      try {
        console.log(\`Rolling back migration: \${migration.name}\`);
        await migration.down(this.db);
        await this.removeMigrationRecord(migration.name);
        console.log(\`✓ Rolled back migration: \${migration.name}\`);
      } catch (error) {
        console.error(\`Error rolling back migration \${migration.name}: \${error.message}\`);
        throw error;
      }
    }
  }

  async recordMigration(name) {
    ${getRecordMigrationCode(options.databaseType, false)}
  }

  async removeMigrationRecord(name) {
    ${getRemoveMigrationCode(options.databaseType, false)}
  }

  async close() {
    ${getCloseConnectionCode(options.databaseType)}
  }
}

module.exports = {
  Migrator
};`;
  }
}

// Generate migration template file
export function generateMigrationTemplate(options: InitOptions): string {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "");

  if (options.template === "typescript") {
    return `import { MigrationInterface } from '../types/migration';

export const migration_${timestamp}: MigrationInterface = {
  name: 'migration_${timestamp}',
  
  async up(db) {
    // Add your migration code here
    // This will be executed when migrating up
    ${getMigrationUpCode(options.databaseType)}
  },

  async down(db) {
    // Add your rollback code here
    // This will be executed when rolling back the migration
    ${getMigrationDownCode(options.databaseType)}
  }
};`;
  } else {
    return `/**
 * @type {import('../types/migration').MigrationInterface}
 */
const migration_${timestamp} = {
  name: 'migration_${timestamp}',
  
  async up(db) {
    // Add your migration code here
    // This will be executed when migrating up
    ${getMigrationUpCode(options.databaseType)}
  },

  async down(db) {
    // Add your rollback code here
    // This will be executed when rolling back the migration
    ${getMigrationDownCode(options.databaseType)}
  }
};

module.exports = migration_${timestamp};`;
  }
}

// Helper function to generate the necessary imports for each database type
function getMigrationImports(
  dbType: string,
  isTypescript: boolean = true,
): string {
  if (isTypescript) {
    switch (dbType) {
      case "sqlite":
        return "import { open } from 'sqlite';";
      case "postgres":
        return "import { Pool } from 'pg';";
      case "mysql":
        return "import mysql from 'mysql2/promise';";
      case "mongodb":
      case "mongoose":
        return "import { MongoClient } from 'mongodb';";
      case "redis":
        return "import Redis from 'ioredis';";
      case "prisma":
        return "import { PrismaClient } from '@prisma/client';";
      default:
        return "";
    }
  } else {
    switch (dbType) {
      case "sqlite":
        return "const { open } = require('sqlite');";
      case "postgres":
        return "const { Pool } = require('pg');";
      case "mysql":
        return "const mysql = require('mysql2/promise');";
      case "mongodb":
      case "mongoose":
        return "const { MongoClient } = require('mongodb');";
      case "redis":
        return "const Redis = require('ioredis');";
      case "prisma":
        return "const { PrismaClient } = require('@prisma/client');";
      default:
        return "";
    }
  }
}

// Helper function to generate DB connection code for each database type
function getMigrationDbConnection(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `const sqlite3 = require('sqlite3');
    this.db = await open({
      filename: databaseConfig.database,
      driver: sqlite3.Database
    });`;
    case "postgres":
      return `this.db = new Pool({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      ssl: databaseConfig.ssl
    });`;
    case "mysql":
      return `this.db = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database
    });`;
    case "mongodb":
    case "mongoose":
      return `const client = new MongoClient(databaseConfig.url);
    await client.connect();
    this.db = client.db();
    this.client = client; // Store client reference for closing later`;
    case "redis":
      return `this.db = new Redis({
      host: databaseConfig.host,
      port: databaseConfig.port,
      password: databaseConfig.password
    });`;
    case "prisma":
      return `this.db = new PrismaClient();`;
    default:
      return "// Connect to your database here";
  }
}

// Helper function to generate migration table creation code
function getMigrationTableCreation(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `await this.db.exec(\`
      CREATE TABLE IF NOT EXISTS \${this.config.tableName} (
        name TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    \`);`;
    case "postgres":
      return `await this.db.query(\`
      CREATE TABLE IF NOT EXISTS \${this.config.tableName} (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);`;
    case "mysql":
      return `await this.db.execute(\`
      CREATE TABLE IF NOT EXISTS \${this.config.tableName} (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);`;
    case "mongodb":
    case "mongoose":
      return `await this.db.collection(this.config.tableName).createIndex({ name: 1 }, { unique: true });`;
    case "redis":
      return `// Redis doesn't need a migration table in the traditional sense
    // We'll use a Set to store migration names
    if (!await this.db.exists(this.config.tableName)) {
      await this.db.sadd(this.config.tableName, 'init');
    }`;
    case "prisma":
      return `// For Prisma, migrations are handled by the Prisma CLI
    // This is just for tracking migrations in our custom system
    try {
      await this.db.$executeRawUnsafe(\`
        CREATE TABLE IF NOT EXISTS \${this.config.tableName} (
          name VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`);
    } catch (e) {
      console.warn('Could not create migration table via Prisma. Prisma migrations should be used instead.');
    }`;
    default:
      return "// Create migration table for your database";
  }
}

// Helper function to get migrated names code
function getMigratedNamesCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `const rows = await this.db.all(\`SELECT name FROM \${this.config.tableName}\`);
    return rows.map(row => row.name);`;
    case "postgres":
      return `const result = await this.db.query(\`SELECT name FROM \${this.config.tableName}\`);
    return result.rows.map(row => row.name);`;
    case "mysql":
      return `const [rows] = await this.db.execute(\`SELECT name FROM \${this.config.tableName}\`);
    return rows.map(row => row.name);`;
    case "mongodb":
    case "mongoose":
      return `const records = await this.db.collection(this.config.tableName).find({}).toArray();
    return records.map(record => record.name);`;
    case "redis":
      return `const members = await this.db.smembers(this.config.tableName);
    return members.filter(name => name !== 'init');`;
    case "prisma":
      return `try {
      const result = await this.db.$queryRawUnsafe(\`SELECT name FROM \${this.config.tableName}\`);
      return result.map((row: { name: string }) => row.name);
    } catch (e) {
      console.warn('Error reading from migration table. Using empty list.');
      return [];
    }`;
    default:
      return `return [];`;
  }
}

// Helper function to get record migration code
function getRecordMigrationCode(
  dbType: string,
  isTypescript: boolean = true,
): string {
  switch (dbType) {
    case "sqlite":
      return `await this.db.run(
      \`INSERT INTO \${this.config.tableName} (name) VALUES (?)\`,
      name
    );`;
    case "postgres":
      return `await this.db.query(
      \`INSERT INTO \${this.config.tableName} (name) VALUES ($1)\`,
      [name]
    );`;
    case "mysql":
      return `await this.db.execute(
      \`INSERT INTO \${this.config.tableName} (name) VALUES (?)\`,
      [name]
    );`;
    case "mongodb":
    case "mongoose":
      return `await this.db.collection(this.config.tableName).insertOne({
      name,
      applied_at: new Date()
    });`;
    case "redis":
      return `await this.db.sadd(this.config.tableName, name);`;
    case "prisma":
      return `try {
      await this.db.$executeRawUnsafe(
        \`INSERT INTO \${this.config.tableName} (name) VALUES (?)\`,
        name
      );
    } catch (e) {
      console.warn(\`Could not record migration \${name}: \${e.message}\`);
    }`;
    default:
      return `// Record migration in your database`;
  }
}

// Helper function to get remove migration record code
function getRemoveMigrationCode(
  dbType: string,
  isTypescript: boolean = true,
): string {
  switch (dbType) {
    case "sqlite":
      return `await this.db.run(
      \`DELETE FROM \${this.config.tableName} WHERE name = ?\`,
      name
    );`;
    case "postgres":
      return `await this.db.query(
      \`DELETE FROM \${this.config.tableName} WHERE name = $1\`,
      [name]
    );`;
    case "mysql":
      return `await this.db.execute(
      \`DELETE FROM \${this.config.tableName} WHERE name = ?\`,
      [name]
    );`;
    case "mongodb":
    case "mongoose":
      return `await this.db.collection(this.config.tableName).deleteOne({ name });`;
    case "redis":
      return `await this.db.srem(this.config.tableName, name);`;
    case "prisma":
      return `try {
      await this.db.$executeRawUnsafe(
        \`DELETE FROM \${this.config.tableName} WHERE name = ?\`,
        name
      );
    } catch (e) {
      console.warn(\`Could not remove migration record \${name}: \${e.message}\`);
    }`;
    default:
      return `// Remove migration record from your database`;
  }
}

// Helper function to get close connection code
function getCloseConnectionCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `await this.db.close();`;
    case "postgres":
      return `await this.db.end();`;
    case "mysql":
      return `await this.db.end();`;
    case "mongodb":
    case "mongoose":
      return `await this.client.close();`;
    case "redis":
      return `this.db.disconnect();`;
    case "prisma":
      return `await this.db.$disconnect();`;
    default:
      return `// Close your database connection`;
  }
}

// Helper function to generate sample UP migration code based on db type
function getMigrationUpCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `await db.exec(\`
    CREATE TABLE IF NOT EXISTS example (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  \`);`;
    case "postgres":
    case "mysql":
      return `await db.query(\`
    CREATE TABLE IF NOT EXISTS example (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);`;
    case "mongodb":
    case "mongoose":
      return `await db.collection('example').createIndex({ name: 1 }, { unique: true });`;
    case "redis":
      return `// Redis doesn't support schema migrations directly
    // Consider using this for cache invalidation or key structure changes
    const keys = await db.keys('old_prefix:*');
    for (const key of keys) {
      const value = await db.get(key);
      const newKey = key.replace('old_prefix:', 'new_prefix:');
      await db.set(newKey, value);
      await db.del(key);
    }`;
    case "prisma":
      return `// For Prisma, you should edit your schema.prisma file
    // and then run 'npx prisma migrate dev --name migration_name'
    console.log('This is a placeholder. For Prisma, use the Prisma CLI directly.');`;
    default:
      return `// Add your migration code here`;
  }
}

// Helper function to generate sample DOWN migration code based on db type
function getMigrationDownCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
    case "postgres":
    case "mysql":
      return `await db.query('DROP TABLE IF EXISTS example;');`;
    case "mongodb":
    case "mongoose":
      return `await db.collection('example').dropIndex({ name: 1 });`;
    case "redis":
      return `// Redis rollback strategy
    const keys = await db.keys('new_prefix:*');
    for (const key of keys) {
      const value = await db.get(key);
      const oldKey = key.replace('new_prefix:', 'old_prefix:');
      await db.set(oldKey, value);
      await db.del(key);
    }`;
    case "prisma":
      return `// For Prisma, rollbacks are handled by the Prisma CLI
    console.log('This is a placeholder. For Prisma, use the Prisma CLI directly.');`;
    default:
      return `// Add your rollback code here`;
  }
}
