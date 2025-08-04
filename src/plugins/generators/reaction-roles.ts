export function generateReactionRolesPlugin(): string {
  return `export class ReactionRoles {
  // Reaction roles implementation
}`;
}

export function generateReactRoleCommand(): string {
  return `export const name = 'reactrole';
export const description = 'Setup reaction roles';
// Reaction role command implementation`;
}
