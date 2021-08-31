import { MessageEmbed, MessageEmbedImage, MessageEmbedOptions } from 'discord.js';
import { ProductModel } from 'jumbo-wrapper';
import { createUrlFromProduct } from '../utils/product';

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
