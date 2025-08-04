export function generateStarboardPlugin(): string {
  return `export class Starboard {}`;
}

export function generateStarboardCommand(): string {
  return `export const name = 'starboard';`;
}
