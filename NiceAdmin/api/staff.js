async function loadStaffTable() {
    const token =localStorage.getItem("token");
    try {
        const response = await fetch('http://localhost:8080/TastyKing/users/getStaff', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();

        if (data.code === 0) {
            const staffList = data.result;
            const staffTableBody = document.getElementById('staffTableBody');
            staffTableBody.innerHTML = ''; // Clear existing rows

            staffList.forEach(staff => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${staff.userId}</td>
                            <td>${staff.fullName}</td>
                            <td>${staff.email}</td>
                            <td>${staff.phone}</td>
                            <td>${staff.role}</td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-btn" data-id="${staff.userId}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${staff.userId}">Delete</button>
                            </td>
                        `;
                staffTableBody.appendChild(row);
            });

            // Attach event listeners to Edit and Delete buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        } else {
            alert('Failed to load staff data.');
        }
    } catch (error) {
        console.error('Error fetching staff list:', error);
    }
}

document.getElementById('staffForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const staffData = { fullName, email, phone, password };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/TastyKing/users/account-staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(staffData)
        });

        const result = await response.json();

        if (response.ok) {
            const staffModal = new bootstrap.Modal(document.getElementById('staffModal'));
            staffModal.hide();
            alert('New staff account has been created successfully.');
            window.location.reload();
            document.getElementById('staffForm').reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the staff account.');
    }
});

function handleEdit(event) {
    const userId = event.target.getAttribute('data-id');
    const token=localStorage.getItem('token');
    fetch(`http://localhost:8080/TastyKing/users/getUserByID/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },

    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const user = data.result;
                document.getElementById('updateFullName').value = user.fullName;
                document.getElementById('updatePhone').value = user.phone;
                document.getElementById('updatePassword').value = '';

                const updateStaffModal = new bootstrap.Modal(document.getElementById('updateStaffModal'));
                updateStaffModal.show();

                document.getElementById('updateStaffForm').onsubmit = async function(event) {
                    event.preventDefault();

                    const fullName = document.getElementById('updateFullName').value;
                    const phone = document.getElementById('updatePhone').value;
                    const password = document.getElementById('updatePassword').value;

                    const updateData = { fullName, phone, password };

                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`http://localhost:8080/TastyKing/users/updateStaff/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token,
                            },
                            body: JSON.stringify(updateData)
                        });

                        if (response.ok) {
                            alert('Staff updated successfully.');
                            updateStaffModal.hide();
                            loadStaffTable();
                        } else {
                            const result = await response.json();
                            alert('Error: ' + result.message);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while updating the staff account.');
                    }
                };
            } else {
                alert('Failed to load staff data.');
            }
        })
        .catch(error => {
            console.error('Error fetching staff details:', error);
        });
}

async function handleDelete(event) {
    const userId = event.target.getAttribute('data-id');

    if (confirm('Are you sure you want to delete this staff?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/TastyKing/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });

            if (response.ok) {
                alert('Staff deleted successfully.');
                loadStaffTable();
            } else {
                alert('Failed to delete staff.');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    }
}

// Initial load of staff table data
loadStaffTable();