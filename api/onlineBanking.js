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

////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('orderID').textContent = `Order ID: ${getCookie('orderID')}`;
    document.getElementById('email').textContent = `Email: ${getCookie('email')}`;
    document.getElementById('orderDate').textContent = `Order Date: ${getCookie('orderDate')}`;
    document.getElementById('amount').textContent = `Amount: $${getCookie('amount')}`;
    document.getElementById('note').textContent = `Note: ${getCookie('note')}`;
});

// Function to get cookie by name
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}