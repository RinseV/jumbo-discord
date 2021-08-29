import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Jumbo } from 'jumbo-wrapper';
import { RecipeData } from 'jumbo-wrapper/dist/recipe/recipeModel';

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

// Function to capitalise first letter of string
function capitaliseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to get the first recipe from a query
export async function getFirstRecipeFromQuery(query: string): Promise<RecipeData> {
    const jumbo = new Jumbo();
    const recipe = await jumbo.recipe().getFirstRecipeFromName(query);
    if (!recipe) {
        throw new Error('Recipe not found');
    }
    const recipeFull = await jumbo.recipe().getRecipeFromId(parseInt(recipe.recipe.data.id));
    return recipeFull.recipe.data;
}

// Function to get recipe data from an ID
export async function getRecipeDataFromId(recipeId: string): Promise<RecipeData> {
    const jumbo = new Jumbo();
    const recipe = await jumbo.recipe().getRecipeFromId(parseInt(recipeId));
    if (!recipe) {
        throw new Error('Recipe not found');
    }
    return recipe.recipe.data;
}

// Function to get recipe embed from query
export async function getRecipeEmbedFromRecipeName(recipeName: string): Promise<MessageEmbed> {
    const recipe = await getFirstRecipeFromQuery(recipeName);
    return createEmbedFromRecipe(recipe);
}
