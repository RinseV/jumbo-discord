import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Jumbo } from 'jumbo-wrapper';
import { RecipeData, RecipeModel } from 'jumbo-wrapper/dist/recipe/recipeModel';

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

// Function to create an embed from a page of recipes (always 10 recipes per page)
export async function getRecipeEmbedFromRecipes(recipeName: string, page: number): Promise<MessageEmbed> {
    const jumbo = new Jumbo();
    const recipes = await jumbo.recipe().getRecipesFromName(recipeName, (page - 1) * 10);
    if (!recipes) {
        throw new Error('No recipes found');
    }
    return createEmbedFromRecipes(recipeName, recipes, page);
}
