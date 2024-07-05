document.addEventListener("DOMContentLoaded", function () {
    const orderData = JSON.parse(localStorage.getItem("checkoutData") || "{}");

    // Ensure orderData is not empty
    if (Object.keys(orderData).length === 0) {
        console.error("No order data found");
        return;
    }

    document.getElementById("orderID").textContent = "Order ID: " + orderData.orderID;
    document.getElementById("email").textContent = "Email: " + orderData.user.email;
    document.getElementById("orderDate").textContent = "Order Date: " + new Date(orderData.orderDate).toLocaleString();
    document.getElementById("amount").textContent = "Amount: $" + orderData.totalAmount.toFixed(2);
    document.getElementById("note").textContent = "Note: " + orderData.note;
});