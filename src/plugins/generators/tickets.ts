export function generateTicketPlugin(): string {
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

export function generateTicketCommand(): string {
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
