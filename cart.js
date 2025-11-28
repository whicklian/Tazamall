// ====== cart.js ======
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart helper
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = count;
}

// Try to migrate legacy cart format {name, price, qty} -> {id, qty}
function migrateLegacyCart() {
    if (!Array.isArray(cart) || cart.length === 0) return;
    // detect legacy by checking for 'name' property on first item
    const first = cart[0];
    if (!first || !first.name) return;
    if (typeof window === 'undefined' || !window.PRODUCTS) return;

    const migrated = [];
    cart.forEach(entry => {
        if (!entry.name) return;
        const match = window.PRODUCTS.find(p => p.name === entry.name || p.name === entry.title);
        if (match) {
            migrated.push({ id: match.id, qty: entry.qty || 1 });
        } else {
            // no match: ignore legacy item but log it
            console.warn('Could not migrate legacy cart item:', entry.name);
        }
    });
    if (migrated.length > 0) {
        cart = migrated;
        saveCart();
    }
}

// Add product to cart by product id
function addToCart(productId) {
    if (!productId) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    saveCart();
    updateCartCount();

    // show friendly message with product name when PRODUCTS is available
    const product = (window.PRODUCTS || []).find(p => p.id === productId);
    const label = product ? product.name : 'Item';
    alert(`${label} added to cart!`);
}

// Change quantity (delta can be negative)
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
    updateCartCount();
    displayCartItems();
}

// Remove an item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
}

// Display cart items on cart.html
function displayCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const product = (window.PRODUCTS || []).find(p => p.id === item.id) || {};
        const name = product.name || item.id;
        const price = product.price || 0;
        const img = product.image || '';

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-left">
                <img src="${img}" alt="${name}" class="cart-thumb" />
            </div>
            <div class="cart-mid">
                <div class="cart-name">${name}</div>
                <div class="cart-price">KES ${price}</div>
            </div>
            <div class="cart-right">
                <div class="qty-controls">
                    <button class="qty-minus">-</button>
                    <span class="qty">${item.qty}</span>
                    <button class="qty-plus">+</button>
                </div>
                <div class="cart-sub">KES ${price * item.qty}</div>
                <button class="remove-item">Remove</button>
            </div>
        `;

        // wire buttons
        const minus = div.querySelector('.qty-minus');
        const plus = div.querySelector('.qty-plus');
        const removeBtn = div.querySelector('.remove-item');

        minus.addEventListener('click', () => changeQty(item.id, -1));
        plus.addEventListener('click', () => changeQty(item.id, 1));
        removeBtn.addEventListener('click', () => removeFromCart(item.id));

        container.appendChild(div);
        total += price * item.qty;
    });

    const totalElem = document.getElementById('total-amount');
    if (totalElem) totalElem.textContent = total;
}

// Expose cart functions globally so other scripts can use them
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;

// Initialize: attempt migration then update UI
document.addEventListener('DOMContentLoaded', () => {
    migrateLegacyCart();
    updateCartCount();
    displayCartItems();
});