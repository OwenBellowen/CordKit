// Sample interaction event for CordKit projects based on Chibi-bot architecture
import type { InitOptions } from "../initTemplate";

export function generateInteractionCreateEvent(options: InitOptions): string {
  if (options.template === "typescript") {
    return `import { BaseEvent } from "../../interfaces";
import BotClient from "../../structures/Client";
import {
    CommandInteraction,
    AutocompleteInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ButtonInteraction,
    Interaction,
} from "discord.js";

export default <BaseEvent>{
    name: "interactionCreate",
    async execute(client: BotClient, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(client, interaction);
        } else if (interaction.isAutocomplete()) {
            await handleAutocomplete(client, interaction);
        } else if (interaction.isStringSelectMenu()) {
            await handleStringSelectMenu(client, interaction);
        } else if (interaction.isModalSubmit()) {
            await handleModalSubmit(client, interaction);
        } else if (interaction.isButton()) {
            await handleButton(client, interaction);
        }
    }
};

async function handleChatInputCommand(client: BotClient, interaction: CommandInteraction): Promise<void> {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(\`Error executing command \${interaction.commandName}:\`, error);
        
        const errorMessage = "There was an error executing this command!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleAutocomplete(client: BotClient, interaction: AutocompleteInteraction): Promise<void> {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
        await command.autocomplete(interaction);
    } catch (error) {
        console.error(\`Error executing autocomplete for \${interaction.commandName}:\`, error);
    }
}

async function handleStringSelectMenu(client: BotClient, interaction: StringSelectMenuInteraction): Promise<void> {
    const selectMenu = client.selectMenus.get(interaction.customId);
    if (!selectMenu) return;

    try {
        await selectMenu.execute(interaction);
    } catch (error) {
        console.error(\`Error executing select menu \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this interaction!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleModalSubmit(client: BotClient, interaction: ModalSubmitInteraction): Promise<void> {
    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    try {
        await modal.execute(interaction);
    } catch (error) {
        console.error(\`Error executing modal \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this modal!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleButton(client: BotClient, interaction: ButtonInteraction): Promise<void> {
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    try {
        await button.execute(interaction);
    } catch (error) {
        console.error(\`Error executing button \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this button!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}`;
  } else {
    return `module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(client, interaction);
        } else if (interaction.isAutocomplete()) {
            await handleAutocomplete(client, interaction);
        } else if (interaction.isStringSelectMenu()) {
            await handleStringSelectMenu(client, interaction);
        } else if (interaction.isModalSubmit()) {
            await handleModalSubmit(client, interaction);
        } else if (interaction.isButton()) {
            await handleButton(client, interaction);
        }
    }
};

async function handleChatInputCommand(client, interaction) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(\`Error executing command \${interaction.commandName}:\`, error);
        
        const errorMessage = "There was an error executing this command!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleAutocomplete(client, interaction) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
        await command.autocomplete(interaction);
    } catch (error) {
        console.error(\`Error executing autocomplete for \${interaction.commandName}:\`, error);
    }
}

async function handleStringSelectMenu(client, interaction) {
    const selectMenu = client.selectMenus.get(interaction.customId);
    if (!selectMenu) return;

    try {
        await selectMenu.execute(interaction);
    } catch (error) {
        console.error(\`Error executing select menu \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this interaction!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleModalSubmit(client, interaction) {
    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    try {
        await modal.execute(interaction);
    } catch (error) {
        console.error(\`Error executing modal \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this modal!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

async function handleButton(client, interaction) {
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    try {
        await button.execute(interaction);
    } catch (error) {
        console.error(\`Error executing button \${interaction.customId}:\`, error);
        
        const errorMessage = "There was an error processing this button!";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}`;
  }
}
