# Jumbo Discord bot

A Discord bot that allows for basic Jumbo API interaction. This bot uses the [jumbo-wrapper](https://www.npmjs.com/package/jumbo-wrapper) package to communicate with the Jumbo API. Note: if you are hosting the bot on a server that is not located in the Netherlands, you'll need to use a proxy! For more info, see the [jumbo-wrapper repo](https://github.com/RinseV/jumbo-wrapper).

## Functionality
* Search products
* Search stores
* Search recipes

## Installation
1. Clone this repo
2. Make sure you are using Node version 16 (if you are using nvm, just type ``nvm use``)
3. Install the necessary packages by running ``npm install`` or ``yarn``
4. Copy the ``.env.example`` file, rename it to ``.env`` and fill in your details (first 3 are for Discord)
5. If you will not be using a proxy, go into `src/utils/jumbo.ts` and make the `axiosConfig` object an empty object
5. Invite the bot to the server you have defined in the ``.env`` file
6. Start the bot by running ``npm run start`` or ``yarn start``

## Usage

### Products
Finding the first product that matches a query:
```bash
/product <name>
```
This will show an embed of the first product that matches the query, this embed includes the product's price, quantity and the URL to the product page.

<br/>

Finding the first *x* products that match a query:
```bash
/product <name> <amount>
```
The amount of products per query can be at most 25, this is a limitation on Jumbo's side. Once queried, an embed is shown with a selection menu from where you can select a single product to show more information about the product.

<br/>

### Stores
Finding the nearest store to a given address:
```bash
/store <address>
```
This shows the nearest Jumbo store to the given address, including the store's opening times and crow-fly distance. This embed also includes a map image with pins showing the given location and the nearest store's location.

<br/>

### Recipes
Find a recipe matching a query:
```bash
/recipe <query>
```

<br/>

Finding multiple recipes that match a query:
```bash
/recipe <query> <page>
```
10 recipes will be shown per page.