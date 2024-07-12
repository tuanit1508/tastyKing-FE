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
            .catch(error => console.error('Error:', error));
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
            .catch(error => console.error('Error:', error));
    }

    // Handle form submission for creating a new food item
    document.getElementById('foodForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        formData.append('categoryID', document.getElementById('categoryName').value);
        const token = localStorage.getItem('token');
        const isUpdate = this.dataset.update === 'true'; // Check if the form is in update mode

        const url = isUpdate ? `http://localhost:8080/TastyKing/food/${this.dataset.foodId}` : 'http://localhost:8080/TastyKing/food';
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
                // Hide the modal after successful creation or update
                const myModal = bootstrap.Modal.getInstance(document.getElementById(isUpdate ? 'updatemenuModal' : 'menuModal'));
                myModal.hide();
                // Optionally, fetch and display the updated food list
                fetchFoodItems();
            })
            .catch(error => console.error('Error:', error));
    });

    // Handle form submission for updating a food item
    document.getElementById('updatefoodForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        formData.append('categoryID', document.getElementById('updatecategoryName').value);
        const token = localStorage.getItem('token');
        const foodID = this.dataset.foodId;

        const fileInput = document.getElementById('updatefoodImage');
        if (fileInput.files.length > 0) {
            formData.append('foodImage', fileInput.files[0]);
        }

        fetch(`http://localhost:8080/TastyKing/food/${foodID}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Hide the modal after successful update
                const myModal = bootstrap.Modal.getInstance(document.getElementById('updatemenuModal'));
                myModal.hide();
                // Optionally, fetch and display the updated food list
                fetchFoodItems();
            })
            .catch(error => console.error('Error:', error));
    });

    // Handle update button click
    function handleUpdate(event) {
        const foodID = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token');

        // Fetch food details and populate the form for updating
        fetch(`http://localhost:8080/TastyKing/food/getFood/${foodID}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.result) {
                    const food = data.result;
                    console.log('Fetched food details:', food); // Log the fetched food details for debugging

                    // Populate the form fields with the fetched food details
                    document.getElementById('updatecategoryName').value = food.category.categoryID;
                    document.getElementById('updatefoodName').value = food.foodName;
                    document.getElementById('updatefoodPrice').value = food.foodPrice;
                    document.getElementById('updatefoodCost').value = food.foodCost;
                    document.getElementById('updateunit').value = food.unit;
                    document.getElementById('updatedescription').value = food.description;

                    // Show the existing image in the preview
                    const foodImagePreview = document.getElementById('foodImagePreview');
                    foodImagePreview.src = `http://localhost:63343/TastyKing-FE/${food.foodImage}`;

                    // Set form to update mode
                    const foodForm = document.getElementById('updatefoodForm');
                    foodForm.dataset.update = 'true';
                    foodForm.dataset.foodId = foodID;
                } else {
                    console.error('No food details found for the given ID:', foodID);
                }
            })
            .catch(error => console.error('Error:', error));
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
                .catch(error => console.error('Error:', error));
        }
    }

    // Initialize: fetch categories and food items on page load
    fetchCategories();
    fetchFoodItems();

    // Reset form and mode when modal is hidden
    document.getElementById('updatemenuModal').addEventListener('hidden.bs.modal', function() {
        const foodForm = document.getElementById('updatefoodForm');
        foodForm.reset();
        foodForm.dataset.update = 'false';
        foodForm.dataset.foodId = '';
    });
});

// Search functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const table = document.querySelector('.datatable tbody');

    searchInput.addEventListener('keyup', function () {
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
