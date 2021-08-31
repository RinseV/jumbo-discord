import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getRecipeEmbedFromRecipeName, getRecipeEmbedFromRecipes } from '../utils/recipe';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recipe')
        .setDescription('Get a recipe')
        .addStringOption((option) => option.setName('name').setDescription('Enter a recipe name').setRequired(true))
        .addIntegerOption((option) => option.setName('page').setDescription('Enter a page number').setRequired(false)),
    async execute(interaction: CommandInteraction) {
        const recipeName = interaction.options.getString('name')!;
        const page = interaction.options.getInteger('page');

        if (page && page <= 0) {
            interaction.reply('Page number must be greater than 0');
            return;
        }

        // Defer interaction to allow for more time
        await interaction.deferReply();

        try {
            if (!page) {
                // Get recipe and reply with embed
                const embed: MessageEmbed = await getRecipeEmbedFromRecipeName(recipeName);
                await interaction.editReply({ embeds: [embed] });
                return;
            }
            const embed: MessageEmbed = await getRecipeEmbedFromRecipes(recipeName, page);

            await interaction.editReply({ embeds: [embed] });
            return;
        } catch (error) {
            await interaction.editReply(`No recipe found for : \`\`${recipeName}\`\``);
            return;
        }
    }
};
