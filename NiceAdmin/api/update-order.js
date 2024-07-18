document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderID = urlParams.get('orderID');
    fetchCategories();
    fetchTables().then(() => {
        if (orderID) {
            fetchOrderDetails(orderID);
        }
    });

    document.querySelector('.save-order').addEventListener('click', function() {
        updateOrder(orderID);
    });

    document.getElementById('showFoodModal').addEventListener('click', function() {
        const foodModal = new bootstrap.Modal(document.getElementById('foodModal'));
        foodModal.show();
    });
});

function fetchCategories() {
    fetch('http://localhost:8080/TastyKing/category')
        .then(response => response.json())
        .then(data => {
            displayCategories(data.result);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function displayCategories(categories) {
    const navTabs = document.querySelector('#categoryTabs');
    navTabs.innerHTML = ''; // Clear existing content

    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = `#`;
        a.textContent = category.categoryName;
        a.dataset.categoryId = category.categoryID;
        a.onclick = (e) => {
            e.preventDefault();
            fetchFoodsByCategory(category.categoryID);
            setActiveTab(a);
        };

        if (index === 0) {
            a.classList.add('active');
            fetchFoodsByCategory(category.categoryID); // Load foods for the first category by default
        }

        li.appendChild(a);
        navTabs.appendChild(li);
    });
}

function setActiveTab(activeLink) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function fetchFoodsByCategory(categoryID) {
    fetch(`http://localhost:8080/TastyKing/food/${categoryID}`)
        .then(response => response.json())
        .then(data => {
            displayFoods(data.result);
        })
        .catch(error => console.error('Error fetching foods:', error));
}

function displayFoods(foods) {
    const foodContainer = document.querySelector('#foodContainer');
    foodContainer.innerHTML = ''; // Clear existing content

    foods.forEach(food => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = `http://localhost:63343/TastyKing-FE/${food.foodImage}`;
        img.alt = food.foodName;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = food.foodName;

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary mt-2';
        addButton.textContent = 'Add to Order';
        addButton.onclick = () => addToOrder(food);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(addButton);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        foodContainer.appendChild(col);
    });
}

function fetchTables() {
    return fetch('http://localhost:8080/TastyKing/table/getTable/available')
        .then(response => response.json())
        .then(data => {
            displayTables(data.result);
        })
        .catch(error => console.error('Error fetching tables:', error));
}

function displayTables(tables) {
    const tableSelect = document.getElementById('table');
    tableSelect.innerHTML = '<option value="" selected disabled>--Select Your Table--</option>'; // Clear existing content and add default option

    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.tableID;
        option.textContent = table.tableName;
        tableSelect.appendChild(option);
    });
}

function fetchOrderDetails(orderID) {
    const token = localStorage.getItem('token'); // or from cookies

    fetch(`http://localhost:8080/TastyKing/order/${orderID}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            populateOrderForm(data.result);
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
        });
}

function populateOrderForm(order) {
    document.getElementById('customerName').value = order.customerName;
    document.getElementById('customerPhone').value = order.customerPhone;
    document.getElementById('bookingDate').value = new Date(order.bookingDate).toISOString().slice(0, 16);
    const tableSelect = document.getElementById('table');
    tableSelect.value = order.tables.tableID;
    tableSelect.setAttribute('data-current-value', order.tables.tableID); // Store current table ID
    document.getElementById('numOfCustomer').value = order.numOfCustomer;
    document.getElementById('note').value = order.note;
    document.getElementById('email').value = order.user.email;
    order.orderDetails.forEach(detail => addToOrder(detail));
}

function addToOrder(food) {
    const orderSummary = document.querySelector('#orderSummary');
    let tr = document.querySelector(`#order-item-${food.foodID}`);

    if (!tr) {
        tr = document.createElement('tr');
        tr.id = `order-item-${food.foodID}`;

        const tdName = document.createElement('td');
        tdName.textContent = food.foodName;

        const tdQuantity = document.createElement('td');
        tdQuantity.className = 'text-center';

        const quantityButtons = document.createElement('div');
        quantityButtons.className = 'quantity-buttons';

        const minusButton = document.createElement('button');
        minusButton.className = 'btn btn-outline-secondary btn-sm';
        minusButton.textContent = '-';
        minusButton.onclick = () => updateQuantity(food.foodID, -1);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.value = 1;
        quantityInput.readOnly = true;

        const plusButton = document.createElement('button');
        plusButton.className = 'btn btn-outline-secondary btn-sm';
        plusButton.textContent = '+';
        plusButton.onclick = () => updateQuantity(food.foodID, 1);

        quantityButtons.appendChild(minusButton);
        quantityButtons.appendChild(quantityInput);
        quantityButtons.appendChild(plusButton);
        tdQuantity.appendChild(quantityButtons);

        const tdPrice = document.createElement('td');
        tdPrice.className = 'text-right';
        tdPrice.textContent = `${food.foodPrice} VND`;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'x';
        removeButton.onclick = () => removeFromOrder(food.foodID);

        tdPrice.appendChild(removeButton);

        tr.appendChild(tdName);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdPrice);

        orderSummary.appendChild(tr);
    } else {
        updateQuantity(food.foodID, 1);
    }

    updateTotal();
}

function updateQuantity(foodID, change) {
    const item = document.querySelector(`#order-item-${foodID.toString()}`);
    const quantityInput = item.querySelector('.quantity-buttons input');
    let quantity = parseInt(quantityInput.value);
    quantity = Math.max(1, quantity + change);
    quantityInput.value = quantity;

    updateTotal();
}

function removeFromOrder(foodID) {
    const item = document.querySelector(`#order-item-${foodID.toString()}`);
    item.remove();

    updateTotal();
}

function updateTotal() {
    const orderSummary = document.querySelector('#orderSummary');
    const items = orderSummary.querySelectorAll('tr');
    let total = 0;

    items.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-buttons input').value);
        const priceText = item.querySelector('td.text-right').textContent;
        const price = parseFloat(priceText.replace(' VND', '').replace(',', '.'));
        total += quantity * price;
    });

    const totalAmount = document.querySelector('#totalAmount');
    totalAmount.textContent = `${total.toFixed(1)} VND`;
}

function updateOrder(orderID) {
    const token = localStorage.getItem('token'); // or from cookies
    const tableSelect = document.getElementById('table');
    const tableID = tableSelect.value || tableSelect.getAttribute('data-current-value'); // Use current table ID if no new table is selected

    const orderData = {
        orderID: parseInt(orderID),
        user: {
            email: document.getElementById('email').value // Replace with actual user email
        },
        tables: {
            tableID: tableID
        },
        orderDate: new Date().toISOString(),
        note: document.getElementById('note').value,
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent.replace(' VND', '')),
        numOfCustomer: parseInt(document.getElementById('numOfCustomer').value),
        customerName: document.getElementById('customerName').value,
        bookingDate: new Date(document.getElementById('bookingDate').value).toISOString(),
        customerPhone: document.getElementById('customerPhone').value,
        orderDetails: Array.from(document.querySelectorAll('#orderSummary tr')).map(tr => ({
            foodID: parseInt(tr.id.replace('order-item-', '')),
            quantity: parseInt(tr.querySelector('.quantity-buttons input').value)
        }))
    };

    console.log(JSON.stringify(orderData, null, 2)); // Debug the JSON structure

    fetch(`http://localhost:8080/TastyKing/order/updateOrderByAdmin/${orderID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                alert('Order updated successfully!');
                window.location.href = 'booking-data.html'; // Redirect to order list or another page
            } else {
                alert('Error updating order.');
            }
        })
        .catch(error => {
            console.error('Error updating order:', error);
        });
}
