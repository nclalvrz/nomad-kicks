let products =
JSON.parse(localStorage.getItem("products"));

if(!products){

products = [

    { id: 1, name: "asics netburner", price: 5995.00, image: "images/product1.jpg" },
    { id: 2, name: "nike kobe girl dad", price: 11495.00, image: "images/product2.jpg" },
    { id: 3, name: "hoka running", price: 8495.00, image: "images/product3.jpg" },
    { id: 4, name: "adidas adizero lightstrike pro", price: 12995.00, image: "images/product4.jpg" },
    { id: 5, name: "oncloud running", price: 8295.00, image: "images/product5.jpg" },
    { id: 6, name: "onitsuka tiger classic", price: 6595.00, image: "images/product6.jpg" },
    { id: 7, name: "james harden 8", price: 8995.00, image: "images/product7.jpg" },
    { id: 8, name: "jordan 4", price: 10995.00, image: "images/product8.jpg" },
    { id: 9, name: "puma suede", price: 5495.00, image: "images/product9.jpg" },
    { id: 10, name: "nike air force 1", price: 5495.00, image: "images/product10.jpg" },
    { id: 11, name: "nike bapesta", price: 7895.00, image: "images/product11.jpg" },
    { id: 12, name: "new balance 550", price: 6895.00, image: "images/product12.jpg" },
    { id: 13, name: "ja morant 13", price: 7295.00, image: "images/product13.jpg" },
    { id: 14, name: "vans potato bandana", price: 4995.00, image: "images/product14.jpg" }

];

localStorage.setItem(
    "products",
    JSON.stringify(products)
);

}

let cart = JSON.parse(localStorage.getItem("nomadCart")) || [];
function saveCart() {
    localStorage.setItem("nomadCart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Dark Mode System Toggle Switcher
    const darkBtn = document.getElementById("darkModeBtn");
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");

    if(darkBtn){
        darkBtn.textContent = "☀️";
    }
}

if (darkBtn) {
    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
        document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        darkBtn.textContent =
        isDark ? "☀️" : "🌙";
    });
}

    // 2. Sliding Cart Drawer Overlay Animations
    const cartBtn = document.getElementById("cartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartSidebar = document.getElementById("cartSidebar");

    if (cartBtn && cartSidebar) cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
    if (closeCartBtn && cartSidebar) closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

    // 3. Immersive Home Hero CTA Anchor Scroll Navigation Link
    const shopBtn = document.getElementById("shopNowBtn");
    if (shopBtn) {
        shopBtn.addEventListener("click", () => {
            const gridSection = document.querySelector(".products-section");
            if (gridSection) {
                gridSection.scrollIntoView({ behavior: "smooth" });
            } else {
                window.location.href = "shop.html";
            }
        });
    }

    // 4. Hook up checkout button to prompt system modal review stage
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            // Close sidebar drawer, show dynamic processing module review
            cartSidebar.classList.remove("open");
            openCheckoutModalWindow();
        });
    }

    displayProducts();
});

function displayProducts() {
    const grids = document.querySelectorAll("#productGrid");
    grids.forEach(productGrid => {
        if (!productGrid) return;
        productGrid.innerHTML = "";
        
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';">
                <h3 style="text-transform: capitalize; font-size:1.1rem; font-weight:600; text-align:left; color:inherit;">${product.name}</h3>
                <p class="product-price" style="color:#ff4757; font-weight:600; margin: 5px 0 15px 0; text-align:left;">₱${product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productGrid.appendChild(card);
        });
    });
}

window.addToCart = function(productId) {

    const item = products.find(p => p.id === productId);

    const existingItem = cart.find(c => c.id === productId);

if(existingItem){
    existingItem.quantity++;
} else {
    cart.push({
        ...item,
        quantity: 1
    });
}

saveCart();
updateCartUI();

    if(typeof syncDashboardCartView === "function"){
        syncDashboardCartView();
    }

    document.getElementById("cartSidebar")?.classList.add("open");
};

window.removeFromCart = function(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();
    updateCartUI();

    if(typeof syncDashboardCartView === "function"){
        syncDashboardCartView();
    }
};

function updateCartUI() {
    const cartCountLabel = document.getElementById("cartCount");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalLabel = document.getElementById("cartTotalValue");

    if (cartCountLabel) cartCountLabel.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <div class="cart-item-details" style="text-align: left;">
                        <h4 style="text-transform: capitalize; font-size:0.95rem; font-weight:600; color:inherit;">${item.name}</h4>
                        <p style="font-size:0.85rem; color:#666;">₱${item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">✕</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }
    }

    if (cartTotalLabel) {
        const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        cartTotalLabel.textContent = grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 });
    }
}

/* INTERACTIVE CHECKOUT MODAL IMPLEMENTATION WINDOW FLOWS */
function openCheckoutModalWindow() {
    const modal = document.getElementById("checkoutModal");
    const summaryContainer = document.getElementById("checkoutItemsList");
    const grandTotalLabel = document.getElementById("checkoutGrandTotal");

    if (!modal || !summaryContainer || !grandTotalLabel) return;

    summaryContainer.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "checkout-summary-item";
        div.innerHTML = `
            <span style="text-transform: capitalize;">${item.name} (x${item.quantity})</span>
            <span>₱${(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
        `;
        summaryContainer.appendChild(div);
    });

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    grandTotalLabel.textContent = grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 });

    modal.classList.add("open");
}

window.closeCheckoutModalWindow = function() {
    document.getElementById("checkoutModal")?.classList.remove("open");
};

window.handleFinalOrderPlacement = function() {

    const address =
    document.getElementById("deliveryAddress")?.value.trim();

    if(!address){

        alert("Please enter your delivery address.");
        return;
    }

    const selectedOption =
    document.querySelector(
        'input[name="paymentOption"]:checked'
    );

    const paymentMethod =
    selectedOption ? selectedOption.value : "GCash";

    if(
        paymentMethod === "GCash" ||
        paymentMethod === "Card"
    ){

        window.pendingPaymentMethod =
        paymentMethod;

        openPaymentModal(paymentMethod);

        return;
    }

    finalizeOrder(
        paymentMethod,
        address
    );
};
window.completeOrder = function(){

    closePaymentModal();

    const address =
    document.getElementById(
        "deliveryAddress"
    )?.value.trim();

    finalizeOrder(
        window.pendingPaymentMethod,
        address
    );
}

function finalizeOrder(
    paymentMethod,
    address
){

    alert(
        `Thank you for shopping!

Payment Method: ${paymentMethod}

Delivery Address:
${address}`
    );

    cart = [];

    saveCart();

    updateCartUI();

    closeCheckoutModalWindow();
}

document.addEventListener("DOMContentLoaded", () => {

    updateCartUI();

    if(typeof syncDashboardCartView === "function"){
        syncDashboardCartView();
    }

});

function updateAccountNav(){

    const navLink =
    document.getElementById(
        "accountNavLink"
    );

    if(!navLink) return;

    if(
        sessionStorage.getItem("isAdmin")
        === "true"
    ){

        navLink.textContent =
        "Admin Profile";

        navLink.href =
        "login.html";

        return;
    }

    if(
        sessionStorage.getItem("isLoggedIn")
        === "true"
    ){

        navLink.textContent =
        "My Profile";

        navLink.href =
        "login.html";

        return;
    }

    navLink.textContent =
    "Login";

    navLink.href =
    "login.html";
}

function closePaymentModal(){

    document
    .getElementById("paymentModal")
    ?.classList.remove("open");
}

function openPaymentModal(method){

    const modal =
    document.getElementById(
        "paymentModal"
    );

    const content =
    document.getElementById(
        "paymentContent"
    );

    if(method === "GCash"){

        content.innerHTML = `

            <div style="text-align:center;">

                <h3>GCash Payment</h3>

                <p>
                    Scan QR Code Below
                </p>

                <img
                    src="images/gcash-qr.png"
                    style="
                        width:220px;
                        margin:20px auto;
                        display:block;
                    "
                >

                <p>
                    GCash Number:
                    <strong>
                    0965-443-3283
                    </strong>
                </p>

                <p>
                    Account Name:
                    <strong>
                    Nomad Kicks (Ni***e A.)
                    </strong>
                </p>

                <button
                    class="add-to-cart-btn"
                    onclick="completeOrder()">

                    I Have Paid

                </button>

            </div>
        `;
    }

    if(method === "Card"){

        content.innerHTML = `

            <h3>Card Payment</h3>

<div style="font-size:40px;margin-bottom:15px;">
💳 Visa • Mastercard
</div>

            <input
        type="text"
        id="cardHolder"
        placeholder="Name of Cardholder"
        class="auth-input-element"
    >

    <input
        type="text"
        id="cardNumber"
        placeholder="Card Number"
        class="auth-input-element"
    >

    <input
        type="text"
        id="cardExpiry"
        placeholder="MM/YY"
        class="auth-input-element"
    >

    <input
        type="text"
        id="cardCVV"
        placeholder="CVV"
        class="auth-input-element"
    >

    <button
        class="add-to-cart-btn"
        onclick="completeOrder()">

        Pay Now

    </button>
`;
    }

    modal.classList.add("open");
}
