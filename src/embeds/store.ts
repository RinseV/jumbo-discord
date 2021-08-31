import { MessageAttachment, MessageEmbed, WebhookMessageOptions } from 'discord.js';
import {
    calculateDistance,
    Coordinates,
    createUrlFromStoreName,
    formatAddress,
    formatDistance,
    formatOpeningTimes,
    formatOpeningTimesValue,
    generateMapImage
} from '../utils/store';
import { StoreData } from 'jumbo-wrapper';

/**
 * Creates an embed from a store
 * @param inAddress Address from query
 * @param store Closest store to query
 * @returns Embed from closest store
 */
export async function createEmbedFromStore(
    guildId: string,
    inAddress: Coordinates,
    store: StoreData
): Promise<WebhookMessageOptions> {
    const storeCoordinates: Coordinates = {
        longitude: store.longitude,
        latitude: store.latitude
    };
    const distance = calculateDistance(inAddress, storeCoordinates);

    // Generate map image
    await generateMapImage(guildId, inAddress, storeCoordinates);
    const image = new MessageAttachment(`src/assets/${guildId}/map.png`);

    const embed = new MessageEmbed()
        .setTitle(store.name)
        .setColor(0xfdc513)
        .setFields([
            {
                name: 'Your address',
                value: formatAddress(inAddress),
                inline: false
            },
            {
                name: 'Store address',
                value: `${store.streetAddress}, ${store.zipCode.replace(' ', '')}  ${store.cityName}`,
                inline: false
            },
            {
                name: `Opening times (${formatOpeningTimes(store)})`,
                value: formatOpeningTimesValue(store),
                inline: false
            },
            {
                name: 'Distance (Crow-Fly)',
                value: `${formatDistance(distance)}`,
                inline: false
            }
        ])
        .setTimestamp(new Date())
        .setFooter('Powered by Jumbo', 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png')
        .setURL(createUrlFromStoreName(store.name))
        .setImage('attachment://map.png');

    return { embeds: [embed], files: [image] };
}
