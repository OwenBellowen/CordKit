// Database generators for CordKit projects
import type { InitOptions } from "../initTemplate";

export function generateDatabaseSchema(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

// Database connection
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

// Database connection
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
