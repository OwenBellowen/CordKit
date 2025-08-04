export function generateCustomCommandsPlugin(): string {
  return `export class CustomCommands {}`;
}

export function generateCustomCommandCommand(): string {
  return `export const name = 'customcommand';`;
}
