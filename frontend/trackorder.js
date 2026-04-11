async function loadOrders() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        document.getElementById("orderList").innerHTML =
            "<p>Please login first</p>";
        return;
    }

    let response = await fetch(
        `http://127.0.0.1:8000/api/orders/${user.email}/`
    );

    let orders = await response.json();

    let orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    if (orders.length === 0) {
        orderList.innerHTML = "<p>No orders found</p>";
        return;
    }

    orders.forEach(order => {
        let items = JSON.parse(order.items);

        let itemsHTML = "";
        items.forEach(item => {
            itemsHTML += `
                <li>${item.name} - Rs.${item.price}</li>
            `;
        });

        orderList.innerHTML += `
            <div class="order-card">
                <h3>Order ID: ${order.order_id}</h3>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <ul>${itemsHTML}</ul>
                <p><strong>Total:</strong> Rs.${order.total}</p>
            </div>
        `;
    });
}

window.onload = function () {
    loadOrders();
};