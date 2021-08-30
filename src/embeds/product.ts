import { MessageEmbed, MessageEmbedImage, MessageEmbedOptions } from 'discord.js';
import { Jumbo } from 'jumbo-wrapper';
import { ProductModel } from 'jumbo-wrapper/dist/product/productModel';
import { ProductSortOptions } from 'jumbo-wrapper/dist/product/productQueryModel';

/**
 * Creates an embed for a list of products
 * @param query Query used to search for products
 * @param products Products belonging to query
 * @returns Embed with products
 */
export function createEmbedFromProducts(query: string, products: ProductModel[]): MessageEmbed {
    const embed: MessageEmbedOptions = {
        color: 0xfdc513,
        title: `Results for \`\`${query}\`\``,
        fields: [],
        timestamp: new Date(),
        footer: {
            text: 'Powered by Jumbo',
            icon_url: 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png'
        },
        url: `https://www.jumbo.com/zoeken?searchTerms=${query}`
    };

    if (products.length > 0) {
        products.forEach((product: ProductModel, i: number) => {
            embed.fields?.push({
                name: `Result #${i + 1}`,
                value: product.product.data.title,
                inline: false
            });
        });
    } else {
        embed.fields?.push({
            name: 'Error',
            value: 'No results found',
            inline: false
        });
    }

    return new MessageEmbed(embed);
}

/**
 * Creates an embed for a single product with name, price, URL and image
 * @param product Product to show
 * @returns Embed with product information
 */
export function createEmbedFromProduct(product: ProductModel): MessageEmbed {
    const imagePartial: Partial<MessageEmbedImage> = {
        url: product.product.data.imageInfo.primaryView[0].url
    };
    const embed: MessageEmbedOptions = {
        color: 0xfdc513,
        title: `${product.product.data.title}`,
        fields: [
            {
                name: 'Price',
                value: `€ ${(product.product.data.prices.price.amount / 100).toFixed(2)}`,
                inline: true
            },
            {
                name: 'Quantity',
                value: `${product.product.data.quantity}`,
                inline: true
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'Powered by Jumbo',
            icon_url: 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png'
        },
        url: createUrlFromProduct(product.product.data.title, product.product.data.id),
        image: imagePartial
    };

    return new MessageEmbed(embed);
}

// Creates a url from a product
function createUrlFromProduct(name: string, id: string) {
    return `https://www.jumbo.com/${name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')}/${id}`;
}

// Creates a message embed from a product name
export async function getProductEmbedFromProductName(productName: string): Promise<MessageEmbed> {
    const jumbo = new Jumbo();
    const product = await jumbo.product().getFirstProductFromName(productName, ProductSortOptions.POPULAR);
    // console.log(JSON.stringify(product, undefined, 4));
    if (!product) {
        throw new Error('No product found');
    }
    return createEmbedFromProduct(product);
}

// Creates a message embed from a product name and amount
export async function getProductEmbedFromProducts(productName: string, limit: number): Promise<MessageEmbed> {
    const jumbo = new Jumbo();
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
    const jumbo = new Jumbo();
    const products = await jumbo
        .product()
        .getProductsFromName(productName, 0, limit, undefined, ProductSortOptions.POPULAR);
    if (!products) {
        throw new Error('No products found');
    }
    return products;
}
