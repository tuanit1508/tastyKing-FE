document.addEventListener("DOMContentLoaded", function() {
    displayCartItems();

    // Add event listener to the "Proceed To Checkout" button
    document.getElementById("proceed-to-checkout").addEventListener("click", function() {
        createOrderDataCookie();
    });
});

function displayCartItems() {
    let cart = JSON.parse(getCookie("cart") || "[]");
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((combo, index) => {
        const comboTotal = parseFloat(combo.newPrice);
        total += comboTotal;

        combo.items.forEach((food, foodIndex) => {
            const foodItem = document.createElement("tr");
            foodItem.innerHTML = `
                <td class="product-thumbnail">
                    <img src="${food.foodImage}" alt="${food.foodName}" class="img-fluid">
                </td>
                <td class="product-name">
                    <h2 class="h5 text-black">${food.foodName}</h2>
                </td>
                <td class="product-price">${food.foodPrice}VND</td>
                <td>
                    <div class="input-group mb-3" style="max-width: 120px;">
                        <input type="text" class="form-control text-center" value="${food.quantity}" aria-label="Quantity" readonly>
                    </div>
                </td>
                <td class="product-total">${(food.foodPrice * food.quantity).toFixed(2)}VND</td>
                <td><button class="btn btn-primary btn-sm js-btn-remove" data-index="${index}" data-foodindex="${foodIndex}" data-foodid="${food.foodID}">X</button></td>
            `;
            cartContainer.appendChild(foodItem);
        });
    });

    // Update total in the cart summary
    const totalElement = document.getElementById("cart-total");
    totalElement.textContent = `${total.toFixed(2)}VND`;

    attachRemoveEventListeners();
}

function attachRemoveEventListeners() {
    document.querySelectorAll(".js-btn-remove").forEach(button => {
        button.addEventListener("click", function() {
            removeFromCart(this.getAttribute("data-index"), this.getAttribute("data-foodindex"));
        });
    });
}

function removeFromCart(index, foodIndex) {
    let cart = JSON.parse(getCookie("cart") || "[]");
    cart[index].items.splice(foodIndex, 1);

    if (cart[index].items.length === 0) {
        cart.splice(index, 1);
    }

    // Save the updated cart back to the cookies
    setCookie("cart", JSON.stringify(cart), 7); // Expires in 7 days
    displayCartItems();
}

function createOrderDataCookie() {
    const cart = JSON.parse(getCookie("cart") || "[]");
    const total = parseFloat(document.getElementById("cart-total").textContent.replace('VND', ''));

    const orderData = {
        cart: cart,
        total: total
    };

    setCookie("orderData", JSON.stringify(orderData), 3); // 3 days expiration
    window.location.href = "checkout.html";
}

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

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}