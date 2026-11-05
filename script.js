
const API_URL = "https://leila-mobile-backend.ethiodeploy.app/order";

const products = [
    { id: 1, name: "iPhone 16 Pro", price: 262000000 },
    { id: 2, name: "Samsung S25 Ultra", price: 300000000 },
    { id: 3, name: "iPhone 15", price: 65000000 },
    { id: 4, name: "AirPods Pro", price: 12000000 }
];

let cart = [];

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "سبد خرید خالی است.";
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        total += product.price * item.quantity;

        cartItems.innerHTML += `
            <div>
                ${product.name} × ${item.quantity}
                <button onclick="removeFromCart(${item.id})">حذف</button>
            </div>
        `;
    });

    totalElement.textContent =
        total.toLocaleString("fa-IR") + " تومان";
}

function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

async function submitOrder() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !phone || cart.length === 0) {
        alert("لطفاً نام، شماره تماس و محصولات را وارد کنید.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                phone,
                message,
                items: cart
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "خطا در ثبت سفارش");
        }

        alert("سفارش شما با موفقیت ثبت شد.");

        cart = [];
        renderCart();

    } catch (error) {
        alert("خطا در ارسال سفارش: " + error.message);
    }
}

renderCart();
