import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { createEmbedFromStore } from '../embeds/store';
import { interpretCoordinates, findNearestStore } from '../utils/store';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Get nearest Jumbo store from address')
        .addStringOption((option) =>
            option.setName('address').setDescription('Enter a physical address').setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        // Get address
        const addressString = interaction.options.getString('address')!;

        // Defer interaction to allow for more time
        await interaction.deferReply();

        try {
            // Get location, find nearest store and send embed
            const coordinates = await interpretCoordinates(addressString);
            const storeLocationData = await findNearestStore(coordinates);
            const message = await createEmbedFromStore(interaction.guildId!, coordinates, storeLocationData.store);
            await interaction.editReply(message);
            return;
        } catch (error) {
            console.error(error);
            await interaction.editReply(`Invalid address: \`\`${addressString}\`\``);
            return;
        }
    }
};
