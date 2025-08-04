export function generateCountingPlugin(): string {
  return `export class Counting {}`;
}

export function generateCountingCommand(): string {
  return `export const name = 'counting';`;
}
