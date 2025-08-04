// Database connection manager for CordKit projects
import type { InitOptions } from "../initTemplate";

// Generate database connection manager file
export function generateDatabaseManager(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { databaseConfig } from './config/database';
${getManagerImports(options.databaseType)}

class DatabaseManager {
  private static instance: DatabaseManager;
  private connection: unknown;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async connect(): Promise<unknown> {
    if (this.isConnected && this.connection) {
      return this.connection;
    }

    try {
      ${getConnectionCode(options.databaseType)}
      this.isConnected = true;
      console.log('Connected to database successfully');
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  getConnection(): unknown {
    if (!this.isConnected || !this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.connection;
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected || !this.connection) {
      return;
    }

    try {
      ${getDisconnectionCode(options.databaseType)}
      this.isConnected = false;
      this.connection = null;
      console.log('Disconnected from database');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();
${getExportCode(options.databaseType)}`;
  } else {
    return `const { databaseConfig } = require('./config/database');
${getManagerImports(options.databaseType, false)}

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected && this.connection) {
      return this.connection;
    }

    try {
      ${getConnectionCode(options.databaseType)}
      this.isConnected = true;
      console.log('Connected to database successfully');
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.isConnected || !this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.connection;
  }

  async disconnect() {
    if (!this.isConnected || !this.connection) {
      return;
    }

    try {
      ${getDisconnectionCode(options.databaseType)}
      this.isConnected = false;
      this.connection = null;
      console.log('Disconnected from database');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

// Export the database manager
module.exports = {
  dbManager${getExportCode(options.databaseType, false)}
};`;
  }
}

// Helper function to generate manager imports for each database type
function getManagerImports(
  dbType: string,
  isTypescript: boolean = true,
): string {
  if (isTypescript) {
    switch (dbType) {
      case "sqlite":
        return `import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';`;
      case "postgres":
        return `import { Pool } from 'pg';`;
      case "mysql":
        return `import mysql from 'mysql2/promise';`;
      case "mongodb":
        return `import { MongoClient, Db } from 'mongodb';`;
      case "redis":
        return `import Redis from 'ioredis';`;
      case "prisma":
        return `import { PrismaClient } from '@prisma/client';`;
      case "mongoose":
        return `import mongoose from 'mongoose';`;
      default:
        return "";
    }
  } else {
    switch (dbType) {
      case "sqlite":
        return `const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { join } = require('path');`;
      case "postgres":
        return `const { Pool } = require('pg');`;
      case "mysql":
        return `const mysql = require('mysql2/promise');`;
      case "mongodb":
        return `const { MongoClient } = require('mongodb');`;
      case "redis":
        return `const Redis = require('ioredis');`;
      case "prisma":
        return `const { PrismaClient } = require('@prisma/client');`;
      case "mongoose":
        return `const mongoose = require('mongoose');`;
      default:
        return "";
    }
  }
}

// Helper function for connection code by database type
function getConnectionCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `this.connection = await open({
        filename: join(process.cwd(), databaseConfig.database || './data/bot.db'),
        driver: sqlite3.Database
      });`;
    case "postgres":
      return `this.connection = new Pool({
        host: databaseConfig.host || 'localhost',
        port: databaseConfig.port || 5432,
        user: databaseConfig.username || 'postgres',
        password: databaseConfig.password || '',
        database: databaseConfig.database || 'botdb',
        ssl: databaseConfig.ssl || false
      });`;
    case "mysql":
      return `this.connection = await mysql.createConnection({
        host: databaseConfig.host || 'localhost',
        port: databaseConfig.port || 3306,
        user: databaseConfig.username || 'root',
        password: databaseConfig.password || '',
        database: databaseConfig.database || 'botdb'
      });`;
    case "mongodb":
      return `const client = new MongoClient(databaseConfig.url || 'mongodb://localhost:27017/botdb');
      await client.connect();
      this.client = client;
      this.connection = client.db();`;
    case "redis":
      return `this.connection = new Redis({
        host: databaseConfig.host || 'localhost',
        port: databaseConfig.port || 6379,
        password: databaseConfig.password || undefined
      });`;
    case "prisma":
      return `this.connection = new PrismaClient();`;
    case "mongoose":
      return `await mongoose.connect(databaseConfig.url || 'mongodb://localhost:27017/botdb');
      this.connection = mongoose.connection;`;
    default:
      return "// Connect to your database here";
  }
}

// Helper function for disconnection code by database type
function getDisconnectionCode(dbType: string): string {
  switch (dbType) {
    case "sqlite":
      return `await this.connection.close();`;
    case "postgres":
      return `await this.connection.end();`;
    case "mysql":
      return `await this.connection.end();`;
    case "mongodb":
      return `await this.client.close();`;
    case "redis":
      return `this.connection.disconnect();`;
    case "prisma":
      return `await this.connection.$disconnect();`;
    case "mongoose":
      return `await mongoose.disconnect();`;
    default:
      return "// Close your database connection";
  }
}

// Helper function for model and repository exports
function getExportCode(dbType: string, isTypescript: boolean = true): string {
  if (isTypescript) {
    switch (dbType) {
      case "prisma":
        return `

// Convenience export for direct Prisma client access when needed
export const getPrisma = () => dbManager.getConnection();`;
      case "mongoose":
        return `

// Model exports
import './models/user';
import './models/guild';

// Repository exports
export * from './repositories/userRepository';
export * from './repositories/guildRepository';`;
      default:
        return "";
    }
  } else {
    switch (dbType) {
      case "prisma":
        return `,
  getPrisma: () => dbManager.getConnection()`;
      case "mongoose":
        return `,
  ...require('./models/user'),
  ...require('./models/guild'),
  ...require('./repositories/userRepository'),
  ...require('./repositories/guildRepository')`;
      default:
        return "";
    }
  }
}
