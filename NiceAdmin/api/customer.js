document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const itemsPerPage = 10;
    let currentPage = 1;
    let totalCustomers = 0;

    // Function to fetch and display customers in the table with pagination
    function fetchCustomers(page = 1) {
        fetch('http://localhost:8080/TastyKing/users/getCustomer', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                const customers = data.result;
                totalCustomers = customers.length;
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedCustomers = customers.slice(start, end);

                let tableBody = '';
                paginatedCustomers.forEach(customer => {
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

                updatePaginationInfo();
            })
            .catch(error => console.error('Error:', error));
    }

    // Update pagination info
    function updatePaginationInfo() {
        const totalPages = Math.ceil(totalCustomers / itemsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prevPageBtn').disabled = currentPage === 1;
        document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
    }

    // Event listeners for pagination buttons
    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCustomers(currentPage);
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(totalCustomers / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            fetchCustomers(currentPage);
        }
    });

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
                    fetchCustomers(currentPage); // Update customer list (consider granular updates)

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
                    fetchCustomers(currentPage); // Refresh customer list (consider using a more granular update)

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
                    fetchCustomers(currentPage);
                })
                .catch(error => console.error('Error:', error));
        }
    }

    // Initialize: fetch customers on page load
    fetchCustomers(currentPage);

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

    // Search functionality
    document.getElementById('searchInput').addEventListener('keyup', function () {
        const query = this.value.toLowerCase();
        const rows = document.querySelectorAll('#customerTableBody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;

            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(query)) {
                    match = true;
                }
            });

            if (match) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Show modal for creating new customer
    document.getElementById('showModalBtn').addEventListener('click', function() {
        var myModal = new bootstrap.Modal(document.getElementById('customerModal'));
        myModal.show();
    });
});
