/* =========================
   LOAD ALL PRODUCTS
========================= */
async function loadDashboardProducts() {
    try {
        let response = await fetch("http://127.0.0.1:8000/api/products/");
        let products = await response.json();

        let box = document.getElementById("dashboardProducts");
        box.innerHTML = "";

        if (products.length === 0) {
            box.innerHTML = "<p>No products available</p>";
            return;
        }

        products.forEach(product => {
            box.innerHTML += `
                <div class="order-card">
                    <h3>${product.name}</h3>
                    <img src="${product.image}" width="120">
                    <p>Price: Rs.${product.price}</p>
                    <p>${product.description || "Fresh farm product"}</p>
                </div>
            `;
        });

    } catch (error) {
        console.log("Product load error:", error);
    }
}

/* =========================
   LOAD ALL ORDERS
========================= */
async function loadDashboardOrders() {
    try {
        let response = await fetch("http://127.0.0.1:8000/api/all-orders/");
        let orders = await response.json();

        let box = document.getElementById("dashboardOrders");
        box.innerHTML = "";

        if (orders.length === 0) {
            box.innerHTML = "<p>No orders available</p>";
            return;
        }

        orders.forEach(order => {
            let items = [];
            let itemHTML = "";

            try {
                items = JSON.parse(order.items);
            } catch {
                items = [];
            }

            items.forEach(item => {
                itemHTML += `<li>${item.name} - Rs.${item.price}</li>`;
            });

            box.innerHTML += `
                <div class="order-card">
                    <h3>${order.order_id}</h3>
                    <p><b>User:</b> ${order.user_email}</p>
                    <ul>${itemHTML}</ul>
                    <p><b>Total:</b> Rs.${order.total}</p>
                    <p><b>Status:</b> ${order.status}</p>
                    <p><b>Date:</b> ${order.created_at || ""}</p>
                </div>
            `;
        });

    } catch (error) {
        console.log("Order load error:", error);
    }
}

/* =========================
   PAGE LOAD
========================= */
window.onload = function () {
    loadDashboardProducts();
    loadDashboardOrders();
};