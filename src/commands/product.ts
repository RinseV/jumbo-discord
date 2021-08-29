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
        const productName = interaction.options.getString('name');

        if (!productName) {
            interaction.reply({ content: 'Product not found', ephemeral: true });
            return;
        }

        try {
            const embed: MessageEmbed = await getProductEmbedFromProductName(productName);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            interaction.reply({ content: `No products found for: \`\`${productName}\`\``, ephemeral: true });
        }
    }
};
