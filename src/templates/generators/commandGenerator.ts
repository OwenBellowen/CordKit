// Command generators for CordKit projects based on Chibi-bot architecture
// This file now serves as a re-export hub for the separated command generators
import type { InitOptions } from "../initTemplate";

// Re-export all command generation functions from the commands directory
export {
  generateSampleEvent,
  generateSampleCommand,
  generateSlashCommand,
} from "./commands/index";

// Individual command generators are now in separate files:
// - ./commands/musicCommands.ts
// - ./commands/moderationCommands.ts
// - ./commands/economyCommands.ts
// - ./commands/gamingCommands.ts
// - ./commands/aiCommands.ts
// - ./commands/utilityCommands.ts
// - ./commands/generalCommands.ts
