function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchOrderDetails(orderID, token) {
    const response = await fetch(`http://localhost:8080/TastyKing/order/${orderID}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch order details');
    }
}

function populateForm(order) {
    document.getElementById('name').value = order.customerName;
    document.getElementById('phone').value = order.customerPhone;
    document.getElementById('bookingDate').value = order.bookingDate;
    document.getElementById('numOfCustomer').value = order.numOfCustomer;
    document.getElementById('table').value = order.tables.tableID;
    document.getElementById('note').value = order.note;

    // Clear existing food items in the menu
    const foodCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    foodCheckboxes.forEach(checkbox => checkbox.checked = false);

    // Populate selected food items with quantities
    order.orderDetails.forEach(detail => {
        const foodID = `food_${detail.foodID}`;
        const checkbox = document.querySelector(`input[name="${foodID}"]`);
        if (checkbox) {
            checkbox.checked = true;
            const quantityInput = document.querySelector(`input[name="${foodID}_qty"]`);
            if (quantityInput) {
                quantityInput.value = detail.quantity;
            }
        }
    });

    updateTotalPrice(); // Update total price after populating form
}

document.addEventListener('DOMContentLoaded', async () => {
    const orderID = getQueryParam('orderID');
    const token = localStorage.getItem('authToken'); // Replace with actual token

    if (orderID) {
        try {
            const orderResponse = await fetchOrderDetails(orderID, token);
            if (orderResponse.code === 0) {
                populateForm(orderResponse.result);
            } else {
                console.error('Error fetching order:', orderResponse);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('Order ID not provided');
    }

    fetchFoodData();
});

async function fetchFoodData() {
    try {
        const response = await fetch('http://localhost:8080/TastyKing/food'); // Replace with your actual API endpoint
        const data = await response.json();

        if (data && data.result) {
            const menuItemsContainer = document.getElementById('menuItems');
            data.result.forEach(food => {
                const foodItem = createFoodItem(food);
                menuItemsContainer.appendChild(foodItem);
            });
        }
    } catch (error) {
        console.error('Error fetching food data:', error);
    }
}

function createFoodItem(food) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'row', 'align-items-center');

    const col1 = document.createElement('div');
    col1.classList.add('col-md-8');

    const formCheck = document.createElement('div');
    formCheck.classList.add('form-check');

    const checkbox = document.createElement('input');
    checkbox.classList.add('form-check-input');
    checkbox.type = 'checkbox';
    checkbox.name = `food_${food.foodID}`;
    checkbox.dataset.price = food.foodPrice;
    checkbox.addEventListener('change', updateTotalPrice);

    const label = document.createElement('label');
    label.classList.add('form-check-label');
    label.textContent = `${food.foodName} - ${food.foodPrice.toFixed(0)}000VND`;

    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);
    col1.appendChild(formCheck);

    const col2 = document.createElement('div');
    col2.classList.add('col-md-4', 'd-flex', 'align-items-center');
    checkbox.addEventListener('change', function() {
        const quantityInput = inputQuantity;
        if (checkbox.checked) {
            quantityInput.value = '1';
        } else {
            quantityInput.value = '0';
        }

        updateTotalPrice(); // Update total price after changing quantity
    });
    const btnDecrease = document.createElement('button');
    btnDecrease.type = 'button';
    btnDecrease.classList.add('btn', 'btn-secondary', 'btn-sm', 'quantity-btn');
    btnDecrease.textContent = '-';


    const inputQuantity = document.createElement('input');
    inputQuantity.type = 'number';
    inputQuantity.classList.add('form-control', 'mx-2');
    inputQuantity.name = `food_${food.foodID}_qty`;
    inputQuantity.min = '0';
    inputQuantity.value = '0';
    inputQuantity.dataset.price = food.foodPrice;
    inputQuantity.addEventListener('change', updateTotalPrice);

    const btnIncrease = document.createElement('button');
    btnIncrease.type = 'button';
    btnIncrease.classList.add('btn', 'btn-secondary', 'btn-sm', 'quantity-btn');
    btnIncrease.textContent = '+';
    btnIncrease.addEventListener('click', () => changeQuantity(food.foodID, 1));

    col2.appendChild(btnDecrease);
    col2.appendChild(inputQuantity);
    col2.appendChild(btnIncrease);

    formGroup.appendChild(col1);
    formGroup.appendChild(col2);

    return formGroup;
}

function changeQuantity(foodID, change) {
    const quantityInput = document.querySelector(`input[name="food_${foodID}_qty"]`);
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity = Math.max(0, currentQuantity + change);
    quantityInput.value = currentQuantity;

    // Ensure checkbox is checked if quantity > 0
    const checkbox = document.querySelector(`input[name="food_${foodID}"]`);
    if (currentQuantity > 0) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }

    updateTotalPrice(); // Update total price after changing quantity
}

function updateTotalPrice() {
    let totalPrice = 0;
    const foodCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    foodCheckboxes.forEach(checkbox => {
        const quantityInput = document.querySelector(`input[name="${checkbox.name}_qty"]`);
        if (checkbox.checked && quantityInput) {
            const quantity = parseInt(quantityInput.value);
            const price = parseFloat(checkbox.dataset.price);
            totalPrice += quantity * price;
        }
    });
    const formattedPrice = `${totalPrice.toFixed(0)}000VND`;
    document.getElementById('totalPrice').textContent = formattedPrice;
}

function serializeOrderData(orderData) {
    const params = new URLSearchParams();

    // Serialize basic fields
    params.append('orderID', orderData.orderID);
    params.append('user[email]', orderData.user.email);
    params.append('tables[tableID]', orderData.tables.tableID);
    params.append('note', orderData.note);
    params.append('totalAmount', orderData.totalAmount);
    params.append('numOfCustomer', orderData.numOfCustomer);
    params.append('customerName', orderData.customerName);
    params.append('bookingDate', orderData.bookingDate);
    params.append('customerPhone', orderData.customerPhone);

    // Serialize order details
    const foodMap = new Map(); // To accumulate quantities

    orderData.orderDetails.forEach(detail => {
        if (foodMap.has(detail.foodID)) {
            foodMap.set(detail.foodID, foodMap.get(detail.foodID) + detail.quantity);
        } else {
            foodMap.set(detail.foodID, detail.quantity);
        }
    });

    foodMap.forEach((quantity, foodID) => {
        params.append(`orderDetails[${foodID}][foodID]`, foodID);
        params.append(`orderDetails[${foodID}][quantity]`, quantity);
    });

    return params.toString();
}

document.getElementById('orderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookingDateInput = document.getElementById('bookingDate').value;
    const bookingDateFormatted = bookingDateInput;

    const orderID = getQueryParam('orderID');
    const token = localStorage.getItem('authToken'); // Replace with actual token
    const email = localStorage.getItem('loggedInUserEmail');
    const orderData = {
        orderID: parseInt(orderID),
        user: { email: email },
        tables: { tableID: parseInt(document.getElementById('table').value) },
        note: document.getElementById('note').value,
        totalAmount: parseFloat(document.getElementById('totalPrice').textContent),
        numOfCustomer: parseInt(document.getElementById('numOfCustomer').value),
        customerName: document.getElementById('name').value,
        bookingDate: bookingDateFormatted,
        customerPhone: document.getElementById('phone').value,
        orderDetails: []
    };

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const quantityInput = document.querySelector(`input[name="${checkbox.name}_qty"]`);
        if (checkbox.checked && quantityInput) {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                const foodID = parseInt(checkbox.name.split('_')[1]);
                const existingItem = orderData.orderDetails.find(item => item.foodID === foodID);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    orderData.orderDetails.push({ foodID: foodID, quantity: quantity });
                }
            }
        }
    });

    try {
        const response = await fetch(`http://localhost:8080/TastyKing/order/updateOrder/${orderID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        console.log('Update order response:', result); // Debugging statement

        if (result.code === 0) {
            const paymentMethod = document.querySelector('input[name="order_type"]:checked').value;

            // Set cookies with order information expiring in 5 minutes
            setCookie('orderID', orderData.orderID, 5);
            setCookie('email', orderData.user.email, 5);
            setCookie('orderDate', orderData.bookingDate, 5);
            setCookie('amount', orderData.totalAmount.toFixed(2), 5);
            setCookie('note', orderData.note, 5);
            setCookie('paymentMethod', paymentMethod, 5);

            // Redirect based on payment method
            if (paymentMethod === 'vnPay') {
                window.location.href = 'vnPayBanking.html';
            } else if (paymentMethod === 'banking') {
                window.location.href = 'onlineBanking.html';
            }
        } else {
            alert('Failed to update order');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('An error occurred while updating the order');
    }
});

function setCookie(name, value, minutes) {
    const now = new Date();
    const expiryTime = now.getTime() + (minutes * 60 * 1000);
    now.setTime(expiryTime);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${now.toUTCString()}; path=/`;
}
