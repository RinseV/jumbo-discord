/* eslint-disable indent */
import { MessageEmbed } from 'discord.js';
import { ProductModel } from 'jumbo-wrapper';
import { createUrlFromProduct } from '../utils/product';

/**
 * Creates an embed for a list of products
 * @param query Query used to search for products
 * @param products Products belonging to query
 * @returns Embed with products
 */
export function createEmbedFromProducts(query: string, products: ProductModel[]): MessageEmbed {
    return new MessageEmbed()
        .setColor(0xfdc513)
        .setTitle(`Results for \`\`${query}\`\``)
        .setURL(`https://www.jumbo.com/zoeken?searchTerms=${query}`)
        .setTimestamp(new Date())
        .setFooter('Powered by Jumbo', 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png')
        .setFields(
            products.length > 0
                ? products.map((product: ProductModel, i: number) => {
                      return {
                          name: `Result #${i + 1}`,
                          value: product.product.data.title,
                          inline: false
                      };
                  })
                : [
                      {
                          name: 'Error',
                          value: 'No results found',
                          inline: false
                      }
                  ]
        );
}

/**
 * Creates an embed for a single product with name, price, URL and image
 * @param product Product to show
 * @returns Embed with product information
 */
export function createEmbedFromProduct(product: ProductModel): MessageEmbed {
    return new MessageEmbed()
        .setColor(0xfdc513)
        .setTitle(product.product.data.title)
        .setURL(createUrlFromProduct(product.product.data.title, product.product.data.id))
        .setTimestamp(new Date())
        .setFooter('Powered by Jumbo', 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png')
        .setImage(product.product.data.imageInfo.primaryView[0].url)
        .setFields([
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
        ]);
}
