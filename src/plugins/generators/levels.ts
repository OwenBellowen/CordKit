export function generateLevelsPlugin(): string {
  return `interface UserLevel {
  userId: string;
  xp: number;
  level: number;
  lastMessage: number;
}

export class LevelSystem {
  private static instance: LevelSystem;
  private users = new Map<string, UserLevel>();

  static getInstance(): LevelSystem {
    if (!LevelSystem.instance) {
      LevelSystem.instance = new LevelSystem();
    }
    return LevelSystem.instance;
  }

  addXP(userId: string, amount: number = 15): { levelUp: boolean; newLevel: number } {
    const user = this.users.get(userId) || { userId, xp: 0, level: 1, lastMessage: 0 };
    
    // Prevent spam XP farming (1 minute cooldown)
    const now = Date.now();
    if (now - user.lastMessage < 60000) {
      return { levelUp: false, newLevel: user.level };
    }
    
    user.lastMessage = now;
    user.xp += amount;
    
    const newLevel = this.calculateLevel(user.xp);
    const levelUp = newLevel > user.level;
    user.level = newLevel;
    
    this.users.set(userId, user);
    
    return { levelUp, newLevel };
  }

  getUserLevel(userId: string): UserLevel {
    return this.users.get(userId) || { userId, xp: 0, level: 1, lastMessage: 0 };
  }

  calculateLevel(xp: number): number {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
  }

  getXPForNextLevel(currentLevel: number): number {
    return Math.pow((currentLevel - 1) / 0.1, 2);
  }

  getLeaderboard(limit = 10): UserLevel[] {
    return Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }
}`;
}

export function generateRankCommand(): string {
  return `import { Message } from 'discord.js';
import { LevelSystem } from '../plugins/levels';

export const name = 'rank';
export const description = 'Check your or another user\\'s rank and level';

export async function execute(message: Message, args: string[]) {
  const levels = LevelSystem.getInstance();
  const targetUser = message.mentions.users.first() || message.author;
  const userLevel = levels.getUserLevel(targetUser.id);
  
  const currentLevelXP = levels.getXPForNextLevel(userLevel.level);
  const nextLevelXP = levels.getXPForNextLevel(userLevel.level + 1);
  const progressXP = userLevel.xp - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  
  const progressBar = createProgressBar(progressXP, neededXP, 20);

  message.reply({
    embeds: [{
      title: \`📊 \${targetUser.username}'s Rank\`,
      color: 0x5865f2,
      thumbnail: { url: targetUser.displayAvatarURL() },
      fields: [
        { name: '🏆 Level', value: \`\${userLevel.level}\`, inline: true },
        { name: '⭐ Total XP', value: \`\${userLevel.xp}\`, inline: true },
        { name: '📈 Progress', value: \`\${progressXP}/\${neededXP} XP\\n\${progressBar}\`, inline: false }
      ]
    }]
  });
}

function createProgressBar(current: number, max: number, length: number): string {
  const percentage = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(length * percentage);
  const empty = length - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty) + \` \${Math.round(percentage * 100)}%\`;
}`;
}

export function generateLeaderboardCommand(): string {
  return `import { Message } from 'discord.js';
import { LevelSystem } from '../plugins/levels';

export const name = 'leaderboard';
export const description = 'Show the server leaderboard';

export async function execute(message: Message, args: string[]) {
  const levels = LevelSystem.getInstance();
  const leaderboard = levels.getLeaderboard(10);

  if (leaderboard.length === 0) {
    return message.reply('📊 No users found in the leaderboard yet!');
  }

  const description = leaderboard.map((user, index) => {
    const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : \`\${index + 1}.\`;
    return \`\${medal} <@\${user.userId}> - Level \${user.level} (\${user.xp} XP)\`;
  }).join('\\n');

  message.reply({
    embeds: [{
      title: '🏆 Server Leaderboard',
      description,
      color: 0xffd700
    }]
  });
}`;
}
