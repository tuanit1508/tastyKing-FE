document.addEventListener("DOMContentLoaded", function() {
    // Get a reference to the button that triggers the create modal
    var showModalBtn = document.getElementById('showModalBtn');

    // Add click event listener to the button
    showModalBtn.addEventListener('click', function() {
        // Create a new modal object using bootstrap.modal
        var myModal = new bootstrap.Modal(document.getElementById('categoryModal'));
        // Show the modal
        myModal.show();
    });

    // Function to fetch categories and display in the table
    function fetchCategories() {
        fetch('http://localhost:8080/TastyKing/category')
            .then(response => response.json())
            .then(data => {
                const categories = data.result;
                let tableBody = '';
                categories.forEach(category => {
                    tableBody += `
                <tr>
                  <td>${category.categoryID}</td>
                  <td>${category.categoryName}</td>
                  <td>
                    <button class="btn btn-info view-btn" data-id="${category.categoryID}">View</button>
                    <button class="btn btn-primary update-btn" data-id="${category.categoryID}" data-name="${category.categoryName}">Update</button>
                  </td>
                </tr>
              `;
                });
                document.getElementById('categoryTableBody').innerHTML = tableBody;
            });
    }

    // Fetch and display categories on page load
    fetchCategories();

    // Handle form submission for creating a new category
    document.getElementById('categoryForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const categoryName = document.getElementById('categoryName').value;
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/TastyKing/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ categoryName: categoryName })
        })
            .then(response => response.json())
            .then(data => {
                // Hide the modal after successful creation
                var myModal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
                myModal.hide();
                // Fetch and display the updated category list
                fetchCategories();
            })
            .catch(error => console.error('Error:', error));
    });

    // Handle click event for update buttons (use event delegation)
    document.getElementById('categoryTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('update-btn')) {
            const categoryId = event.target.dataset.id;
            const categoryName = event.target.dataset.name;
            document.getElementById('updateCategoryName').value = categoryName;

            // Show the update modal
            var myModal = new bootstrap.Modal(document.getElementById('updateCategoryModal'));
            myModal.show();

            // Handle form submission for updating the category
            document.getElementById('updateCategoryForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const updatedCategoryName = document.getElementById('updateCategoryName').value;
                const token = localStorage.getItem('token');
                fetch(`http://localhost:8080/TastyKing/category/${categoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ categoryName: updatedCategoryName })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Hide the modal after successful update
                        var myModal = bootstrap.Modal.getInstance(document.getElementById('updateCategoryModal'));
                        myModal.hide();
                        // Fetch and display the updated category list
                        fetchCategories();
                    })
                    .catch(error => console.error('Error:', error));
            }, { once: true }); // Use { once: true } to ensure the event listener is removed after execution
        }
    });
});