document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and display categories in the dropdown
    function fetchCategories() {
        fetch('http://localhost:8080/TastyKing/category')
            .then(response => response.json())
            .then(data => {
                const categories = data.result;
                const categoryDropdown = document.getElementById('categoryName');
                const updateCategoryDropdown = document.getElementById('updatecategoryName');

                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.categoryID;
                    option.text = category.categoryName;
                    categoryDropdown.add(option);

                    const updateOption = document.createElement('option');
                    updateOption.value = category.categoryID;
                    updateOption.text = category.categoryName;
                    updateCategoryDropdown.add(updateOption);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    // Function to fetch and display all food items in the table
    function fetchFoodItems() {
        fetch('http://localhost:8080/TastyKing/food')
            .then(response => response.json())
            .then(data => {
                const foods = data.result;
                let tableBody = '';
                foods.forEach(food => {
                    tableBody += `
              <tr>
                <td>${food.foodID}</td>
                <td>${food.foodName}</td>
                <td>${food.category.categoryName}</td>
                <td>${food.foodPrice}</td>
                <td>${food.unit}</td>
                <td>
                  <button class="btn btn-primary update-btn" data-id="${food.foodID}" data-bs-toggle="modal" data-bs-target="#updatemenuModal">Update</button>
                  <button class="btn btn-danger delete-btn" data-id="${food.foodID}">Delete</button>
                </td>
              </tr>
              `;
                });
                document.getElementById('foodTableBody').innerHTML = tableBody;

                // Add event listeners for the update and delete buttons
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', handleUpdate);
                });
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', handleDelete);
                });
            })
            .catch(error => console.error('Error fetching food items:', error));
    }

    // Handle form submission for creating or updating a food item
    function handleFormSubmit(event, isUpdate) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const categoryID = isUpdate ? 'updatecategoryName' : 'categoryName';
        formData.append('categoryID', document.getElementById(categoryID).value);
        const token = localStorage.getItem('token');

        const url = isUpdate ? `http://localhost:8080/TastyKing/food/${form.dataset.foodId}` : 'http://localhost:8080/TastyKing/food';
        const method = isUpdate ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const modalId = isUpdate ? 'updatemenuModal' : 'menuModal';
                const myModal = bootstrap.Modal.getInstance(document.getElementById(modalId));
                myModal.hide();
                fetchFoodItems();
            })
            .catch(error => console.error(`Error ${isUpdate ? 'updating' : 'creating'} food item:`, error));
    }

    document.getElementById('foodForm').addEventListener('submit', function(event) {
        handleFormSubmit(event, false);
    });

    document.getElementById('updatefoodForm').addEventListener('submit', function(event) {
        handleFormSubmit(event, true);
    });

    // Handle update button click
    function handleUpdate(event) {
        const foodID = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/TastyKing/food/getFood/${foodID}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.result) {
                    const food = data.result;
                    document.getElementById('updatecategoryName').value = food.category.categoryID;
                    document.getElementById('updatefoodName').value = food.foodName;
                    document.getElementById('updatefoodPrice').value = food.foodPrice;
                    
                    document.getElementById('updateunit').value = food.unit;
                    document.getElementById('updatedescription').value = food.description;

                    const foodImagePreview = document.getElementById('foodImagePreview');
                    foodImagePreview.src = `http://localhost:63343/TastyKing-FE/${food.foodImage}`;

                    const foodForm = document.getElementById('updatefoodForm');
                    foodForm.dataset.foodId = foodID;
                } else {
                    console.error('No food details found for the given ID:', foodID);
                }
            })
            .catch(error => console.error('Error fetching food details:', error));
    }

    // Handle delete button click
    function handleDelete(event) {
        const foodID = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token');
        if (confirm('Are you sure you want to delete this food item?')) {
            fetch(`http://localhost:8080/TastyKing/food/${foodID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json())
                .then(data => {
                    fetchFoodItems();
                })
                .catch(error => console.error('Error deleting food item:', error));
        }
    }

    // Initialize: fetch categories and food items on page load
    fetchCategories();
    fetchFoodItems();

    // Reset form and mode when modal is hidden
    document.getElementById('updatemenuModal').addEventListener('hidden.bs.modal', function() {
        const foodForm = document.getElementById('updatefoodForm');
        foodForm.reset();
        foodForm.dataset.foodId = '';
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const table = document.querySelector('.datatable tbody');

    searchInput.addEventListener('keyup', function() {
        const query = searchInput.value.toLowerCase();
        const rows = table.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName('td');
            let match = false;

            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell.textContent.toLowerCase().includes(query)) {
                    match = true;
                    break;
                }
            }

            if (match) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});
