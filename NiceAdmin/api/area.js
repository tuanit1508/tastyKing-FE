document.addEventListener("DOMContentLoaded", function() {
    var myModal = new bootstrap.Modal(document.getElementById('areaModal'));
    var updateModal = new bootstrap.Modal(document.getElementById('updateAreaModal'));

    // Show modal when "Create new Area" button is clicked
    document.getElementById('showModalBtn').addEventListener('click', function() {
        // Clear form fields when modal is shown (optional)
        document.getElementById('createAreaForm').reset();
        myModal.show();
    });

    // Function to fetch and populate modal data for update
    function openUpdateModal(tablePositionID) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/TastyKing/table-position/${tablePositionID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('updatetablePosition').value = data.result.tablePosition;
                document.getElementById('updatetableQuantity').value = data.result.tableQuantity;
                document.getElementById('updateTablePositionID').value = data.result.tablePositionID;
                updateModal.show();
            })
            .catch(error => {
                console.error('Error fetching position:', error);
                // Handle error if necessary
            });
    }

    // Handle click on "Edit" button in the table
    document.getElementById('areaTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-edit')) {
            var tablePositionID = event.target.closest('tr').getAttribute('data-id');
            openUpdateModal(tablePositionID);
        }
    });

    // Handle form submission for updating table position
    document.getElementById('updateAreaForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent default form submission

        var formData = {
            tablePosition: document.getElementById('updatetablePosition').value,
            tableQuantity: parseInt(document.getElementById('updatetableQuantity').value),
            tablePositionID: parseInt(document.getElementById('updateTablePositionID').value)
        };
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/TastyKing/table-position/${formData.tablePositionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateModal.hide();  // Hide modal after successful update
                window.location.href = 'area-data.html'; // Redirect or refresh as needed
            })
            .catch(error => {
                console.error('Error updating position:', error);
                // Handle error if necessary
            });
    });

    // Initial fetch to populate the table with data
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/TastyKing/table-position', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('areaTableBody');

            data.result.forEach(position => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', position.tablePositionID);

                row.innerHTML = `
                <td>A${position.tablePositionID}</td>
                <td>${position.tablePosition}</td>
                <td>${position.tableQuantity}</td>
                <td><button class="btn btn-primary btn-edit">Edit</button></td>
            `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error if necessary
        });

    // Handle form submission for creating new table position
    document.getElementById('createAreaForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = {
            tablePosition: document.getElementById('tablePosition').value,
            tableQuantity: parseInt(document.getElementById('tableQuantity').value)
        };
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/TastyKing/table-position', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                myModal.hide();
                window.location.href = 'area-data.html'; // Redirect or refresh as needed
            })
            .catch(error => {
                console.error('Error creating new table position:', error);
                // Handle error if necessary
            });
    });
});
