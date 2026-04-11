const images = [
    "far2.avif",
    "far3.jpeg",
    "far4.jpg"
];

let index = 0;
const bannerImage = document.getElementById("bannerImage");

/* =========================
   HERO SLIDER
========================= */
if (document.querySelector(".next")) {
    document.querySelector(".next").onclick = function () {
        index = (index + 1) % images.length;
        bannerImage.src = images[index];
    };
}

if (document.querySelector(".prev")) {
    document.querySelector(".prev").onclick = function () {
        index = (index - 1 + images.length) % images.length;
        bannerImage.src = images[index];
    };
}

/* =========================
   PRODUCT SCROLL
========================= */
function scrollLeftRange() {
    document.getElementById("rangeContainer").scrollBy({
        left: -300,
        behavior: "smooth"
    });
}

function scrollRightRange() {
    document.getElementById("rangeContainer").scrollBy({
        left: 300,
        behavior: "smooth"
    });
}

/* =========================
   LOGIN MODAL
========================= */
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

/* =========================
   CART PANEL
========================= */
function openCart() {
    document.getElementById("cartPanel").style.right = "0";
}

function closeCart() {
    document.getElementById("cartPanel").style.right = "-400px";
}

/* =========================
   GLOBAL VARIABLES
========================= */
let cart = [];
let currentProduct = {};
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* =========================
   PRODUCT DETAILS
========================= */
function showProductDetails(name, price, desc, img) {
    currentProduct = {
        name: name,
        price: parseInt(price.toString().replace(/[^0-9]/g, "")),
        img: img
    };

    document.getElementById("detailName").innerText = name;
    document.getElementById("detailPrice").innerText = price;
    document.getElementById("detailDesc").innerText = desc;
    document.getElementById("detailImg").src = img;
    document.getElementById("productModal").style.display = "flex";
}

function closeProductDetails() {
    document.getElementById("productModal").style.display = "none";
}

/* =========================
   ADD TO CART
========================= */
function addToCart() {
    cart.push(currentProduct);
    updateCartUI();
    closeProductDetails();
    openCart();
}

function updateCartUI() {
    let cartItems = document.getElementById("cartItems");
    let total = 0;
    cartItems.innerHTML = "";

    cart.forEach(item => {
        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Rs.${item.price}</p>
                </div>
            </div>
        `;
    });

    document.getElementById("cartTotal").innerText = "Total: Rs." + total;
}

/* =========================
   REGISTER
========================= */
async function registerUser() {
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let role = document.getElementById("userRole").value;

    let response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
    });

    let data = await response.json();

    if (response.ok) {
        alert(data.message);
        showLogin();
    } else {
        alert(data.message);
    }
}

/* =========================
   LOGIN
========================= */
async function loginUser() {
    let email = document.querySelector("#loginForm input[type='email']").value;
    let password = document.querySelector("#loginForm input[type='password']").value;

    let response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    let data = await response.json();

    if (response.ok) {
        loggedInUser = data;
        localStorage.setItem("loggedInUser", JSON.stringify(data));

        alert(data.message);
        closeLogin();

        if (data.role === "farmer") {
            window.location.href = "dashboard.html";
        }
    } else {
        alert(data.message);
    }
}

/* =========================
   LOGOUT
========================= */
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    loggedInUser = null;
    alert("Logout successful");
    window.location.href = "index.html";
}

/* =========================
   PLACE ORDER ✅ UPDATED
========================= */
function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    if (!loggedInUser) {
        alert("Please login first");
        openLogin();
        return;
    }

    let order = {
        id: "ORD" + Date.now(),
        buyer_name: loggedInUser.name,
        buyer_email: loggedInUser.email,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toLocaleString(),
        status: "Order Placed"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order placed successfully");

    cart = [];
    updateCartUI();
    closeCart();

    window.location.href = "trackorder.html";
}

/* =========================
   UPLOAD PRODUCT
========================= */
async function uploadProduct() {
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let image = document.getElementById("productImage").value;

    let response = await fetch("http://127.0.0.1:8000/api/upload-product/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price, image })
    });

    let data = await response.json();

    if (response.ok) {
        alert(data.message);
        loadProducts();
    } else {
        alert("Upload failed");
    }
}

/* =========================
   LOAD PRODUCTS
========================= */
async function loadProducts() {
    let response = await fetch("http://127.0.0.1:8000/api/products/");
    let products = await response.json();

    let productList = document.getElementById("productList");
    if (!productList) return;

    productList.innerHTML = "";

    products.forEach(product => {
        productList.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.name}">
                <div class="hover-cart">
                    <button onclick="showProductDetails('${product.name}','Rs.${product.price}','Fresh farm product','${product.image}')">
                        Add to Cart
                    </button>
                </div>
                <h3>${product.name}</h3>
                <p class="price">
                    <span class="new-price">Rs.${product.price}</span>
                </p>
                <p class="rating">⭐⭐⭐⭐⭐ Farmer Product</p>
            </div>
        `;
    });
}

/* =========================
   PAGE LOAD
========================= */
window.onload = function () {
    loadProducts();
};