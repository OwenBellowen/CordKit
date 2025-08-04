export function generateAutoModPlugin(): string {
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
    const repeatedChar = new RegExp("(.)\\\\1{10,}");
    const repeatedWord = /\\\\b(\\\\w+)\\\\s+\\\\1\\\\s+\\\\1/i;
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

export function generateAutoModCommand(): string {
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
