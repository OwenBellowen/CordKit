// Database generators for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generateDatabaseSchema(options: InitOptions): string {
  switch (options.databaseType) {
    case "postgres":
      return generatePostgresSchema(options);
    case "mysql":
      return generateMySQLSchema(options);
    case "mongodb":
      return generateMongoDBSchema(options);
    case "redis":
      return generateRedisSchema(options);
    case "prisma":
      return generatePrismaSchema(options);
    case "mongoose":
      return generateMongooseSchema(options);
    case "sqlite":
    default:
      return generateSQLiteSchema(options);
  }
}

// Generate database configuration file
export function generateDatabaseConfig(options: InitOptions): string {
  if (options.template === "typescript") {
    return `// Database configuration
export interface DatabaseConfig {
  type: '${options.databaseType}';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  url?: string;
  ssl?: boolean;
}

export const databaseConfig: DatabaseConfig = {
  type: '${options.databaseType}',
  ${getDatabaseConfigFields(options.databaseType)}
};

// Migration configuration
export interface MigrationConfig {
  directory: string;
  tableName: string;
}

export const migrationConfig: MigrationConfig = {
  directory: './migrations',
  tableName: 'migrations'
};`;
  } else {
    return `// Database configuration
const databaseConfig = {
  type: '${options.databaseType}',
  ${getDatabaseConfigFields(options.databaseType)}
};

// Migration configuration
const migrationConfig = {
  directory: './migrations',
  tableName: 'migrations'
};

module.exports = {
  databaseConfig,
  migrationConfig
};`;
  }
}

function getDatabaseConfigFields(dbType: string): string {
  switch (dbType) {
    case "postgres":
      return `host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'botdb',
  ssl: process.env.NODE_ENV === 'production'`;
    case "mysql":
      return `host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'botdb'`;
    case "mongodb":
      return `url: process.env.MONGODB_URI || 'mongodb://localhost:27017/botdb'`;
    case "redis":
      return `host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || ''`;
    case "sqlite":
    default:
      return `database: process.env.DB_PATH || './data/bot.db'`;
  }
}

function generateSQLiteSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

// SQLite Database connection
export async function initDatabase() {
  const db = await open({
    filename: join(process.cwd(), 'data', 'bot.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(\`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prefix TEXT DEFAULT '!',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return db;
}

// User operations
export async function getUser(db: any, userId: string) {
  return await db.get('SELECT * FROM users WHERE id = ?', userId);
}

export async function createUser(db: any, userId: string, username: string) {
  return await db.run('INSERT INTO users (id, username) VALUES (?, ?)', userId, username);
}

// Guild operations
export async function getGuild(db: any, guildId: string) {
  return await db.get('SELECT * FROM guilds WHERE id = ?', guildId);
}

export async function createGuild(db: any, guildId: string, name: string) {
  return await db.run('INSERT INTO guilds (id, name) VALUES (?, ?)', guildId, name);
}`;
  } else {
    return `const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { join } = require('path');

// SQLite Database connection
async function initDatabase() {
  const db = await open({
    filename: join(process.cwd(), 'data', 'bot.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(\`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prefix TEXT DEFAULT '!',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return db;
}

// User operations
async function getUser(db, userId) {
  return await db.get('SELECT * FROM users WHERE id = ?', userId);
}

async function createUser(db, userId, username) {
  return await db.run('INSERT INTO users (id, username) VALUES (?, ?)', userId, username);
}

// Guild operations
async function getGuild(db, guildId) {
  return await db.get('SELECT * FROM guilds WHERE id = ?', guildId);
}

async function createGuild(db, guildId, name) {
  return await db.run('INSERT INTO guilds (id, name) VALUES (?, ?)', guildId, name);
}

module.exports = {
  initDatabase,
  getUser,
  createUser,
  getGuild,
  createGuild
};`;
  }
}

function generatePostgresSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { Pool } from 'pg';

// PostgreSQL Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/botdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function initDatabase() {
  // Create tables
  await pool.query(\`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      prefix VARCHAR(10) DEFAULT '!',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return pool;
}

// User operations
export async function getUser(userId: string) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0];
}

export async function createUser(userId: string, username: string) {
  return await pool.query('INSERT INTO users (id, username) VALUES ($1, $2)', [userId, username]);
}

// Guild operations
export async function getGuild(guildId: string) {
  const result = await pool.query('SELECT * FROM guilds WHERE id = $1', [guildId]);
  return result.rows[0];
}

export async function createGuild(guildId: string, name: string) {
  return await pool.query('INSERT INTO guilds (id, name) VALUES ($1, $2)', [guildId, name]);
}

// Close connection
export async function closeDatabase() {
  await pool.end();
}`;
  } else {
    return `const { Pool } = require('pg');

// PostgreSQL Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/botdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  // Create tables
  await pool.query(\`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      prefix VARCHAR(10) DEFAULT '!',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return pool;
}

// User operations
async function getUser(userId) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0];
}

async function createUser(userId, username) {
  return await pool.query('INSERT INTO users (id, username) VALUES ($1, $2)', [userId, username]);
}

// Guild operations
async function getGuild(guildId) {
  const result = await pool.query('SELECT * FROM guilds WHERE id = $1', [guildId]);
  return result.rows[0];
}

async function createGuild(guildId, name) {
  return await pool.query('INSERT INTO guilds (id, name) VALUES ($1, $2)', [guildId, name]);
}

// Close connection
async function closeDatabase() {
  await pool.end();
}

module.exports = {
  initDatabase,
  getUser,
  createUser,
  getGuild,
  createGuild,
  closeDatabase
};`;
  }
}

function generateMySQLSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import mysql from 'mysql2/promise';

// MySQL Database connection
let connection: mysql.Connection;

export async function initDatabase() {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'botdb'
  });

  // Create tables
  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS guilds (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      prefix VARCHAR(10) DEFAULT '!',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return connection;
}

// User operations
export async function getUser(userId: string) {
  const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return (rows as any[])[0];
}

export async function createUser(userId: string, username: string) {
  return await connection.execute('INSERT INTO users (id, username) VALUES (?, ?)', [userId, username]);
}

// Guild operations
export async function getGuild(guildId: string) {
  const [rows] = await connection.execute('SELECT * FROM guilds WHERE id = ?', [guildId]);
  return (rows as any[])[0];
}

export async function createGuild(guildId: string, name: string) {
  return await connection.execute('INSERT INTO guilds (id, name) VALUES (?, ?)', [guildId, name]);
}

// Close connection
export async function closeDatabase() {
  await connection.end();
}`;
  } else {
    return `const mysql = require('mysql2/promise');

// MySQL Database connection
let connection;

async function initDatabase() {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'botdb'
  });

  // Create tables
  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS guilds (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      prefix VARCHAR(10) DEFAULT '!',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`);

  return connection;
}

// User operations
async function getUser(userId) {
  const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

async function createUser(userId, username) {
  return await connection.execute('INSERT INTO users (id, username) VALUES (?, ?)', [userId, username]);
}

// Guild operations
async function getGuild(guildId) {
  const [rows] = await connection.execute('SELECT * FROM guilds WHERE id = ?', [guildId]);
  return rows[0];
}

async function createGuild(guildId, name) {
  return await connection.execute('INSERT INTO guilds (id, name) VALUES (?, ?)', [guildId, name]);
}

// Close connection
async function closeDatabase() {
  await connection.end();
}

module.exports = {
  initDatabase,
  getUser,
  createUser,
  getGuild,
  createGuild,
  closeDatabase
};`;
  }
}

function generateMongoDBSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB Database connection
let client: MongoClient;
let db: Db;

export async function initDatabase() {
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/botdb';
  
  client = new MongoClient(connectionString);
  await client.connect();
  
  db = client.db();
  
  // Create indexes for better performance
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
  await db.collection('guilds').createIndex({ id: 1 }, { unique: true });
  
  return db;
}

// User operations
export async function getUser(userId: string) {
  return await db.collection('users').findOne({ id: userId });
}

export async function createUser(userId: string, username: string) {
  return await db.collection('users').insertOne({
    id: userId,
    username,
    created_at: new Date()
  });
}

export async function updateUser(userId: string, updates: Record<string, unknown>) {
  return await db.collection('users').updateOne(
    { id: userId },
    { $set: { ...updates, updated_at: new Date() } }
  );
}

// Guild operations
export async function getGuild(guildId: string) {
  return await db.collection('guilds').findOne({ id: guildId });
}

export async function createGuild(guildId: string, name: string) {
  return await db.collection('guilds').insertOne({
    id: guildId,
    name,
    prefix: '!',
    created_at: new Date()
  });
}

export async function updateGuild(guildId: string, updates: Record<string, unknown>) {
  return await db.collection('guilds').updateOne(
    { id: guildId },
    { $set: { ...updates, updated_at: new Date() } }
  );
}

// Close connection
export async function closeDatabase() {
  await client.close();
}`;
  } else {
    return `const { MongoClient } = require('mongodb');

// MongoDB Database connection
let client;
let db;

async function initDatabase() {
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/botdb';
  
  client = new MongoClient(connectionString);
  await client.connect();
  
  db = client.db();
  
  // Create indexes for better performance
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
  await db.collection('guilds').createIndex({ id: 1 }, { unique: true });
  
  return db;
}

// User operations
async function getUser(userId) {
  return await db.collection('users').findOne({ id: userId });
}

async function createUser(userId, username) {
  return await db.collection('users').insertOne({
    id: userId,
    username,
    created_at: new Date()
  });
}

async function updateUser(userId, updates) {
  return await db.collection('users').updateOne(
    { id: userId },
    { $set: { ...updates, updated_at: new Date() } }
  );
}

// Guild operations
async function getGuild(guildId) {
  return await db.collection('guilds').findOne({ id: guildId });
}

async function createGuild(guildId, name) {
  return await db.collection('guilds').insertOne({
    id: guildId,
    name,
    prefix: '!',
    created_at: new Date()
  });
}

async function updateGuild(guildId, updates) {
  return await db.collection('guilds').updateOne(
    { id: guildId },
    { $set: { ...updates, updated_at: new Date() } }
  );
}

// Close connection
async function closeDatabase() {
  await client.close();
}

module.exports = {
  initDatabase,
  getUser,
  createUser,
  updateUser,
  getGuild,
  createGuild,
  updateGuild,
  closeDatabase
};`;
  }
}

function generateRedisSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import Redis from 'ioredis';

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export { redis };

// Cache utilities
export class CacheManager {
  private static prefix = 'bot:';

  static async set(key: string, value: unknown, ttl = 3600): Promise<void> {
    await redis.setex(\`\${this.prefix}\${key}\`, ttl, JSON.stringify(value));
  }

  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(\`\${this.prefix}\${key}\`);
    return value ? JSON.parse(value) : null;
  }

  static async del(key: string): Promise<void> {
    await redis.del(\`\${this.prefix}\${key}\`);
  }

  static async exists(key: string): Promise<boolean> {
    return (await redis.exists(\`\${this.prefix}\${key}\`)) === 1;
  }

  // User caching
  static async cacheUser(userId: string, userData: unknown, ttl = 3600): Promise<void> {
    await this.set(\`user:\${userId}\`, userData, ttl);
  }

  static async getCachedUser(userId: string): Promise<any> {
    return await this.get(\`user:\${userId}\`);
  }

  // Guild caching
  static async cacheGuild(guildId: string, guildData: unknown, ttl = 3600): Promise<void> {
    await this.set(\`guild:\${guildId}\`, guildData, ttl);
  }

  static async getCachedGuild(guildId: string): Promise<any> {
    return await this.get(\`guild:\${guildId}\`);
  }

  // Rate limiting
  static async rateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await redis.incr(\`ratelimit:\${key}\`);
    if (current === 1) {
      await redis.expire(\`ratelimit:\${key}\`, window);
    }
    return current <= limit;
  }
}

// Close connection
export async function closeDatabase(): Promise<void> {
  redis.disconnect();
}`;
  } else {
    return `const Redis = require('ioredis');

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Cache utilities
class CacheManager {
  static prefix = 'bot:';

  static async set(key, value, ttl = 3600) {
    await redis.setex(\`\${this.prefix}\${key}\`, ttl, JSON.stringify(value));
  }

  static async get(key) {
    const value = await redis.get(\`\${this.prefix}\${key}\`);
    return value ? JSON.parse(value) : null;
  }

  static async del(key) {
    await redis.del(\`\${this.prefix}\${key}\`);
  }

  static async exists(key) {
    return (await redis.exists(\`\${this.prefix}\${key}\`)) === 1;
  }

  // User caching
  static async cacheUser(userId, userData, ttl = 3600) {
    await this.set(\`user:\${userId}\`, userData, ttl);
  }

  static async getCachedUser(userId) {
    return await this.get(\`user:\${userId}\`);
  }

  // Guild caching
  static async cacheGuild(guildId, guildData, ttl = 3600) {
    await this.set(\`guild:\${guildId}\`, guildData, ttl);
  }

  static async getCachedGuild(guildId) {
    return await this.get(\`guild:\${guildId}\`);
  }

  // Rate limiting
  static async rateLimit(key, limit, window) {
    const current = await redis.incr(\`ratelimit:\${key}\`);
    if (current === 1) {
      await redis.expire(\`ratelimit:\${key}\`, window);
    }
    return current <= limit;
  }
}

// Close connection
async function closeDatabase() {
  redis.disconnect();
}

module.exports = {
  redis,
  CacheManager,
  closeDatabase
};`;
  }
}

function generatePrismaSchema(options: InitOptions): string {
  const prismaSchema = `// Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  discordId String   @unique
  username  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Guild {
  id        String   @id @default(cuid())
  discordId String   @unique
  name      String
  prefix    String   @default("!")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("guilds")
}

model UserGuild {
  id      String @id @default(cuid())
  userId  String
  guildId String
  joinedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  guild Guild @relation(fields: [guildId], references: [id])

  @@unique([userId, guildId])
  @@map("user_guilds")
}`;

  if (options.template === "typescript") {
    return `import { PrismaClient } from '@prisma/client';

// Prisma client
const prisma = new PrismaClient();

export { prisma };

// User operations
export async function getUser(discordId: string) {
  return await prisma.user.findUnique({
    where: { discordId }
  });
}

export async function createUser(discordId: string, username: string) {
  return await prisma.user.create({
    data: {
      discordId,
      username
    }
  });
}

export async function updateUser(discordId: string, data: Record<string, unknown>) {
  return await prisma.user.update({
    where: { discordId },
    data
  });
}

// Guild operations
export async function getGuild(discordId: string) {
  return await prisma.guild.findUnique({
    where: { discordId }
  });
}

export async function createGuild(discordId: string, name: string) {
  return await prisma.guild.create({
    data: {
      discordId,
      name
    }
  });
}

export async function updateGuild(discordId: string, data: Record<string, unknown>) {
  return await prisma.guild.update({
    where: { discordId },
    data
  });
}

// Close connection
export async function closeDatabase() {
  await prisma.$disconnect();
}

// NOTE: Don't forget to run:
// npx prisma generate
// npx prisma db push`;
  } else {
    return `const { PrismaClient } = require('@prisma/client');

// Prisma client
const prisma = new PrismaClient();

// User operations
async function getUser(discordId) {
  return await prisma.user.findUnique({
    where: { discordId }
  });
}

async function createUser(discordId, username) {
  return await prisma.user.create({
    data: {
      discordId,
      username
    }
  });
}

async function updateUser(discordId, data) {
  return await prisma.user.update({
    where: { discordId },
    data
  });
}

// Guild operations
async function getGuild(discordId) {
  return await prisma.guild.findUnique({
    where: { discordId }
  });
}

async function createGuild(discordId, name) {
  return await prisma.guild.create({
    data: {
      discordId,
      name
    }
  });
}

async function updateGuild(discordId, data) {
  return await prisma.guild.update({
    where: { discordId },
    data
  });
}

// Close connection
async function closeDatabase() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  getUser,
  createUser,
  updateUser,
  getGuild,
  createGuild,
  updateGuild,
  closeDatabase
};

// NOTE: Don't forget to run:
// npx prisma generate
// npx prisma db push`;
  }
}

function generateMongooseSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import mongoose, { Document, Schema } from 'mongoose';

// Connect to MongoDB
export async function initDatabase(): Promise<void> {
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/botdb';
  
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// User Schema
interface IUser extends Document {
  discordId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);

// Guild Schema
interface IGuild extends Document {
  discordId: string;
  name: string;
  prefix: string;
  createdAt: Date;
  updatedAt: Date;
}

const guildSchema = new Schema<IGuild>({
  discordId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  prefix: { type: String, default: '!' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

guildSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Guild = mongoose.model<IGuild>('Guild', guildSchema);

// User operations
export async function getUser(discordId: string): Promise<IUser | null> {
  return await User.findOne({ discordId });
}

export async function createUser(discordId: string, username: string): Promise<IUser> {
  const user = new User({ discordId, username });
  return await user.save();
}

export async function updateUser(discordId: string, updates: Partial<IUser>): Promise<IUser | null> {
  return await User.findOneAndUpdate(
    { discordId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

// Guild operations
export async function getGuild(discordId: string): Promise<IGuild | null> {
  return await Guild.findOne({ discordId });
}

export async function createGuild(discordId: string, name: string): Promise<IGuild> {
  const guild = new Guild({ discordId, name });
  return await guild.save();
}

export async function updateGuild(discordId: string, updates: Partial<IGuild>): Promise<IGuild | null> {
  return await Guild.findOneAndUpdate(
    { discordId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

// Close connection
export async function closeDatabase(): Promise<void> {
  await mongoose.connection.close();
}`;
  } else {
    return `const mongoose = require('mongoose');

// Connect to MongoDB
async function initDatabase() {
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/botdb';
  
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

// Guild Schema
const guildSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  prefix: { type: String, default: '!' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

guildSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Guild = mongoose.model('Guild', guildSchema);

// User operations
async function getUser(discordId) {
  return await User.findOne({ discordId });
}

async function createUser(discordId, username) {
  const user = new User({ discordId, username });
  return await user.save();
}

async function updateUser(discordId, updates) {
  return await User.findOneAndUpdate(
    { discordId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

// Guild operations
async function getGuild(discordId) {
  return await Guild.findOne({ discordId });
}

async function createGuild(discordId, name) {
  const guild = new Guild({ discordId, name });
  return await guild.save();
}

async function updateGuild(discordId, updates) {
  return await Guild.findOneAndUpdate(
    { discordId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

// Close connection
async function closeDatabase() {
  await mongoose.connection.close();
}

module.exports = {
  initDatabase,
  User,
  Guild,
  getUser,
  createUser,
  updateUser,
  getGuild,
  createGuild,
  updateGuild,
  closeDatabase
};`;
  }
}
