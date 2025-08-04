// Prompt handling for generate command
import prompts from "prompts";
import type { GenerateOptions } from "./utils";

export async function promptGenerateOptions(
  cliOpts: any,
): Promise<GenerateOptions> {
  const questions: prompts.PromptObject[] = [];

  // Component type
  if (!cliOpts.type) {
    questions.push({
      type: "select",
      name: "type",
      message: "What component would you like to generate?",
      choices: [
        {
          title: "Slash Command",
          value: "slash-command",
          description: "Modern Discord slash command",
        },
        {
          title: "Event Handler",
          value: "event",
          description: "Discord.js event listener",
        },
      ],
    });
  }

  // Component name
  if (!cliOpts.name) {
    questions.push({
      type: "text",
      name: "name",
      message: "Component name:",
      validate: (value: string) =>
        value.length > 0 ? true : "Component name is required",
    });
  }

  // Description
  questions.push({
    type: "text",
    name: "description",
    message: "Component description (optional):",
    initial: "",
  });

  // Category for commands
  questions.push({
    type: (prev: any, values: any) =>
      values.type === "slash-command" ? "text" : null,
    name: "category",
    message: "Command category (optional):",
    initial: "general",
  });

  // Permissions for commands
  questions.push({
    type: (prev: any, values: any) =>
      values.type === "slash-command" ? "multiselect" : null,
    name: "permissions",
    message: "Required permissions (optional):",
    choices: [
      { title: "Administrator", value: "Administrator" },
      { title: "Manage Guild", value: "ManageGuild" },
      { title: "Manage Channels", value: "ManageChannels" },
      { title: "Manage Messages", value: "ManageMessages" },
      { title: "Manage Roles", value: "ManageRoles" },
      { title: "Ban Members", value: "BanMembers" },
      { title: "Kick Members", value: "KickMembers" },
      { title: "Moderate Members", value: "ModerateMembers" },
    ],
  });

  const answers = await prompts(questions);

  return {
    type: cliOpts.type || answers.type,
    name: cliOpts.name || answers.name,
    description: answers.description || `${answers.name} component`,
    category: answers.category || "general",
    permissions: answers.permissions || [],
  };
}
