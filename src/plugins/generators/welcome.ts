export function generateWelcomePlugin(): string {
  return `export class WelcomeSystem {
  // Welcome system implementation
}`;
}

export function generateWelcomeCommand(): string {
  return `export const name = 'welcome';
export const description = 'Configure welcome system';
// Welcome command implementation`;
}
