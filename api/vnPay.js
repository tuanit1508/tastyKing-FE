document.addEventListener("DOMContentLoaded", function() {
    // Retrieve checkout data from cookies
    const checkoutData = JSON.parse(getCookie("checkoutData"));

    // Display checkout data
    if (checkoutData) {
        document.getElementById('orderID').textContent = "Order ID: " + checkoutData.orderID;
        document.getElementById('email').textContent = "Email: " + checkoutData.user.email;
        document.getElementById('orderDate').textContent = "Order Date: " + checkoutData.bookingDate;
        document.getElementById('amount').textContent = "Total Amount: " + checkoutData.totalAmount + " VND";
        document.getElementById('note').textContent = "Payment method: VNPay";
    } else {
        alert("No checkout data found.");
    }

    // Handle VNPay payment button click
    document.getElementById('vnpayButton').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button action
        createVNPayPayment(checkoutData.orderID);
    });
});

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

function redirectToHome() {
    window.location.href = "index.html";
}

function createVNPayPayment(orderID) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
    }

    fetch("http://localhost:8080/TastyKing/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
            orderID: orderID,
            paymentMethod: 'VNPAY'
        })
    })
        .then(response => response.json())
        .then(paymentData => {
            if (paymentData.code === 0) {
                const paymentUrl = paymentData.result.paymentUrl;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else {
                    alert("Payment URL is missing.");
                }
            } else {
                alert("Failed to create payment. Error code: " + paymentData.message);
            }
        })
        .catch(error => {
            console.error("Error creating payment:", error);
            alert("An error occurred while creating the payment. Please try again.");
        });
}
