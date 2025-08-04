export function generateRemindersPlugin(): string {
  return `export class ReminderSystem {}`;
}

export function generateRemindCommand(): string {
  return `export const name = 'remind';`;
}

export function generateRemindersListCommand(): string {
  return `export const name = 'reminders';`;
}
