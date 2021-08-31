import { MessageEmbed } from 'discord.js';
import { Jumbo, ProductSortOptions, ProductModel } from 'jumbo-wrapper';
import { createEmbedFromProduct, createEmbedFromProducts } from '../embeds/product';
import axiosConfig from './jumbo';

// Creates a url from a product
export function createUrlFromProduct(name: string, id: string): string {
    return `https://www.jumbo.com/${name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')}/${id}`;
}

// Creates a message embed from a product name
export async function getProductEmbedFromProductName(productName: string): Promise<MessageEmbed> {
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
    const product = await jumbo.product().getFirstProductFromName(productName, ProductSortOptions.POPULAR);
    // console.log(JSON.stringify(product, undefined, 4));
    if (!product) {
        throw new Error('No product found');
    }
    return createEmbedFromProduct(product);
}

// Creates a message embed from a product name and amount
export async function getProductEmbedFromProducts(productName: string, limit: number): Promise<MessageEmbed> {
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
    const products = await jumbo
        .product()
        .getProductsFromName(productName, 0, limit, undefined, ProductSortOptions.POPULAR);
    if (!products) {
        throw new Error('No products found');
    }
    return createEmbedFromProducts(productName, products);
}

// Get list of products given product name and amount
export async function getProductsFromProductName(productName: string, limit: number): Promise<ProductModel[]> {
    const jumbo = new Jumbo(undefined, undefined, undefined, axiosConfig);
    const products = await jumbo
        .product()
        .getProductsFromName(productName, 0, limit, undefined, ProductSortOptions.POPULAR);
    if (!products) {
        throw new Error('No products found');
    }
    return products;
}
