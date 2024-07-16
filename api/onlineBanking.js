document.addEventListener("DOMContentLoaded", function () {
    const orderData = JSON.parse(getCookie("checkoutData") || "{}"); // Change here to get order data from cookies

    // Ensure orderData is not empty
    if (Object.keys(orderData).length === 0) {
        console.error("No order data found");
        return;
    }

    document.getElementById("orderID").textContent = "Order ID: " + orderData.orderID;
    document.getElementById("email").textContent = "Email: " + orderData.user.email;
    document.getElementById("orderDate").textContent = "Order Date: " + new Date(orderData.orderDate).toLocaleString();
    document.getElementById("amount").textContent = "Amount: " + orderData.totalAmount.toFixed(0)+"VND";
    document.getElementById("note").textContent = "Note: " + orderData.note;
});
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