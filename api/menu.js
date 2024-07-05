
    document.addEventListener("DOMContentLoaded", function() {
    const foodContainer = document.getElementById("food-items");

    fetch("http://localhost:8080/TastyKing/food")
    .then(response => response.json())
    .then(data => {
    const foods = data.result;
    foods.forEach(food => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("col-lg-6");
    foodItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img class="flex-shrink-0 img-fluid rounded" src="${food.foodImage}" alt="${food.foodName}" style="width: 80px;">
                        <div class="w-100 d-flex flex-column text-start ps-4">
                            <h5 class="d-flex justify-content-between border-bottom pb-2">
                                <a href="food-detail.html?foodID=${food.foodID}"><span>${food.foodName}</span></a>
                                <span class="text-primary">$${food.foodPrice}</span>
                            </h5>
                            <small class="fst-italic">${food.description}</small>
                        </div>
                    </div>
                `;
    foodContainer.appendChild(foodItem);
});
})
    .catch(error => console.error("Error fetching food data:", error));
});

    document.addEventListener("DOMContentLoaded", () => {
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
        label.textContent = `${food.foodName} - $${food.foodPrice.toFixed(2)}`;

        formCheck.appendChild(checkbox);
        formCheck.appendChild(label);
        col1.appendChild(formCheck);

        const col2 = document.createElement('div');
        col2.classList.add('col-md-4', 'd-flex', 'align-items-center');

        const btnDecrease = document.createElement('button');
        btnDecrease.type = 'button';
        btnDecrease.classList.add('btn', 'btn-secondary', 'btn-sm', 'quantity-btn');
        btnDecrease.textContent = '-';
        btnDecrease.addEventListener('click', () => changeQuantity(food.foodID, -1));

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
        updateTotalPrice();
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const quantityInput = document.querySelector(`input[name="${checkbox.name}_qty"]`);
            if (checkbox.checked && quantityInput) {
                const quantity = parseInt(quantityInput.value);
                const price = parseFloat(checkbox.dataset.price);
                totalPrice += quantity * price;
            }
        });
        document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    }
