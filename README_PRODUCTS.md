# Products - Tazamall

This file explains the new centralized product data and how pages use it.

- `products.js` contains an array `PRODUCTS` (id, name, price, category, image, description) and a function `displayProducts(category)`.
- The homepage (`Tazamall.html`) calls `displayProducts('all')` to render all products into `#product-list`.
- Category pages (`electronics.html`, `fashion.html`, `kitchen.html`, `accessories.html`) include `products.js` and call `displayProducts('<category>')` on DOMContentLoaded to render that category into the page's `.products-grid`.
- The `addToCart(name, price)` function in `cart.js` is used by product cards to add items to the cart. If you change the signature, update the call in `products.js` accordingly.

To add a new product:
1. Open `products.js` and add a new object to the `PRODUCTS` array with fields: `id`, `name`, `price`, `category`, `image`, `description`.
2. If you add a new category, update the category navigation buttons in `Tazamall.html` and add a page that calls `displayProducts('<new-category>')`.

That's it — product rendering and cart wiring are centralized now.
