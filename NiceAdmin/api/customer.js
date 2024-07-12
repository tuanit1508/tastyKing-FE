document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');

    // Function to fetch and display all customers in the table
    function fetchCustomers() {
        fetch('http://localhost:8080/TastyKing/users/getCustomer', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                const customers = data.result;
                let tableBody = '';
                customers.forEach(customer => {
                    tableBody += `
                  <tr>
                    <td>${customer.userId}</td>
                    <td>${customer.fullName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.active ? 'Active' : 'Blocked'}</td>
                    <td>
                      <button class="btn btn-primary update-btn" data-id="${customer.userId}" data-email="${customer.email}" data-bs-toggle="modal" data-bs-target="#updatecustomerModal">Update</button>
                      <button class="btn ${customer.active ? 'btn-danger' : 'btn-success'} block-btn" data-id="${customer.userId}" data-active="${customer.active}">${customer.active ? 'Block' : 'Unblock'}</button>
                    </td>
                  </tr>
                `;
                });
                document.getElementById('customerTableBody').innerHTML = tableBody;

                // Add event listeners for the update and block/unblock buttons
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', handleUpdate);
                });
                document.querySelectorAll('.block-btn').forEach(button => {
                    button.addEventListener('click', handleBlockUnblock);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Handle form submission for creating a customer
    document.getElementById('customerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch('http://localhost:8080/TastyKing/users/account', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) { // Successful account creation
                   alert(data.result)
                    const myModal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
                    myModal.hide();
                    fetchCustomers(); // Update customer list (consider granular updates)

                    // Optional: Display success message
                    console.log('Customer account created successfully!'); // Or use toast notification
                } else { // Error handling
                    let errorMessage = 'Error creating account: '; // Generic message

                    if (data.message) {
                        errorMessage += data.message; // Use server-provided error message
                    } else {
                        errorMessage += 'Please try again later.'; // Default message
                    }

                    alert(errorMessage); // More user-friendly error display
                }
            })
            .catch(error => { // Generic error handling
                console.error('An unexpected error occurred:', error);
                alert('An error occurred while creating the customer account.');
            });
    });

    // Handle form submission for updating a customer
    document.getElementById('updatecustomer').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const email = this.dataset.email;

        fetch(`http://localhost:8080/TastyKing/users/update/${email}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    // Success: Update UI and close modal
                    const myModal = bootstrap.Modal.getInstance(document.getElementById('updatecustomerModal'));
                    myModal.hide();
                    fetchCustomers(); // Refresh customer list (consider using a more granular update)

                    // Optional: Display success message (consider UI integration)
                    console.log('Customer updated successfully!'); // Or use a toast notification
                } else {
                    // Error: Display error message
                    alert('Error: ' + data.message); // Consider more user-friendly error display
                }
            })
            .catch(error => {
                console.error('Error:', error); // Log the error for debugging
                alert('An error occurred while updating the customer.'); // Inform user about generic error
            });
    });

    // Handle update button click
    function handleUpdate(event) {
        const userId = event.target.getAttribute('data-id');
        const email = event.target.getAttribute('data-email');

        fetch(`http://localhost:8080/TastyKing/users/getUserByID/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.result) {
                    const customer = data.result;
                    document.getElementById('updatefullName').value = customer.fullName;

                    document.getElementById('updatephone').value = customer.phone;
                    document.getElementById('updatepassword').value = ''; // Clear the password field for security

                    const updateForm = document.getElementById('updatecustomer');
                    updateForm.dataset.email = email;
                } else {
                    console.error('No customer details found for the given ID:', userId);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Handle block/unblock button click
    function handleBlockUnblock(event) {
        const userId = event.target.getAttribute('data-id');
        const isActive = event.target.getAttribute('data-active') === '1';

        if (confirm(`Are you sure you want to ${isActive ? 'block' : 'unblock'} this customer?`)) {
            fetch(`http://localhost:8080/TastyKing/users/account-controll/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json())
                .then(data => {
                    fetchCustomers();
                })
                .catch(error => console.error('Error:', error));
        }
    }

    // Initialize: fetch customers on page load
    fetchCustomers();

    // Reset form and mode when modal is hidden
    document.getElementById('customerModal').addEventListener('hidden.bs.modal', function() {
        const customerForm = document.getElementById('customerForm');
        customerForm.reset();
        customerForm.dataset.update = 'false';
        customerForm.dataset.email = '';
    });

    document.getElementById('updatecustomerModal').addEventListener('hidden.bs.modal', function() {
        const updateForm = document.getElementById('updatecustomer');
        updateForm.reset();
        updateForm.dataset.email = '';
    });
});


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

document.addEventListener("DOMContentLoaded", function() {
    // Get a reference to the button that triggers the modal
    var showModalBtn = document.getElementById('showModalBtn');

    // Add click event listener to the button
    showModalBtn.addEventListener('click', function() {
        // Create a new modal object using bootstrap.modal
        var myModal = new bootstrap.Modal(document.getElementById('customerModal'));

        // Show the modal
        myModal.show();
    });
});