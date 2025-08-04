export function generateMusicPlugin(): string {
  return `import { VoiceConnectionStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } from '@discordjs/voice';
import { Guild, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';

interface QueueItem {
  title: string;
  url: string;
  requestedBy: string;
}

export class MusicPlayer {
  private static instances = new Map<string, MusicPlayer>();
  private queue: QueueItem[] = [];
  private player = createAudioPlayer();
  private connection: any = null;
  private isPlaying = false;

  static getInstance(guildId: string): MusicPlayer {
    if (!this.instances.has(guildId)) {
      this.instances.set(guildId, new MusicPlayer());
    }
    return this.instances.get(guildId)!;
  }

  async join(channel: VoiceChannel) {
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    this.connection.subscribe(this.player);
    
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.playNext();
    });
  }

  async addToQueue(url: string, title: string, requestedBy: string) {
    this.queue.push({ url, title, requestedBy });
    
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    const song = this.queue.shift()!;
    this.isPlaying = true;

    try {
      const stream = ytdl(song.url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      this.player.play(resource);
    } catch (error) {
      console.error('Error playing song:', error);
      this.playNext();
    }
  }

  skip() {
    this.player.stop();
  }

  stop() {
    this.queue = [];
    this.player.stop();
    this.isPlaying = false;
  }

  getQueue() {
    return this.queue;
  }

  disconnect() {
    this.connection?.destroy();
    this.stop();
  }
}`;
}

export function generatePlayCommand(): string {
  return `import { Message } from 'discord.js';
import { MusicPlayer } from '../plugins/music';
import ytdl from 'ytdl-core';

export const name = 'play';
export const description = 'Play music from YouTube';

export async function execute(message: Message, args: string[]) {
  if (!message.member?.voice.channel) {
    return message.reply('❌ You need to be in a voice channel to play music!');
  }

  const url = args[0];
  if (!url) {
    return message.reply('❌ Please provide a YouTube URL or search term!');
  }

  try {
    const player = MusicPlayer.getInstance(message.guild!.id);
    
    if (!ytdl.validateURL(url)) {
      return message.reply('❌ Please provide a valid YouTube URL!');
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    await player.join(message.member.voice.channel);
    await player.addToQueue(url, title, message.author.tag);

    message.reply(\`🎵 Added to queue: **\${title}**\`);
  } catch (error) {
    console.error('Play command error:', error);
    message.reply('❌ Failed to play the song. Please try again.');
  }
}`;
}

export function generateQueueCommand(): string {
  return `import { Message } from 'discord.js';
import { MusicPlayer } from '../plugins/music';

export const name = 'queue';
export const description = 'Show music queue';

export async function execute(message: Message, args: string[]) {
  const player = MusicPlayer.getInstance(message.guild!.id);
  const queue = player.getQueue();

  if (queue.length === 0) {
    return message.reply('📭 The queue is empty!');
  }

  const queueList = queue.slice(0, 10).map((song, index) => 
    \`\${index + 1}. **\${song.title}** - Requested by \${song.requestedBy}\`
  ).join('\\n');

  message.reply({
    embeds: [{
      title: '🎵 Music Queue',
      description: queueList + (queue.length > 10 ? \`\\n\\n...and \${queue.length - 10} more songs\` : ''),
      color: 0x5865f2
    }]
  });
}`;
}

export function generateSkipCommand(): string {
  return `import { Message } from 'discord.js';
import { MusicPlayer } from '../plugins/music';

export const name = 'skip';
export const description = 'Skip current song';

export async function execute(message: Message, args: string[]) {
  if (!message.member?.voice.channel) {
    return message.reply('❌ You need to be in a voice channel to skip music!');
  }

  const player = MusicPlayer.getInstance(message.guild!.id);
  player.skip();
  
  message.reply('⏭️ Skipped the current song!');
}`;
}

export function generateStopCommand(): string {
  return `import { Message } from 'discord.js';
import { MusicPlayer } from '../plugins/music';

export const name = 'stop';
export const description = 'Stop music and clear queue';

export async function execute(message: Message, args: string[]) {
  if (!message.member?.voice.channel) {
    return message.reply('❌ You need to be in a voice channel to stop music!');
  }

  const player = MusicPlayer.getInstance(message.guild!.id);
  player.stop();
  player.disconnect();
  
  message.reply('⏹️ Stopped music and cleared the queue!');
}`;
}
