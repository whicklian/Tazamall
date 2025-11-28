// ====== payment.js ======
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const mpesaPopup = document.getElementById('mpesa-popup');
    const confirmBtn = document.getElementById('confirm-payment');

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // show mpesa popup which now asks for phone (and PIN will be entered on phone after STK push)
        mpesaPopup.style.display = 'flex';
    });

    confirmBtn.addEventListener('click', async () => {
        const phone = document.getElementById('mpesa-pin').value.trim();
        // reusing mpesa-pin input as phone input in the popup for STK Push flow
        if (!phone || phone.length < 9) {
            alert('Please enter a valid phone number (e.g. 2547XXXXXXXX)');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        // compute total using PRODUCTS if available
        const products = window.PRODUCTS || [];
        let totalAmount = 0;
        cart.forEach(it => {
            const p = products.find(x => x.id === it.id) || {};
            totalAmount += (p.price || 0) * it.qty;
        });

        if (totalAmount <= 0) {
            alert('Cart total is invalid or 0');
            return;
        }

        // call backend STK push
        try {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Initiating...';

            const resp = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, amount: totalAmount, accountRef: 'Tazamall' })
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error ? JSON.stringify(data) : 'STK push failed');

            // Daraja returns CheckoutRequestID and response code/message
            alert('Payment request sent — check your phone to enter PIN.');
            mpesaPopup.style.display = 'none';

            // After initiating STK push, real confirmation will come via webhook to server.
            // For demo purposes, clear cart and redirect to homepage (or you can wait for webhook)
            localStorage.removeItem('cart');
            window.location.href = 'Tazamall.html';
        } catch (err) {
            console.error('Payment error', err);
            alert('Payment initiation failed: ' + (err.message || err));
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm Payment';
        }
    });
});