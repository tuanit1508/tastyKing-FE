document.addEventListener("DOMContentLoaded", function() {
    const orderData = JSON.parse(getCookie("orderData"));

    if (orderData) {
        // Display reservation details
        document.getElementById("customerName").value = orderData.reservation.name;
        document.getElementById("customerPhone").value = orderData.reservation.phone;
        document.getElementById("bookingDate").value = orderData.reservation.datetime;
        document.getElementById("numOfCustomer").value = orderData.reservation.people;
        document.getElementById("note").value = orderData.reservation.message;
        let tableID = localStorage.getItem("tableID");
        tableID = tableID.replace(/^"(.+(?="$))"$/, '$1'); // This regex removes the surrounding quotes

        document.getElementById("table").value = tableID;

        // Display cart items
        const cartContainer = document.querySelector(".checkout__order__product ul");
        orderData.cart.forEach(food => {
            const foodItem = document.createElement("li");
            foodItem.innerHTML = `${food.foodName} <span>$${(food.foodPrice * food.quantity).toFixed(2)}</span>`;
            cartContainer.appendChild(foodItem);
        });

        // Display subtotal and total
        document.querySelector(".checkout__order__total ul li:nth-child(1) span").textContent = `$${orderData.total.toFixed(2)}`;
        document.querySelector(".checkout__order__total ul li:nth-child(2) span").textContent = `$${orderData.total.toFixed(2)}`;
    } else {
        // Redirect to reservation page if order data is not found
        alert('Order data not found. Please make a reservation first.');
        window.location.href = "cart.html";
    }
});

// Utility function to get a cookie
function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}


