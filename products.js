// Centralized product data and renderer for Tazamall
const PRODUCTS = [
    { id: 'p1', name: 'Wireless Earbuds', price: 1500, category: 'electronics', image: 'https://via.placeholder.com/200x200/0000ff/ffffff?text=Earbuds', description: 'Clear sound, long battery' },
    { id: 'p2', name: 'Smart Watch', price: 2500, category: 'electronics', image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Smart+Watch', description: 'Health tracking and calls' },
    { id: 'p3', name: 'Bluetooth Speaker', price: 1800, category: 'electronics', image: 'https://via.placeholder.com/200x200/444444/ffffff?text=Speaker', description: 'Portable speaker with bass' },
    { id: 'p4', name: 'Android Charger', price: 350, category: 'electronics', image: 'https://via.placeholder.com/200x200/555555/ffffff?text=Charger', description: 'Fast charging USB-A' },

    { id: 'p5', name: "Men’s Sneakers", price: 2700, category: 'fashion', image: 'https://via.placeholder.com/200x200/ff4444/ffffff?text=Sneakers', description: 'Comfortable everyday sneakers' },
    { id: 'p6', name: 'Hoodie', price: 1400, category: 'fashion', image: 'https://via.placeholder.com/200x200/bb0000/ffffff?text=Hoodie', description: 'Cozy cotton hoodie' },
    { id: 'p7', name: 'Laptop Backpack', price: 1200, category: 'fashion', image: 'https://via.placeholder.com/200x200/222222/ffffff?text=Backpack', description: 'Padded laptop compartment' },

    { id: 'p8', name: 'Electric Kettle', price: 1800, category: 'kitchen', image: 'https://via.placeholder.com/200x200/00ccaa/ffffff?text=Kettle', description: '1.7L fast-boil kettle' },
    { id: 'p9', name: '2L Blender', price: 3200, category: 'kitchen', image: 'https://via.placeholder.com/200x200/009977/ffffff?text=Blender', description: 'High-speed blender' },
    { id: 'p10', name: 'Kitchen Utensils Set', price: 900, category: 'kitchen', image: 'https://via.placeholder.com/200x200/006655/ffffff?text=Utensils', description: '10-piece utensil set' },

    { id: 'p11', name: "Men’s Watch", price: 2000, category: 'accessories', image: 'https://via.placeholder.com/200x200/888888/ffffff?text=Watch', description: 'Classic wristwatch' },
    { id: 'p12', name: 'Sunglasses', price: 650, category: 'accessories', image: 'https://via.placeholder.com/200x200/444444/ffffff?text=Sunglasses', description: 'UV400 protection' },
    { id: 'p13', name: 'Baseball Cap', price: 500, category: 'accessories', image: 'https://via.placeholder.com/200x200/222222/ffffff?text=Cap', description: 'Adjustable cap' },
];

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-title">${product.name}</div>
        <div class="product-price">KES ${product.price}</div>
        <button class="add-btn">Add to Cart</button>
    `;

    const btn = card.querySelector('.add-btn');
    btn.addEventListener('click', () => {
        // Use existing addToCart function from cart.js (by id)
        if (typeof addToCart === 'function') {
            addToCart(product.id);
        } else {
            alert('Cart not available');
        }
    });

    return card;
}

// Render products into either #product-list (homepage) or .products-grid (category pages)
function displayProducts(category = 'all') {
    const listContainer = document.getElementById('product-list');
    const gridContainer = document.querySelector('.products-grid');

    const items = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

    if (listContainer) {
        listContainer.innerHTML = '';
        items.forEach(p => listContainer.appendChild(createProductCard(p)));
        return;
    }

    if (gridContainer) {
        gridContainer.innerHTML = '';
        items.forEach(p => gridContainer.appendChild(createProductCard(p)));
        return;
    }

    // fallback: append to body
    items.forEach(p => document.body.appendChild(createProductCard(p)));
}

// Expose PRODUCTS and displayProducts for debugging or external use
window.PRODUCTS = PRODUCTS;
window.displayProducts = displayProducts;
