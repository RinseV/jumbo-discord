import dotenvSafe from 'dotenv-safe';
import { CommandInteraction, Intents, Interaction } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { CommandClient } from './client';

dotenvSafe.config();

const dirPath = resolve(__dirname, './commands');

const client = new CommandClient({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = readdirSync(dirPath).filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`${dirPath}/${file}`);
    client.commands.set(command.data.name, command);
}

// Initialise discord bot
client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

// Handle message events
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand) return;

    const commandInteraction = interaction as CommandInteraction;

    const command = client.commands.get(commandInteraction.commandName);

    if (!command) {
        console.log(`${commandInteraction.commandName} not found`);
        return;
    }

    try {
        await command.execute(commandInteraction);
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.TOKEN);
