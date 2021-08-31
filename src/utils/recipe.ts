import { MessageEmbed } from 'discord.js';
import { RecipeData, Jumbo } from 'jumbo-wrapper';
import { createEmbedFromRecipe, createEmbedFromRecipes } from '../embeds/recipe';
import axiosConfig from './jumbo';

// Function to capitalise first letter of string
export function capitaliseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to get the first recipe from a query
export async function getFirstRecipeFromQuery(query: string): Promise<RecipeData> {
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
    const recipe = await jumbo.recipe().getFirstRecipeFromName(query);
    if (!recipe) {
        throw new Error('Recipe not found');
    }
    const recipeFull = await jumbo.recipe().getRecipeFromId(parseInt(recipe.recipe.data.id));
    return recipeFull.recipe.data;
}

// Function to get recipe data from an ID
export async function getRecipeDataFromId(recipeId: string): Promise<RecipeData> {
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
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
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
    const recipes = await jumbo.recipe().getRecipesFromName(recipeName, (page - 1) * 10);
    if (!recipes) {
        throw new Error('No recipes found');
    }
    return createEmbedFromRecipes(recipeName, recipes, page);
}
