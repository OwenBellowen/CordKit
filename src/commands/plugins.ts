// CordKit 'plugins' command implementation
import { Command } from 'commander';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

interface Plugin {
  name: string;
  description: string;
  files: { [key: string]: string };
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: { [key: string]: string };
}

const availablePlugins: { [key: string]: Plugin } = {
  'auto-mod': {
    name: 'Auto Moderation',
    description: 'Automatic message filtering and user moderation',
    dependencies: ['bad-words'],
    files: {
      'plugins/automod.ts': generateAutoModPlugin(),
      'commands/automod.ts': generateAutoModCommand(),
    }
  },
  'economy': {
    name: 'Economy System',
    description: 'Virtual currency and economy features',
    files: {
      'plugins/economy.ts': generateEconomyPlugin(),
      'commands/balance.ts': generateBalanceCommand(),
      'commands/daily.ts': generateDailyCommand(),
    }
  },
  'levels': {
    name: 'Leveling System',
    description: 'User experience and leveling system',
    files: {
      'plugins/levels.ts': generateLevelsPlugin(),
      'commands/rank.ts': generateRankCommand(),
      'commands/leaderboard.ts': generateLeaderboardCommand(),
    }
  },
  'tickets': {
    name: 'Ticket System',
    description: 'Support ticket system with categories',
    files: {
      'plugins/tickets.ts': generateTicketPlugin(),
      'commands/ticket.ts': generateTicketCommand(),
    }
  },
  'polls': {
    name: 'Polls & Voting',
    description: 'Create polls and voting systems',
    files: {
      'plugins/polls.ts': generatePollsPlugin(),
      'commands/poll.ts': generatePollCommand(),
    }
  },
  'react-roles': {
    name: 'Reaction Roles',
    description: 'Role assignment via message reactions',
    files: {
      'plugins/reaction-roles.ts': generateReactionRolesPlugin(),
      'commands/reactrole.ts': generateReactRoleCommand(),
    }
  }
};

export const pluginsCommand = new Command('plugins')
  .description('Manage bot plugins and extensions')
  .option('-l, --list', 'List available plugins')
  .option('-i, --install <plugin>', 'Install a plugin')
  .option('-r, --remove <plugin>', 'Remove a plugin')
  .option('-p, --path <path>', 'Path to the project directory', '.')
  .action((opts: any) => {
    const projectPath = opts.path;
    
    if (opts.list) {
      listPlugins();
      return;
    }
    
    if (opts.install) {
      installPlugin(opts.install, projectPath);
      return;
    }
    
    if (opts.remove) {
      removePlugin(opts.remove, projectPath);
      return;
    }
    
    // Default: show help
    console.log(chalk.blue.bold('🔌 CordKit Plugins\n'));
    console.log(chalk.cyan('Available commands:'));
    console.log(chalk.white('  --list              ') + chalk.gray('List available plugins'));
    console.log(chalk.white('  --install <plugin>  ') + chalk.gray('Install a plugin'));
    console.log(chalk.white('  --remove <plugin>   ') + chalk.gray('Remove a plugin'));
    console.log(chalk.white('  --path <path>       ') + chalk.gray('Specify project path'));
    console.log(chalk.green('\nExample: ') + chalk.yellow('cordkit plugins --install economy'));
  });

function listPlugins() {
  console.log(chalk.blue.bold('🔌 Available CordKit Plugins\n'));
  
  Object.entries(availablePlugins).forEach(([key, plugin]) => {
    console.log(chalk.magenta.bold(`📦 ${plugin.name}`) + chalk.gray(` (${key})`));
    console.log(chalk.white(`   ${plugin.description}`));
    console.log('');
  });
  
  console.log(chalk.green('💡 Install with: ') + chalk.yellow('cordkit plugins --install <plugin-name>'));
}

function installPlugin(pluginName: string, projectPath: string) {
  const plugin = availablePlugins[pluginName];
  
  if (!plugin) {
    console.error(chalk.red(`❌ Plugin '${pluginName}' not found. Use --list to see available plugins.`));
    process.exit(1);
  }
  
  if (!existsSync(join(projectPath, 'package.json'))) {
    console.error(chalk.red('❌ No package.json found. Are you in a CordKit project?'));
    process.exit(1);
  }
  
  console.log(chalk.cyan(`🔌 Installing plugin: `) + chalk.magenta.bold(plugin.name) + chalk.cyan('...'));
  
  // Create plugins directory if it doesn't exist
  const pluginsDir = join(projectPath, 'plugins');
  if (!existsSync(pluginsDir)) {
    mkdirSync(pluginsDir, { recursive: true });
  }
  
  // Install plugin files
  Object.entries(plugin.files).forEach(([filePath, content]) => {
    const fullPath = join(projectPath, filePath);
    const dir = join(fullPath, '..');
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(fullPath, content);
    console.log(chalk.green(`  ✅ Created `) + chalk.white(filePath));
  });
  
  // Update package.json with dependencies
  if (plugin.dependencies || plugin.devDependencies || plugin.scripts) {
    const packageJsonPath = join(projectPath, 'package.json');
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    if (plugin.dependencies) {
      pkg.dependencies = { ...pkg.dependencies, ...plugin.dependencies };
    }
    
    if (plugin.devDependencies) {
      pkg.devDependencies = { ...pkg.devDependencies, ...plugin.devDependencies };
    }
    
    if (plugin.scripts) {
      pkg.scripts = { ...pkg.scripts, ...plugin.scripts };
    }
    
    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    console.log(chalk.green('  ✅ Updated ') + chalk.white('package.json'));
  }
  
  console.log(chalk.green.bold(`\n🎉 Plugin '${plugin.name}' installed successfully!`));
  console.log(chalk.yellow('💡 Run "bun install" to install new dependencies'));
}

function removePlugin(pluginName: string, projectPath: string) {
  const plugin = availablePlugins[pluginName];
  
  if (!plugin) {
    console.error(`❌ Plugin '${pluginName}' not found.`);
    process.exit(1);
  }
  
  console.log(`🗑️ Removing plugin: ${plugin.name}...`);
  
  // Remove plugin files
  Object.keys(plugin.files).forEach(filePath => {
    const fullPath = join(projectPath, filePath);
    if (existsSync(fullPath)) {
      writeFileSync(fullPath, ''); // Clear file content
      console.log(`  ✅ Removed ${filePath}`);
    }
  });
  
  console.log(`\n🎉 Plugin '${plugin.name}' removed successfully!`);
}

// Plugin generators

function generateAutoModPlugin(): string {
  return `import { Message, TextChannel } from 'discord.js';
import Filter from 'bad-words';

const filter = new Filter();

export class AutoMod {
  private static instance: AutoMod;
  private enabled = true;
  private logChannel: string | null = null;

  static getInstance(): AutoMod {
    if (!AutoMod.instance) {
      AutoMod.instance = new AutoMod();
    }
    return AutoMod.instance;
  }

  setLogChannel(channelId: string) {
    this.logChannel = channelId;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async checkMessage(message: Message): Promise<boolean> {
    if (!this.enabled || message.author.bot) return false;

    // Check for profanity
    if (filter.isProfane(message.content)) {
      await this.handleViolation(message, 'Profanity detected');
      return true;
    }

    // Check for spam (repeated characters)
    if (this.isSpam(message.content)) {
      await this.handleViolation(message, 'Spam detected');
      return true;
    }

    return false;
  }

  private isSpam(content: string): boolean {
    // Simple spam detection
    const repeatedChar = new RegExp("(.)\\1{10,}");
    const repeatedWord = /\\b(\\w+)\\s+\\1\\s+\\1/i;
    return repeatedChar.test(content) || repeatedWord.test(content);
  }

  private async handleViolation(message: Message, reason: string) {
    try {
      await message.delete();
      
      const warning = await message.channel.send(
        \`⚠️ \${message.author}, your message was removed: \${reason}\`
      );
      
      // Auto-delete warning after 5 seconds
      setTimeout(() => warning.delete().catch(() => {}), 5000);

      // Log to mod channel
      if (this.logChannel && message.guild) {
        const logChannel = message.guild.channels.cache.get(this.logChannel) as TextChannel;
        if (logChannel) {
          logChannel.send({
            embeds: [{
              title: '🛡️ Auto-Moderation Action',
              color: 0xff6b6b,
              fields: [
                { name: 'User', value: \`\${message.author.tag} (\${message.author.id})\`, inline: true },
                { name: 'Channel', value: \`\${message.channel}\`, inline: true },
                { name: 'Reason', value: reason, inline: true },
                { name: 'Original Message', value: message.content || 'No content', inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          });
        }
      }
    } catch (error) {
      console.error('Auto-mod error:', error);
    }
  }
}`;
}

function generateAutoModCommand(): string {
  return `import { Message } from 'discord.js';
import { AutoMod } from '../plugins/automod';

export const name = 'automod';
export const description = 'Configure auto-moderation settings';

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('ManageMessages')) {
    return message.reply('❌ You need Manage Messages permission to use this command.');
  }

  const automod = AutoMod.getInstance();
  const subcommand = args[0]?.toLowerCase();

  switch (subcommand) {
    case 'enable':
      automod.setEnabled(true);
      message.reply('✅ Auto-moderation enabled');
      break;

    case 'disable':
      automod.setEnabled(false);
      message.reply('❌ Auto-moderation disabled');
      break;

    case 'logchannel':
      const channelId = args[1];
      if (!channelId) {
        return message.reply('❌ Please provide a channel ID');
      }
      automod.setLogChannel(channelId);
      message.reply(\`✅ Log channel set to <#\${channelId}>\`);
      break;

    default:
      message.reply({
        embeds: [{
          title: '🛡️ Auto-Moderation Commands',
          description: 'Configure automatic message filtering',
          fields: [
            { name: '!automod enable', value: 'Enable auto-moderation', inline: false },
            { name: '!automod disable', value: 'Disable auto-moderation', inline: false },
            { name: '!automod logchannel <id>', value: 'Set log channel', inline: false }
          ],
          color: 0x5865f2
        }]
      });
  }
}`;
}

function generateEconomyPlugin(): string {
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

function generateBalanceCommand(): string {
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

function generateDailyCommand(): string {
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

function generateLevelsPlugin(): string {
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

function generateRankCommand(): string {
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

function generateLeaderboardCommand(): string {
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

function generateTicketPlugin(): string {
  return `import { Guild, TextChannel, CategoryChannel, PermissionFlagsBits, ChannelType } from 'discord.js';

export class TicketSystem {
  private static instance: TicketSystem;
  private ticketCategory: string | null = null;
  private ticketCounter = 1;

  static getInstance(): TicketSystem {
    if (!TicketSystem.instance) {
      TicketSystem.instance = new TicketSystem();
    }
    return TicketSystem.instance;
  }

  setCategoryId(categoryId: string) {
    this.ticketCategory = categoryId;
  }

  async createTicket(guild: Guild, userId: string, reason?: string): Promise<TextChannel | null> {
    if (!this.ticketCategory) {
      throw new Error('Ticket category not set. Use !ticket setup first.');
    }

    const category = guild.channels.cache.get(this.ticketCategory) as CategoryChannel;
    if (!category) {
      throw new Error('Ticket category not found.');
    }

    const ticketName = \`ticket-\${this.ticketCounter.toString().padStart(4, '0')}\`;
    this.ticketCounter++;

    try {
      const channel = await guild.channels.create({
        name: ticketName,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: userId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ]
      });

      await channel.send({
        embeds: [{
          title: '🎫 Support Ticket',
          description: \`Hello <@\${userId}>! A staff member will be with you shortly.\\n\\n\${reason ? \`**Reason:** \${reason}\` : ''}\`,
          color: 0x5865f2,
          footer: { text: 'Use !ticket close to close this ticket' }
        }]
      });

      return channel;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  }

  async closeTicket(channel: TextChannel): Promise<boolean> {
    try {
      await channel.send({
        embeds: [{
          title: '🔒 Ticket Closed',
          description: 'This ticket will be deleted in 10 seconds.',
          color: 0xff6b6b
        }]
      });

      setTimeout(async () => {
        try {
          await channel.delete();
        } catch (error) {
          console.error('Error deleting ticket channel:', error);
        }
      }, 10000);

      return true;
    } catch (error) {
      console.error('Error closing ticket:', error);
      return false;
    }
  }
}`;
}

function generateTicketCommand(): string {
  return `import { Message, ChannelType } from 'discord.js';
import { TicketSystem } from '../plugins/tickets';

export const name = 'ticket';
export const description = 'Manage support tickets';

export async function execute(message: Message, args: string[]) {
  const tickets = TicketSystem.getInstance();
  const subcommand = args[0]?.toLowerCase();

  switch (subcommand) {
    case 'create':
      const reason = args.slice(1).join(' ') || 'No reason provided';
      try {
        const channel = await tickets.createTicket(message.guild!, message.author.id, reason);
        if (channel) {
          message.reply(\`✅ Ticket created: \${channel}\`);
        } else {
          message.reply('❌ Failed to create ticket.');
        }
      } catch (error) {
        message.reply(\`❌ Error: \${error.message}\`);
      }
      break;

    case 'close':
      if (message.channel?.type !== ChannelType.GuildText) {
        return message.reply('❌ This command can only be used in a text channel.');
      }

      if (!message.channel.name.startsWith('ticket-')) {
        return message.reply('❌ This is not a ticket channel.');
      }

      const success = await tickets.closeTicket(message.channel);
      if (!success) {
        message.reply('❌ Failed to close ticket.');
      }
      break;

    case 'setup':
      if (!message.member?.permissions.has('ManageChannels')) {
        return message.reply('❌ You need Manage Channels permission to setup tickets.');
      }

      const categoryId = args[1];
      if (!categoryId) {
        return message.reply('❌ Please provide a category ID: !ticket setup <category_id>');
      }

      tickets.setCategoryId(categoryId);
      message.reply(\`✅ Ticket category set to <#\${categoryId}>\`);
      break;

    default:
      message.reply({
        embeds: [{
          title: '🎫 Ticket Commands',
          fields: [
            { name: '!ticket create [reason]', value: 'Create a new support ticket', inline: false },
            { name: '!ticket close', value: 'Close the current ticket (staff only)', inline: false },
            { name: '!ticket setup <category_id>', value: 'Setup ticket category (admin only)', inline: false }
          ],
          color: 0x5865f2
        }]
      });
  }
}`;
}

function generatePollsPlugin(): string {
  return `import { Message, MessageReaction, User } from 'discord.js';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Map<string, number>; // userId -> optionIndex
  messageId: string;
  channelId: string;
  endTime: number;
}

export class PollSystem {
  private static instance: PollSystem;
  private polls = new Map<string, Poll>();
  private reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  static getInstance(): PollSystem {
    if (!PollSystem.instance) {
      PollSystem.instance = new PollSystem();
    }
    return PollSystem.instance;
  }

  async createPoll(message: Message, question: string, options: string[], duration: number): Promise<void> {
    if (options.length < 2 || options.length > 10) {
      throw new Error('Polls must have between 2 and 10 options.');
    }

    const pollId = Math.random().toString(36).substr(2, 9);
    const endTime = Date.now() + duration * 60 * 1000; // duration in minutes

    const embed = {
      title: '📊 Poll',
      description: question,
      fields: options.map((option, index) => ({
        name: \`\${this.reactions[index]} Option \${index + 1}\`,
        value: option,
        inline: false
      })),
      footer: { text: \`Poll ID: \${pollId} | Ends in \${duration} minutes\` },
      color: 0x5865f2
    };

    const pollMessage = await message.channel.send({ embeds: [embed] });

    // Add reactions
    for (let i = 0; i < options.length; i++) {
      await pollMessage.react(this.reactions[i]);
    }

    const poll: Poll = {
      id: pollId,
      question,
      options,
      votes: new Map(),
      messageId: pollMessage.id,
      channelId: message.channel.id,
      endTime
    };

    this.polls.set(pollId, poll);

    // Auto-end poll
    setTimeout(() => {
      this.endPoll(pollId);
    }, duration * 60 * 1000);
  }

  handleReaction(reaction: MessageReaction, user: User): void {
    const poll = this.findPollByMessageId(reaction.message.id);
    if (!poll || user.bot) return;

    const optionIndex = this.reactions.indexOf(reaction.emoji.name || '');
    if (optionIndex === -1 || optionIndex >= poll.options.length) return;

    // Remove previous vote
    const previousVote = poll.votes.get(user.id);
    if (previousVote !== undefined) {
      poll.votes.delete(user.id);
    }

    // Add new vote
    poll.votes.set(user.id, optionIndex);
  }

  private findPollByMessageId(messageId: string): Poll | undefined {
    return Array.from(this.polls.values()).find(poll => poll.messageId === messageId);
  }

  private async endPoll(pollId: string): Promise<void> {
    const poll = this.polls.get(pollId);
    if (!poll) return;

    // Calculate results
    const results = new Array(poll.options.length).fill(0);
    poll.votes.forEach(optionIndex => {
      results[optionIndex]++;
    });

    const totalVotes = poll.votes.size;
    const resultText = poll.options.map((option, index) => {
      const votes = results[index];
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      return \`\${this.reactions[index]} \${option}: **\${votes}** votes (\${percentage}%)\`;
    }).join('\\n');

    const embed = {
      title: '📊 Poll Results',
      description: poll.question,
      fields: [
        { name: 'Results', value: resultText, inline: false },
        { name: 'Total Votes', value: totalVotes.toString(), inline: true }
      ],
      color: 0x00ff00,
      footer: { text: \`Poll ended | ID: \${pollId}\` }
    };

    // Try to edit the original message
    try {
      // This would need the actual channel and message objects
      // Implementation depends on how you store/retrieve Discord objects
    } catch (error) {
      console.error('Error updating poll message:', error);
    }

    this.polls.delete(pollId);
  }

  getPoll(pollId: string): Poll | undefined {
    return this.polls.get(pollId);
  }
}`;
}

function generatePollCommand(): string {
  return `import { Message } from 'discord.js';
import { PollSystem } from '../plugins/polls';

export const name = 'poll';
export const description = 'Create and manage polls';

export async function execute(message: Message, args: string[]) {
  if (args.length < 3) {
    return message.reply({
      embeds: [{
        title: '📊 Poll Command',
        description: 'Create polls with multiple options',
        fields: [
          { 
            name: 'Usage', 
            value: '!poll <duration_minutes> "<question>" "<option1>" "<option2>" [more options...]',
            inline: false 
          },
          { 
            name: 'Example', 
            value: '!poll 60 "What\'s your favorite color?" "Red" "Blue" "Green"',
            inline: false 
          }
        ],
        color: 0x5865f2
      }]
    });
  }

  const duration = parseInt(args[0]);
  if (isNaN(duration) || duration < 1 || duration > 1440) {
    return message.reply('❌ Duration must be between 1 and 1440 minutes (24 hours).');
  }

  // Parse quoted arguments
  const text = args.slice(1).join(' ');
  const matches = text.match(/"([^"]*)"/g);
  
  if (!matches || matches.length < 3) {
    return message.reply('❌ Please provide a question and at least 2 options in quotes.');
  }

  const question = matches[0].slice(1, -1);
  const options = matches.slice(1).map(match => match.slice(1, -1));

  if (options.length > 10) {
    return message.reply('❌ Maximum 10 options allowed.');
  }

  try {
    const polls = PollSystem.getInstance();
    await polls.createPoll(message, question, options, duration);
    
    await message.delete().catch(() => {}); // Clean up command message
  } catch (error) {
    message.reply(\`❌ Error creating poll: \${error.message}\`);
  }
}`;
}

function generateReactionRolesPlugin(): string {
  return `import { MessageReaction, User, GuildMember } from 'discord.js';

interface ReactionRole {
  messageId: string;
  channelId: string;
  guildId: string;
  emoji: string;
  roleId: string;
}

export class ReactionRoles {
  private static instance: ReactionRoles;
  private reactionRoles = new Map<string, ReactionRole[]>(); // messageId -> ReactionRole[]

  static getInstance(): ReactionRoles {
    if (!ReactionRoles.instance) {
      ReactionRoles.instance = new ReactionRoles();
    }
    return ReactionRoles.instance;
  }

  addReactionRole(messageId: string, channelId: string, guildId: string, emoji: string, roleId: string): void {
    const key = messageId;
    const existing = this.reactionRoles.get(key) || [];
    
    // Check if this emoji already exists for this message
    const existingIndex = existing.findIndex(rr => rr.emoji === emoji);
    if (existingIndex !== -1) {
      existing[existingIndex].roleId = roleId; // Update existing
    } else {
      existing.push({ messageId, channelId, guildId, emoji, roleId });
    }
    
    this.reactionRoles.set(key, existing);
  }

  removeReactionRole(messageId: string, emoji: string): boolean {
    const existing = this.reactionRoles.get(messageId);
    if (!existing) return false;

    const filtered = existing.filter(rr => rr.emoji !== emoji);
    if (filtered.length === 0) {
      this.reactionRoles.delete(messageId);
    } else {
      this.reactionRoles.set(messageId, filtered);
    }

    return true;
  }

  async handleReactionAdd(reaction: MessageReaction, user: User): Promise<void> {
    if (user.bot) return;

    const reactionRoles = this.reactionRoles.get(reaction.message.id);
    if (!reactionRoles) return;

    const emoji = reaction.emoji.name || reaction.emoji.toString();
    const reactionRole = reactionRoles.find(rr => rr.emoji === emoji);
    if (!reactionRole) return;

    try {
      const member = reaction.message.guild?.members.cache.get(user.id);
      if (!member) return;

      const role = reaction.message.guild?.roles.cache.get(reactionRole.roleId);
      if (!role) return;

      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
        console.log(\`Added role \${role.name} to \${user.tag}\`);
      }
    } catch (error) {
      console.error('Error adding reaction role:', error);
    }
  }

  async handleReactionRemove(reaction: MessageReaction, user: User): Promise<void> {
    if (user.bot) return;

    const reactionRoles = this.reactionRoles.get(reaction.message.id);
    if (!reactionRoles) return;

    const emoji = reaction.emoji.name || reaction.emoji.toString();
    const reactionRole = reactionRoles.find(rr => rr.emoji === emoji);
    if (!reactionRole) return;

    try {
      const member = reaction.message.guild?.members.cache.get(user.id);
      if (!member) return;

      const role = reaction.message.guild?.roles.cache.get(reactionRole.roleId);
      if (!role) return;

      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        console.log(\`Removed role \${role.name} from \${user.tag}\`);
      }
    } catch (error) {
      console.error('Error removing reaction role:', error);
    }
  }

  getReactionRoles(messageId: string): ReactionRole[] {
    return this.reactionRoles.get(messageId) || [];
  }

  getAllReactionRoles(): Map<string, ReactionRole[]> {
    return new Map(this.reactionRoles);
  }
}`;
}

function generateReactRoleCommand(): string {
  return `import { Message } from 'discord.js';
import { ReactionRoles } from '../plugins/reaction-roles';

export const name = 'reactrole';
export const description = 'Setup reaction roles';

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('ManageRoles')) {
    return message.reply('❌ You need Manage Roles permission to use this command.');
  }

  const subcommand = args[0]?.toLowerCase();

  switch (subcommand) {
    case 'add':
      if (args.length < 4) {
        return message.reply('❌ Usage: !reactrole add <messageId> <emoji> <@role>');
      }

      const messageId = args[1];
      const emoji = args[2];
      const roleMatch = args[3].match(/<@&(\\d+)>/);
      
      if (!roleMatch) {
        return message.reply('❌ Please mention a valid role.');
      }

      const roleId = roleMatch[1];
      const role = message.guild?.roles.cache.get(roleId);
      
      if (!role) {
        return message.reply('❌ Role not found.');
      }

      try {
        // Try to fetch the message to validate it exists
        const targetMessage = await message.channel.messages.fetch(messageId);
        
        const reactionRoles = ReactionRoles.getInstance();
        reactionRoles.addReactionRole(
          messageId,
          message.channel.id,
          message.guild!.id,
          emoji,
          roleId
        );

        // Add the reaction to the message
        await targetMessage.react(emoji);

        message.reply(\`✅ Reaction role added: \${emoji} → \${role.name}\`);
      } catch (error) {
        message.reply('❌ Message not found or invalid emoji.');
      }
      break;

    case 'remove':
      if (args.length < 3) {
        return message.reply('❌ Usage: !reactrole remove <messageId> <emoji>');
      }

      const removeMessageId = args[1];
      const removeEmoji = args[2];

      const reactionRoles = ReactionRoles.getInstance();
      const success = reactionRoles.removeReactionRole(removeMessageId, removeEmoji);

      if (success) {
        message.reply(\`✅ Reaction role removed: \${removeEmoji}\`);
      } else {
        message.reply('❌ Reaction role not found.');
      }
      break;

    case 'list':
      const listMessageId = args[1];
      if (!listMessageId) {
        return message.reply('❌ Usage: !reactrole list <messageId>');
      }

      const roles = ReactionRoles.getInstance().getReactionRoles(listMessageId);
      if (roles.length === 0) {
        return message.reply('❌ No reaction roles found for this message.');
      }

      const roleList = roles.map(rr => {
        const role = message.guild?.roles.cache.get(rr.roleId);
        return \`\${rr.emoji} → \${role?.name || 'Unknown Role'}\`;
      }).join('\\n');

      message.reply({
        embeds: [{
          title: '🎭 Reaction Roles',
          description: roleList,
          color: 0x5865f2
        }]
      });
      break;

    default:
      message.reply({
        embeds: [{
          title: '🎭 Reaction Role Commands',
          fields: [
            { name: '!reactrole add <messageId> <emoji> <@role>', value: 'Add a reaction role', inline: false },
            { name: '!reactrole remove <messageId> <emoji>', value: 'Remove a reaction role', inline: false },
            { name: '!reactrole list <messageId>', value: 'List reaction roles for a message', inline: false }
          ],
          color: 0x5865f2
        }]
      });
  }
}`;
}
