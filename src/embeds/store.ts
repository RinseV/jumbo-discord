import distance from '@turf/distance';
import greatCircle from '@turf/great-circle';
import { addDays, differenceInMinutes, format, fromUnixTime, isBefore, parse } from 'date-fns';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Jumbo } from 'jumbo-wrapper';
import { StoreData } from 'jumbo-wrapper/dist/store/storeModel';
import NodeGeocoder, { OpenStreetMapOptions } from 'node-geocoder';
import StaticMaps, { AddMarkerOptions } from 'staticmaps';

/**
 * Creates an embed from a store
 * @param inAddress Address from query
 * @param store Closest store to query
 * @returns Embed from closest store
 */
export function createEmbedFromStore(inAddress: Coordinates, store: StoreData): MessageEmbed {
    const storeCoordinates: Coordinates = {
        longitude: store.longitude,
        latitude: store.latitude
    };
    const distance = calculateDistance(inAddress, storeCoordinates);
    const embed: MessageEmbedOptions = {
        color: 0xfdc513,
        title: `${store.name}`,
        fields: [
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
        ],
        timestamp: new Date(),
        footer: {
            text: 'Powered by Jumbo',
            icon_url: 'https://i.pinimg.com/originals/b8/f7/8d/b8f78da1ace339ea151ec64c3b04b746.png'
        },
        url: createUrlFromStoreName(store.name)
    };

    return new MessageEmbed(embed);
}

// Formats the opening times of a store
function formatOpeningTimesValue(store: StoreData) {
    let res = '';
    const times = store.openingTimes.filter((openingTime) => {
        return openingTime.today;
    })[0].time;
    res += times;
    if (!isOpen(store) && store.openingTimes[1]) {
        res += ` (Currenty closed, opens in ${getNextOpeningTime(store)})`;
    } else if (!isOpen(store)) {
        res += ' (Currently closed)';
    }
    return res;
}

// Calculates the time to the next opening time
function getNextOpeningTime(store: StoreData) {
    const times = store.openingTimes[1].time;
    const openingTime = times.slice(0, 5);
    const openingDate = parse(openingTime, 'HH:mm', addDays(new Date(), 1));
    const difference = differenceInMinutes(openingDate, new Date());
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    if (hours) {
        if (minutes === 1) {
            return `${hours} hours and ${minutes} minute`;
        } else {
            return `${hours} hours and ${minutes} minutes`;
        }
    } else {
        if (minutes === 1) {
            return `${minutes} minute`;
        } else {
            return `${minutes} minutes`;
        }
    }
}

// Checks whether a store is currently open
function isOpen(store: StoreData) {
    // Get opening times
    const times = store.openingTimes[0].time;
    // Only look at closing
    const closingTime = times.slice(-5);
    // Change into date
    const closingDate = parse(closingTime, 'HH:mm', new Date());
    return isBefore(new Date(), closingDate);
}

// Formats opening times of a store
function formatOpeningTimes(store: StoreData): string {
    const times = store.openingTimes;
    const today: Date[] = times
        .filter((openingTime) => {
            return openingTime.today;
        })
        .map((openingTime) => {
            return fromUnixTime((openingTime.date - (openingTime.date % 1000)) / 1000);
        });
    return format(today[0], 'dd/MM/yyyy');
}

// Formats the distance to a store (metric)
function formatDistance(distance: number): string {
    if (distance < 1) {
        return (distance * 1000).toFixed(1).toString() + ' m';
    } else {
        return distance.toFixed(3).toString() + ' km';
    }
}

function createUrlFromStoreName(name: string) {
    return `https://www.jumbo.com/winkel/${name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')}`;
}

// Formats the address of coordinates
function formatAddress(inAddress: Coordinates) {
    let address = '';
    if (inAddress.streetName && inAddress.streetNumber) {
        address += `${inAddress.streetName} ${inAddress.streetNumber}, `;
    } else if (inAddress.streetName) {
        address += `${inAddress.streetName}, `;
    }
    if (inAddress.zipcode) {
        address += `${inAddress.zipcode}  `;
    }
    if (inAddress.city) {
        address += `${inAddress.city}, `;
    }
    address += `${inAddress.country}`;
    return address;
}

export interface Coordinates {
    longitude: number;
    latitude: number;
    streetName?: string;
    streetNumber?: string;
    zipcode?: string;
    city?: string;
    country?: string;
}

// Calculates the distance between two coordinates
export function calculateDistance(queryCoordinates: Coordinates, storeCoordinates: Coordinates): number {
    return distance(
        [queryCoordinates.longitude, queryCoordinates.latitude],
        [storeCoordinates.longitude, storeCoordinates.latitude]
    );
}

// Finds nearest Jumbo store to given coordinates
export async function findNearestStore(coordinates: Coordinates): Promise<StoreLocationData> {
    const jumbo = new Jumbo();
    const storeQuery = await jumbo.store().getNearestStoreFromLongLat(coordinates.longitude, coordinates.latitude);
    const store = await jumbo.store().getStoreFromId(parseInt(storeQuery.store.data.id));
    const storeCoordinates: Coordinates = {
        longitude: store.store.data.longitude,
        latitude: store.store.data.latitude
    };
    return {
        store: store.store.data,
        storeCoordinates: storeCoordinates
    };
}

export interface StoreLocationData {
    store: StoreData;
    storeCoordinates: Coordinates;
}

// Takes a string address and converts them to longitude and latitude (if possible)
export async function interpretCoordinates(address: string): Promise<Coordinates> {
    const options: OpenStreetMapOptions = {
        provider: 'openstreetmap'
    };
    const geocoder = NodeGeocoder(options);
    const res = await geocoder.geocode(address);
    if (!res[0].longitude || !res[0].latitude) {
        throw new Error('Invalid address');
    }
    return {
        longitude: res[0].longitude,
        latitude: res[0].latitude,
        streetName: res[0].streetName,
        streetNumber: res[0].streetNumber,
        zipcode: res[0].zipcode,
        city: res[0].city,
        country: res[0].country
    };
}

// Generates a map image from a given address and a store address
export async function generateMapImage(coordinates: Coordinates, storeCoordinates: Coordinates): Promise<void> {
    const options = {
        width: 600,
        height: 400
    };
    const map = new StaticMaps(options);
    const marker: AddMarkerOptions = {
        coord: [coordinates.longitude, coordinates.latitude],
        img: 'marker.png',
        height: 48,
        width: 48
    };
    const jumboMarker: AddMarkerOptions = {
        coord: [storeCoordinates.longitude, storeCoordinates.latitude],
        img: 'jumboMarker.png',
        height: 48,
        width: 48
    };
    map.addMarker(marker);
    map.addMarker(jumboMarker);

    const storeDistance = calculateDistance(coordinates, storeCoordinates);

    // If more than 500 km, use great circle
    if (storeDistance > 500) {
        const gcLine = greatCircle(
            [coordinates.longitude, coordinates.latitude],
            [storeCoordinates.longitude, storeCoordinates.latitude],
            {
                npoints: 200
            }
        );

        map.addLine({
            coords: gcLine.geometry.coordinates as Array<[number, number]>,
            color: '#000000',
            width: 1
        });
    } else {
        map.addLine({
            coords: [
                [coordinates.longitude, coordinates.latitude],
                [storeCoordinates.longitude, storeCoordinates.latitude]
            ],
            color: '#000000',
            width: 1
        });
    }

    await map.render();
    await map.image.save('map.png');
}
