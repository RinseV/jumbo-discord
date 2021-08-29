import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getRecipeEmbedFromRecipeName } from '../embeds/recipe';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recipe')
        .setDescription('Get a recipe')
        .addStringOption((option) => option.setName('name').setDescription('Enter a recipe name').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const recipeName = interaction.options.getString('name')!;

        // Defer interaction to allow for more time
        await interaction.deferReply();

        try {
            // Get recipe and reply with embed
            const embed: MessageEmbed = await getRecipeEmbedFromRecipeName(recipeName);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply(`No recipe found for : \`\`${recipeName}\`\``);
        }
    }
};
