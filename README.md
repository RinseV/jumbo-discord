# Jumbo Discord bot

A Discord bot that allows for basic Jumbo API interaction.

## Functionality
* Search products
* Search stores
* Search recipes

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
This shows the nearest Jumbo store to the given address, including the store's opening times and crow-fly distance.

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