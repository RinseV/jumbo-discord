import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { RecipeData, RecipeModel } from 'jumbo-wrapper';
import { capitaliseFirstLetter } from '../utils/recipe';

/**
 * Creates an embed from a recipe
 * @param recipe Recipe to create embed for
 * @returns Embed of recipe
 */
export function createEmbedFromRecipe(recipe: RecipeData): MessageEmbed {
    const embed: MessageEmbedOptions = {
        color: 0xfdc513,
        title: `${recipe.name}`,
        fields: [
            {
                name: 'Difficulty',
                value: capitaliseFirstLetter(recipe.difficultyLevel!),
                inline: true
            },
            {
                name: 'Cooking time',
                value: `${recipe.cookingTime} minutes`,
                inline: true
            },
            {
                name: '** **',
                value: '** **',
                inline: false
            },
            {
                name: 'Number of portions',
                value: recipe.numberOfPortions.toString(),
                inline: true
            },
            {
                name: 'Course',
                value: capitaliseFirstLetter(recipe.course!),
                inline: true
            },
            {
                name: 'Instructions',
                value: recipe
                    .instructions!.map((instruction: string, index: number) => {
                        return `**${index + 1}.** ${instruction}`;
                    })
                    .join('\n'),
                inline: false
            },
            {
                name: 'Ingredients',
                value: recipe
                    .ingredients!.map((ingredient) => {
                        return `- ${capitaliseFirstLetter(ingredient.name)}`;
                    })
                    .join('\n'),
                inline: false
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'Powered by Jumbo',
            icon_url: 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png'
        },
        url: recipe.webUrl
    };

    return new MessageEmbed(embed);
}

export function createEmbedFromRecipes(query: string, recipes: RecipeModel[], page: number): MessageEmbed {
    const embed: MessageEmbedOptions = {
        color: 0xfdc513,
        title: `Results for \`\`${query}\`\`, page ${page}`,
        fields: [],
        timestamp: new Date(),
        footer: {
            text: 'Powered by Jumbo',
            icon_url: 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png'
        }
    };

    if (recipes.length > 0) {
        recipes.forEach((recipe: RecipeModel) => {
            embed.fields?.push({
                name: `${recipe.recipe.data.name}`,
                value: `[Click here to view](${recipe.recipe.data.webUrl})`,
                inline: false
            });
        });
    } else {
        embed.fields?.push({
            name: 'No results found',
            value: 'Try searching for something else',
            inline: false
        });
    }

    return new MessageEmbed(embed);
}
