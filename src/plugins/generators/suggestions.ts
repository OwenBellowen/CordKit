export function generateSuggestionsPlugin(): string {
  return `export class Suggestions {}`;
}

export function generateSuggestCommand(): string {
  return `export const name = 'suggest';`;
}

export function generateSuggestionsCommand(): string {
  return `export const name = 'suggestions';`;
}
