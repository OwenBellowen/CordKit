export function generateModlogPlugin(): string {
  return `export class ModerationLog {
  // Moderation log implementation
}`;
}

export function generateModlogCommand(): string {
  return `export const name = 'modlog';`;
}

export function generateWarnCommand(): string {
  return `export const name = 'warn';`;
}

export function generateMuteCommand(): string {
  return `export const name = 'mute';`;
}

export function generateBanCommand(): string {
  return `export const name = 'ban';`;
}

export function generateKickCommand(): string {
  return `export const name = 'kick';`;
}
