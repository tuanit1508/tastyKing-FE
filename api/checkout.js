document.addEventListener("DOMContentLoaded", function() {
    const orderData = JSON.parse(getCookie("orderData"));
    const  reservationData = JSON.parse(getCookie("reservationData"));
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
            foodItem.innerHTML = `${food.foodName} <span>${(food.foodPrice * food.quantity).toFixed(2)}VND</span>`;
            cartContainer.appendChild(foodItem);
        });

        // Display subtotal and total
        document.querySelector(".checkout__order__total ul li:nth-child(1) span").textContent = `${orderData.total.toFixed(0)}VND`;
        document.querySelector(".checkout__order__total ul li:nth-child(2) span").textContent = `${orderData.total.toFixed(0)}VND`;
    } else {
        // Redirect to reservation page if order data is not found
        alert('Order data not found. Please make a reservation first.');
        window.location.href = "cart.html";
    }

    // Remove "orderData" cookie after processing
    deleteCookie("orderData");
    deleteCookie("reservationData");
});

// Utility functions for setting, getting, and deleting cookies
function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000)); // Calculate expiration time in minutes
    const expires = "expires=" + date.toUTCString(); // Create expiration string in UTC format
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set the cookie
}

function getCookie(name) {
    let cookies = document.cookie.split(';'); // Split document cookies by semicolon
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Trim leading and trailing spaces from each cookie
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1); // Return the cookie value if the name matches
        }
    }
    return null; // Return null if no cookie with the given name is found
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
