document.addEventListener('DOMContentLoaded', function() {
    fetchCategories();

    document.querySelector('.btn-primary.mr-2').addEventListener('click', function() {
        createOrder();
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
        img.src = food.foodImage;
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

function addToOrder(food) {
    const orderSummary = document.querySelector('#orderSummary');
    const existingItem = document.querySelector(`#order-item-${food.foodID}`);

    if (existingItem) {
        const quantityInput = existingItem.querySelector('.quantity-buttons input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    } else {
        const tr = document.createElement('tr');
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
        quantityInput.value = '1';
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
        tdPrice.textContent = `${food.foodPrice} $`;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'x';
        removeButton.onclick = () => removeFromOrder(food.foodID);

        tdPrice.appendChild(removeButton);

        tr.appendChild(tdName);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdPrice);

        orderSummary.appendChild(tr);
    }

    updateTotal();
}
function createOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const bookingDateRaw = document.getElementById('bookingDate').value;
    const tableID = document.getElementById('table').value;
    const numOfCustomer = document.getElementById('numOfCustomer').value;
    const note = document.getElementById('note').value;
    const  token = localStorage.getItem('token');
    const orderDetails = [];
    const orderItems = document.querySelectorAll('#orderSummary tr');
    orderItems.forEach(item => {
        const foodID = item.id.split('-')[2];
        const quantity = item.querySelector('.quantity-buttons input').value;
        orderDetails.push({
            foodID: parseInt(foodID),
            quantity: parseInt(quantity)
        });
    });

    // Convert booking date to the desired format: YYYY-MM-DD HH:MM:SS
    const bookingDate = bookingDateRaw + ':00';


    const orderData = {
        user: {
            email: 'admin' // Replace with the actual user's email
        },
        tables: {
            tableID: parseInt(tableID)
        },
        note: note,
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent.replace(' $', '')),
        numOfCustomer: parseInt(numOfCustomer),
        customerName: customerName,
        bookingDate: bookingDate,
        customerPhone: customerPhone,
        orderDetails: orderDetails
    };

    fetch('http://localhost:8080/TastyKing/order/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // Replace with the actual bearer token
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Order created successfully:', data);
            // Optionally, handle success (e.g., show a success message or redirect)
        })
        .catch(error => console.error('Error creating order:', error));
}

function updateQuantity(foodID, change) {
    const item = document.querySelector(`#order-item-${foodID}`);
    const quantityInput = item.querySelector('.quantity-buttons input');
    let quantity = parseInt(quantityInput.value);
    quantity = Math.max(1, quantity + change);
    quantityInput.value = quantity;

    updateTotal();
}

function removeFromOrder(foodID) {
    const item = document.querySelector(`#order-item-${foodID}`);
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
        const price = parseFloat(priceText.replace(' $', '').replace(',', '.'));
        total += quantity * price;
    });

    const totalAmount = document.querySelector('#totalAmount');
    totalAmount.textContent = `${total.toFixed(1)} $`;
}


