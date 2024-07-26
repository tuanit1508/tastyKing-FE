document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();

    // Add event listener to the apply voucher button
    document.getElementById("apply-voucher").addEventListener("click", function () {
        const voucherCode = document.getElementById("voucher-code").value;
        const email = localStorage.getItem('loggedInUserEmail');
        if (voucherCode) {
            applyVoucher(voucherCode, email);
        }
    });



    // Add event listener to the "Proceed to Checkout" button
    document.getElementById("proceed-to-checkout").addEventListener("click", function () {
        const reservationData = JSON.parse(getCookie("reservationData"));
        const tableID = getCookie("tableID");
        const cart = JSON.parse(getCookie("cart") || "[]");
        const total = parseFloat(document.getElementById("cart-total").textContent.replace('VND', '').trim());

        const orderData = {
            reservation: reservationData,

            tableID: tableID,
            cart: cart,
            total: total
        };

        setCookie("orderData", JSON.stringify(orderData), 3); // 3 days expiration
        window.location.href = "checkout.html";
    });
});

const RESERVATION_FEE = 100000; // Reservation fee
const DEPOSIT_AMOUNT = 2000000; // Deposit amount for tableID 6
let discount = 0; // Initialize discount variable

function displayCartItems() {
    console.log("displayCartItems called");

    let cart = JSON.parse(getCookie("cart") || "[]");
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    let subtotal = 0;
    let deposit = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
        subtotal = RESERVATION_FEE; // Apply reservation fee if cart is empty
    } else {
        cart.forEach((food, index) => {
            const itemTotal = (food.foodPrice * food.quantity).toFixed(0);
            subtotal += parseFloat(itemTotal);
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
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-primary js-btn-minus" type="button" data-index="${index}" data-foodid="${food.foodID}">&minus;</button>
                        </div>
                        <input type="text" class="form-control text-center" value="${food.quantity}" aria-label="Quantity" data-index="${index}" readonly>
                        <div class="input-group-append">
                            <button class="btn btn-outline-primary js-btn-plus" type="button" data-index="${index}" data-foodid="${food.foodID}">&plus;</button>
                        </div>
                    </div>
                </td>
                <td class="product-total">${itemTotal}VND</td>
                <td><button class="btn btn-primary btn-sm js-btn-remove" data-index="${index}" data-foodid="${food.foodID}">X</button></td>
            `;
            cartContainer.appendChild(foodItem);
        });

        attachEventListeners();
    }

    // Apply discount if any
    let discountedSubtotal = subtotal - discount;

    // Check if tableID is 6
    const tableID = localStorage.getItem("tableID");
    console.log("tableID:", tableID); // Debugging log

    if (tableID === '"7"' || tableID === '"11"') {
        console.log("tableID is 7, setting deposit to 2000000"); // Debugging log
        deposit = DEPOSIT_AMOUNT;
    }

    // Calculate total
    let total = discountedSubtotal + deposit;

    // Update subtotal, deposit, and total in the cart summary
    const subtotalElement = document.getElementById("cart-subtotal");
    const depositElement = document.getElementById("cart-deposit");
    const totalElement = document.getElementById("cart-total");
    subtotalElement.textContent = `${discountedSubtotal.toFixed(0)}VND`;
    depositElement.textContent = `${deposit.toFixed(0)}VND`;
    totalElement.textContent = `${total.toFixed(0)}VND`; // Display total with discount applied
}

function attachEventListeners() {
    document.querySelectorAll(".js-btn-minus").forEach(button => {
        button.addEventListener("click", function () {
            updateQuantity(this.getAttribute("data-index"), -1);
        });
    });

    document.querySelectorAll(".js-btn-plus").forEach(button => {
        button.addEventListener("click", function () {
            updateQuantity(this.getAttribute("data-index"), 1);
        });
    });

    document.querySelectorAll(".js-btn-remove").forEach(button => {
        button.addEventListener("click", function () {
            removeFromCart(this.getAttribute("data-index"));
        });
    });
}

function updateQuantity(index, delta) {
    let cart = JSON.parse(getCookie("cart") || "[]");
    let item = cart[index];
    item.quantity = Math.max(1, item.quantity + delta);

    // Save the updated cart back to the cookies
    setCookie("cart", JSON.stringify(cart), 7); // Expires in 7 days
    displayCartItems();
}

function removeFromCart(index) {
    let cart = JSON.parse(getCookie("cart") || "[]");
    cart.splice(index, 1);

    // Save the updated cart back to the cookies
    setCookie("cart", JSON.stringify(cart), 7); // Expires in 7 days
    displayCartItems();
}

function applyVoucher(voucherCode, email) {
    const token = localStorage.getItem('authToken'); // Retrieve JWT token from localStorage

    fetch(`http://localhost:8080/TastyKing/voucher/apply/${voucherCode}?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0 && data.result && data.result.expried === 0) {
                discount = data.result.voucherDiscount;
                    voucherId = data.result.voucherId
                localStorage.setItem("voucherId", voucherId)// Update global discount variable
                displayCartItems(); // Update cart display with new discount
            } else {
                alert("Voucher is invalid or not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching voucher:", error);
            alert("Error fetching voucher. Please try again.");
        });
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


