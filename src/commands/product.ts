import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { ProductModel } from 'jumbo-wrapper';
import {
    getProductEmbedFromProductName,
    getProductEmbedFromProducts,
    getProductsFromProductName
} from '../utils/product';

// Product command to get first result from the product search
module.exports = {
    data: new SlashCommandBuilder()
        .setName('product')
        .setDescription('Get Jumbo product')
        .addStringOption((option) => option.setName('name').setDescription('Enter a product name').setRequired(true))
        .addIntegerOption((option) => option.setName('amount').setDescription('Amount of products to show')),
    async execute(interaction: CommandInteraction) {
        // Get product name from interaction
        const productName = interaction.options.getString('name')!;
        const amount = interaction.options.getInteger('amount') || 1;

        // Check that amount > 0 and <= 25, Jumbo limits to 25 products per query
        if (amount <= 0 || amount > 25) {
            interaction.reply('Amount must be greater than 0 and at most 25');
            return;
        }

        // Defer interaction to allow for more time
        await interaction.deferReply();

        try {
            // If only asked for 1 product, show single product in embed
            if (amount === 1) {
                const embed: MessageEmbed = await getProductEmbedFromProductName(productName);
                await interaction.editReply({ embeds: [embed] });
                return;
            }
            // If asked for more, show all products in embed
            const embed: MessageEmbed = await getProductEmbedFromProducts(productName, amount);

            const products = await getProductsFromProductName(productName, amount);

            const selection = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('product-select')
                    .setPlaceholder('Nothing selected')
                    // We use the product name as key, otherwise the images won't show up
                    .addOptions(
                        products.map((product: ProductModel) => {
                            return {
                                label: product.product.data.title,
                                value: product.product.data.title
                            };
                        })
                    )
            );

            await interaction.editReply({ embeds: [embed], components: [selection] });
            return;
        } catch (error) {
            console.error(error);
            await interaction.editReply(`No products found for: \`\`${productName}\`\``);
            return;
        }
    }
};
