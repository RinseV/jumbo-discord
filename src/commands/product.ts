import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getProductEmbedFromProductName } from '../embeds/product';

// Product command to get first result from the product search
module.exports = {
    data: new SlashCommandBuilder()
        .setName('product')
        .setDescription('Get Jumbo product')
        .addStringOption((option) => option.setName('name').setDescription('Enter a product name').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        // Get product name from interaction
        const productName = interaction.options.getString('name')!;

        // Defer interaction to allow for more time
        await interaction.deferReply();

        try {
            // Get product and reply with embed
            const embed: MessageEmbed = await getProductEmbedFromProductName(productName);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply(`No products found for: \`\`${productName}\`\``);
        }
    }
};
