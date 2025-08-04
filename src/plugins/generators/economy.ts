export function generateEconomyPlugin(): string {
  return `interface UserBalance {
  userId: string;
  balance: number;
  lastDaily: number;
}

export class Economy {
  private static instance: Economy;
  private balances = new Map<string, UserBalance>();

  static getInstance(): Economy {
    if (!Economy.instance) {
      Economy.instance = new Economy();
    }
    return Economy.instance;
  }

  getBalance(userId: string): number {
    const user = this.balances.get(userId);
    return user?.balance || 0;
  }

  setBalance(userId: string, amount: number): void {
    const user = this.balances.get(userId) || { userId, balance: 0, lastDaily: 0 };
    user.balance = Math.max(0, amount);
    this.balances.set(userId, user);
  }

  addBalance(userId: string, amount: number): number {
    const currentBalance = this.getBalance(userId);
    const newBalance = currentBalance + amount;
    this.setBalance(userId, newBalance);
    return newBalance;
  }

  removeBalance(userId: string, amount: number): boolean {
    const currentBalance = this.getBalance(userId);
    if (currentBalance < amount) return false;
    
    this.setBalance(userId, currentBalance - amount);
    return true;
  }

  canClaimDaily(userId: string): boolean {
    const user = this.balances.get(userId);
    if (!user) return true;
    
    const now = Date.now();
    const lastDaily = user.lastDaily;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return now - lastDaily >= dayInMs;
  }

  claimDaily(userId: string): number {
    if (!this.canClaimDaily(userId)) return 0;
    
    const dailyAmount = 100;
    const user = this.balances.get(userId) || { userId, balance: 0, lastDaily: 0 };
    user.balance += dailyAmount;
    user.lastDaily = Date.now();
    this.balances.set(userId, user);
    
    return dailyAmount;
  }

  getTopUsers(limit = 10): Array<{ userId: string; balance: number }> {
    return Array.from(this.balances.values())
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit)
      .map(user => ({ userId: user.userId, balance: user.balance }));
  }
}`;
}

export function generateBalanceCommand(): string {
  return `import { Message } from 'discord.js';
import { Economy } from '../plugins/economy';

export const name = 'balance';
export const description = 'Check your or another user\\'s balance';

export async function execute(message: Message, args: string[]) {
  const economy = Economy.getInstance();
  const targetUser = message.mentions.users.first() || message.author;
  const balance = economy.getBalance(targetUser.id);

  message.reply({
    embeds: [{
      title: '💰 Balance',
      description: \`\${targetUser === message.author ? 'Your' : \`\${targetUser.username}'s\`} balance: **\${balance} coins**\`,
      color: 0x00ff00,
      thumbnail: { url: targetUser.displayAvatarURL() }
    }]
  });
}`;
}

export function generateDailyCommand(): string {
  return `import { Message } from 'discord.js';
import { Economy } from '../plugins/economy';

export const name = 'daily';
export const description = 'Claim your daily coins';

export async function execute(message: Message, args: string[]) {
  const economy = Economy.getInstance();
  const userId = message.author.id;

  if (!economy.canClaimDaily(userId)) {
    return message.reply('❌ You have already claimed your daily coins! Try again tomorrow.');
  }

  const amount = economy.claimDaily(userId);
  const newBalance = economy.getBalance(userId);

  message.reply({
    embeds: [{
      title: '🎁 Daily Reward',
      description: \`You claimed **\${amount} coins**!\\nNew balance: **\${newBalance} coins**\`,
      color: 0xffd700
    }]
  });
}`;
}
