export function generateLoggingPlugin(): string {
  return `export class Logging {}`;
}

export function generateLoggingCommand(): string {
  return `export const name = 'logging';`;
}
