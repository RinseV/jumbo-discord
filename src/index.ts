import { CommandInteraction, Intents, Interaction, MessageEmbed } from 'discord.js';
import dotenvSafe from 'dotenv-safe';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { CommandClient } from './client';
import { getProductEmbedFromProductName } from './embeds/product';

dotenvSafe.config();

const dirPath = resolve(__dirname, './commands');

const client = new CommandClient({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = readdirSync(dirPath).filter((file) => file.endsWith('.ts'));

// Initialise commands in the client
for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`${dirPath}/${file}`);
    client.commands.set(command.data.name, command);
}

// Initialise discord bot
client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

// Handle command interactions
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const commandInteraction = interaction as CommandInteraction;

    // Find command with command name
    const command = client.commands.get(commandInteraction.commandName);

    // If command is not found, return
    if (!command) {
        console.log(`${commandInteraction.commandName} not found`);
        return;
    }

    // Execute command
    try {
        await command.execute(commandInteraction);
    } catch (error) {
        console.error(error);
    }
});

// Handle select interactions
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isSelectMenu()) return;

    // Selection menu for products
    if (interaction.customId === 'product-select') {
        // Get selected product name
        const productName = interaction.values[0];

        try {
            // Get product embed from name
            const embed: MessageEmbed = await getProductEmbedFromProductName(productName);
            await interaction.update({ embeds: [embed] });
        } catch (error) {
            await interaction.update(`No products found for: \`\`${productName}\`\``);
            return;
        }
    }
});

client.login(process.env.TOKEN);
