export interface Plugin {
  name: string;
  description: string;
  files: { [key: string]: string };
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: { [key: string]: string };
}

// Import all plugin generators
import {
  generateAutoModPlugin,
  generateAutoModCommand,
} from "./generators/auto-mod";

import {
  generateEconomyPlugin,
  generateBalanceCommand,
  generateDailyCommand,
} from "./generators/economy";

import {
  generateLevelsPlugin,
  generateRankCommand,
  generateLeaderboardCommand,
} from "./generators/levels";

import {
  generateTicketPlugin,
  generateTicketCommand,
} from "./generators/tickets";

import { generatePollsPlugin, generatePollCommand } from "./generators/polls";

import {
  generateReactionRolesPlugin,
  generateReactRoleCommand,
} from "./generators/reaction-roles";

import {
  generateMusicPlugin,
  generatePlayCommand,
  generateQueueCommand,
  generateSkipCommand,
  generateStopCommand,
} from "./generators/music";

import {
  generateWelcomePlugin,
  generateWelcomeCommand,
} from "./generators/welcome";

import {
  generateGiveawayPlugin,
  generateGiveawayCommand,
} from "./generators/giveaway";

import {
  generateModlogPlugin,
  generateModlogCommand,
  generateWarnCommand,
  generateMuteCommand,
  generateBanCommand,
  generateKickCommand,
} from "./generators/modlog";

import {
  generateStarboardPlugin,
  generateStarboardCommand,
} from "./generators/starboard";

import {
  generateRemindersPlugin,
  generateRemindCommand,
  generateRemindersListCommand,
} from "./generators/reminders";

import {
  generateAutoRolePlugin,
  generateAutoRoleCommand,
} from "./generators/auto-role";

import {
  generateCountingPlugin,
  generateCountingCommand,
} from "./generators/counting";

import {
  generateSuggestionsPlugin,
  generateSuggestCommand,
  generateSuggestionsCommand,
} from "./generators/suggestions";

import {
  generateCustomCommandsPlugin,
  generateCustomCommandCommand,
} from "./generators/custom-commands";

import {
  generateLoggingPlugin,
  generateLoggingCommand,
} from "./generators/logging";

export const availablePlugins: { [key: string]: Plugin } = {
  "auto-mod": {
    name: "Auto Moderation",
    description: "Automatic message filtering and user moderation",
    dependencies: ["bad-words"],
    files: {
      "plugins/automod.ts": generateAutoModPlugin(),
      "commands/automod.ts": generateAutoModCommand(),
    },
  },
  economy: {
    name: "Economy System",
    description: "Virtual currency and economy features",
    files: {
      "plugins/economy.ts": generateEconomyPlugin(),
      "commands/balance.ts": generateBalanceCommand(),
      "commands/daily.ts": generateDailyCommand(),
    },
  },
  levels: {
    name: "Leveling System",
    description: "User experience and leveling system",
    files: {
      "plugins/levels.ts": generateLevelsPlugin(),
      "commands/rank.ts": generateRankCommand(),
      "commands/leaderboard.ts": generateLeaderboardCommand(),
    },
  },
  tickets: {
    name: "Ticket System",
    description: "Support ticket system with categories",
    files: {
      "plugins/tickets.ts": generateTicketPlugin(),
      "commands/ticket.ts": generateTicketCommand(),
    },
  },
  polls: {
    name: "Polls & Voting",
    description: "Create polls and voting systems",
    files: {
      "plugins/polls.ts": generatePollsPlugin(),
      "commands/poll.ts": generatePollCommand(),
    },
  },
  "react-roles": {
    name: "Reaction Roles",
    description: "Role assignment via message reactions",
    files: {
      "plugins/reaction-roles.ts": generateReactionRolesPlugin(),
      "commands/reactrole.ts": generateReactRoleCommand(),
    },
  },
  music: {
    name: "Music Player",
    description: "Play music from YouTube and Spotify",
    dependencies: ["@discordjs/voice", "ytdl-core", "ffmpeg-static"],
    files: {
      "plugins/music.ts": generateMusicPlugin(),
      "commands/play.ts": generatePlayCommand(),
      "commands/queue.ts": generateQueueCommand(),
      "commands/skip.ts": generateSkipCommand(),
      "commands/stop.ts": generateStopCommand(),
    },
  },
  welcome: {
    name: "Welcome System",
    description: "Welcome messages and auto-role assignment",
    files: {
      "plugins/welcome.ts": generateWelcomePlugin(),
      "commands/welcome.ts": generateWelcomeCommand(),
    },
  },
  giveaway: {
    name: "Giveaway System",
    description: "Create and manage server giveaways",
    files: {
      "plugins/giveaway.ts": generateGiveawayPlugin(),
      "commands/giveaway.ts": generateGiveawayCommand(),
    },
  },
  modlog: {
    name: "Moderation Logs",
    description: "Advanced moderation logging and tracking",
    files: {
      "plugins/modlog.ts": generateModlogPlugin(),
      "commands/modlog.ts": generateModlogCommand(),
      "commands/warn.ts": generateWarnCommand(),
      "commands/mute.ts": generateMuteCommand(),
      "commands/ban.ts": generateBanCommand(),
      "commands/kick.ts": generateKickCommand(),
    },
  },
  starboard: {
    name: "Starboard",
    description: "Star messages to highlight them in a special channel",
    files: {
      "plugins/starboard.ts": generateStarboardPlugin(),
      "commands/starboard.ts": generateStarboardCommand(),
    },
  },
  reminders: {
    name: "Reminder System",
    description: "Set personal and server reminders",
    dependencies: ["node-cron"],
    files: {
      "plugins/reminders.ts": generateRemindersPlugin(),
      "commands/remind.ts": generateRemindCommand(),
      "commands/reminders.ts": generateRemindersListCommand(),
    },
  },
  autorole: {
    name: "Auto Roles",
    description: "Automatic role assignment for new members",
    files: {
      "plugins/autorole.ts": generateAutoRolePlugin(),
      "commands/autorole.ts": generateAutoRoleCommand(),
    },
  },
  counting: {
    name: "Counting Game",
    description: "Channel counting game with leaderboards",
    files: {
      "plugins/counting.ts": generateCountingPlugin(),
      "commands/counting.ts": generateCountingCommand(),
    },
  },
  suggestions: {
    name: "Suggestion System",
    description: "Server suggestion system with voting",
    files: {
      "plugins/suggestions.ts": generateSuggestionsPlugin(),
      "commands/suggest.ts": generateSuggestCommand(),
      "commands/suggestions.ts": generateSuggestionsCommand(),
    },
  },
  customcommands: {
    name: "Custom Commands",
    description: "Create custom text commands with variables",
    files: {
      "plugins/customcommands.ts": generateCustomCommandsPlugin(),
      "commands/customcommand.ts": generateCustomCommandCommand(),
    },
  },
  logging: {
    name: "Server Logging",
    description: "Comprehensive server event logging",
    files: {
      "plugins/logging.ts": generateLoggingPlugin(),
      "commands/logging.ts": generateLoggingCommand(),
    },
  },
};
