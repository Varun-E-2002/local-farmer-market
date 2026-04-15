const API_URL = "https://local-farmer-market-1.onrender.com/api";

const bannerImages = [
    "images/far1.jpeg",
    "images/far2.jpeg",
    "images/far3.jpeg",
    "images/far4.jpeg"
];
let currentBanner = 0;
const bannerImage = document.getElementById("bannerImage");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let bannerInterval;

function showBannerImage() {
    bannerImage.src = bannerImages[currentBanner];
}

function nextBanner() {
    currentBanner = (currentBanner + 1) % bannerImages.length;
    showBannerImage();
}

function prevBanner() {
    currentBanner--;
    if (currentBanner < 0) {
        currentBanner = bannerImages.length - 1;
    }
    showBannerImage();
}

function startAutoSlider() {
    clearInterval(bannerInterval);
    bannerInterval = setInterval(nextBanner, 3000);
}

// first load
showBannerImage();
startAutoSlider();

// button events
nextBtn.onclick = function () {
    nextBanner();
    startAutoSlider();
};

prevBtn.onclick = function () {
    prevBanner();
    startAutoSlider();
};
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
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let password = document.getElementById("regPassword").value.trim();
    let phone = document.getElementById("regPhone").value.trim();
    let role = document.getElementById("userRole").value;

    if (!name || !email || !password || !phone) {
        alert("Please fill all fields");
        return;
    }

    try {
        let response = await fetch(`${API_URL}/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                phone,
                role
            })
        });

        let data = await response.json();

        if (response.ok) {
            alert("Registration successful");
            showLogin();
        } else {
            alert(data.message || "Registration failed");
        }

    } catch (error) {
        console.error(error);
        alert("Server connection error");
    }
}
let selectedPayment = "COD";

function selectPayment(method){
    selectedPayment = method;

    document.querySelectorAll(".pay-btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    if(method === "COD"){
        document.querySelectorAll(".pay-btn")[0].classList.add("active");
    } else {
        document.querySelectorAll(".pay-btn")[1].classList.add("active");
    }
}
/* =========================
   LOGIN
========================= */
async function loginUser() {
    let email = document.querySelector("#loginForm input[type='email']").value;
    let password = document.querySelector("#loginForm input[type='password']").value;

    let response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    let data = await response.json();

    if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        loggedInUser = data;

        closeLogin();

        document.getElementById("successPopup").style.display = "flex";

        setTimeout(() => {
            document.getElementById("successPopup").style.display = "none";
        }, 2500);

        if (data.role === "farmer") {
            document.getElementById("farmerUploadBox").style.display = "block";
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

    let response = await fetch(`${API_URL}/upload-product/`, {
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
    let response = await fetch(`${API_URL}/products/`);
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

function changeLanguage(lang) {
    const texts = {
        en: {
            home: "Home",
            category: "All Categories",
            best: "Best selling",
            combo: "Special Combo",
            track: "Track Order",
            search: "Search Products"
        },
        ta: {
            home: "முகப்பு",
            category: "அனைத்து வகைகள்",
            best: "சிறந்த விற்பனை",
            combo: "சிறப்பு காம்போ",
            track: "ஆர்டர் டிராக்",
            search: "பொருட்கள் தேடவும்"
        },
        hi: {
            home: "होम",
            category: "सभी श्रेणियाँ",
            best: "बेस्ट सेलिंग",
            combo: "स्पेशल कॉम्बो",
            track: "ऑर्डर ट्रैक",
            search: "उत्पाद खोजें"
        }
    };

    document.getElementById("navHome").innerText = texts[lang].home;
    document.getElementById("navCategory").innerText = texts[lang].category;
    document.getElementById("navBest").innerText = texts[lang].best;
    document.getElementById("navCombo").innerText = texts[lang].combo;
    document.getElementById("navTrack").innerText = texts[lang].track;
    document.getElementById("searchBox").placeholder = texts[lang].search;
    document.getElementById("langBtn").innerText = 
    (lang === "en") ? "English ▼" :
    (lang === "ta") ? "தமிழ் ▼" :
    "हिंदी ▼";
    if (lang === "en") {
    document.getElementById("langBtn").innerText = "English ▼";
}
if (lang === "ta") {
    document.getElementById("langBtn").innerText = "தமிழ் ▼";
}
if (lang === "hi") {
    document.getElementById("langBtn").innerText = "हिंदी ▼";
}
}
function searchProduct() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let products = document.querySelectorAll(".card2, .range-item");
    let firstMatch = null;
    let found = false;

    products.forEach(product => {
        let name = product.innerText.toLowerCase();

        if (name.includes(input)) {
            product.style.display = "";
            found = true;

            if (!firstMatch) {
                firstMatch = product;
            }
        } else {
            product.style.display = "none";
        }
    });

    document.getElementById("noResult").style.display = found ? "none" : "block";

    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
    showLogin();
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}