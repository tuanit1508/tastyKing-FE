document.addEventListener("DOMContentLoaded", function() {
    var myModal = new bootstrap.Modal(document.getElementById('tableModal'));
    var updateModal = new bootstrap.Modal(document.getElementById('updateTableModal'));

    // Fetch all tables and populate the table
    function fetchAndPopulateTables() {
        fetch('http://localhost:8080/TastyKing/table')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.getElementById('tableTableBody');
                tableBody.innerHTML = '';

                data.result.forEach(table => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-id', table.tableID);

                    row.innerHTML = `
                    <td>${table.tableID}</td>
                    <td>${table.tableName}</td>
                    <td>${table.tablePosition.tablePosition}</td>
                    <td>${table.numOfchair}</td>
                    <td>${table.tableStatus}</td>
                    <td>
                        <button class="btn btn-primary btn-edit">Edit</button>
                        <button class="btn btn-danger btn-delete">Delete</button>
                    </td>
                `;

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching tables:', error);
                // Handle error if necessary
            });
    }

    // Function to populate area dropdown in add and update modals
    function populateAreaDropdown() {
        fetch('http://localhost:8080/TastyKing/table-position')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tablePositionSelect = document.getElementById('tablePosition');
                const updateTablePositionSelect = document.getElementById('updateTablePosition');
                tablePositionSelect.innerHTML = '<option value="">Select Area</option>';
                updateTablePositionSelect.innerHTML = '<option value="">Select Area</option>';

                data.result.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.tablePositionID;
                    option.textContent = position.tablePosition ? `${position.tablePositionID} - ${position.tablePosition}` : 'Unknown Position';
                    tablePositionSelect.appendChild(option);

                    const updateOption = document.createElement('option');
                    updateOption.value = position.tablePositionID;
                    updateOption.textContent = position.tablePosition || 'Unknown Position';
                    updateTablePositionSelect.appendChild(updateOption);
                });
            })
            .catch(error => {
                console.error('Error fetching table positions:', error);
                // Handle error if necessary
            });
    }

    // Initial fetch and populate tables and areas
    fetchAndPopulateTables();
    populateAreaDropdown();

    // Show modal for adding a new table
    document.getElementById('showModalBtn').addEventListener('click', function() {
        myModal.show();
    });

    // Handle form submission for adding a new table
    document.getElementById('tableForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            tablePosition: {
                tablePositionID: document.getElementById('tablePosition').value
            },
            tableName: document.getElementById('tableName').value,
            numOfchair: document.getElementById('numOfChair').value
        };

        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/TastyKing/table', {
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
                fetchAndPopulateTables(); // Refresh table data
            })
            .catch(error => {
                console.error('Error creating new table:', error);
                // Handle error if necessary
            });
    });

    // Function to open update modal and populate data
    function openUpdateModal(tableID) {
        fetch(`http://localhost:8080/TastyKing/table/getTable/${tableID}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('updateTableID').value = data.result.tableID;
                document.getElementById('updateTableName').value = data.result.tableName;
                document.getElementById('updateNumOfChair').value = data.result.numOfchair;
                document.getElementById('updateTablePosition').value = data.result.tablePosition ? data.result.tablePosition.tablePositionID : '';
                updateModal.show();
            })
            .catch(error => {
                console.error('Error fetching table data for update:', error);
                // Handle error if necessary
            });
    }

    // Handle click on "Edit" and "Delete" buttons inside the table
    document.getElementById('tableTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-edit')) {
            var tableID = event.target.closest('tr').getAttribute('data-id');
            openUpdateModal(tableID);
        } else if (event.target.classList.contains('btn-delete')) {
            var tableID = event.target.closest('tr').getAttribute('data-id');
            if (confirm('Are you sure you want to delete this table?')) {
                deleteTable(tableID);
            }
        }
    });

    // Handle form submission for updating a table
    document.getElementById('updateTableForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = {
            tablePositionID: document.getElementById('updateTablePosition').value,
            tableName: document.getElementById('updateTableName').value,
            numOfchair: parseInt(document.getElementById('updateNumOfChair').value)
        };
        var tableID = document.getElementById('updateTableID').value;
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/TastyKing/table/${tableID}`, {
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
                updateModal.hide();
                fetchAndPopulateTables(); // Refresh table data
            })
            .catch(error => {
                console.error('Error updating table:', error);
                // Handle error if necessary
            });
    });

    // Function to delete a table
    function deleteTable(tableID) {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/TastyKing/table/${tableID}`, {
            method: 'DELETE',
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
                fetchAndPopulateTables(); // Refresh table data
            })
            .catch(error => {
                console.error('Error deleting table:', error);
                // Handle error if necessary
            });
    };
});
