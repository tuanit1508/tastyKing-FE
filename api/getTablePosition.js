

function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Utility function to get a value from localStorage
function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Variable to track the selected table
let selectedTable = null;

document.addEventListener('DOMContentLoaded', function() {
    const tablePositionsList = document.getElementById('table-positions');
    const restaurantMap = document.getElementById('restaurant-map');

    // Fetch table positions and populate sidebar
    fetch('http://localhost:8080/TastyKing/table-position')
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const positions = data.result;
                positions.forEach(position => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');

                    const link = document.createElement('a');
                    link.href = '#';
                    link.dataset.id = position.tablePositionID;
                    link.textContent = position.tablePosition;

                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        fetchTablesByPosition(position.tablePositionID);
                    });

                    listItem.appendChild(link);
                    tablePositionsList.appendChild(listItem);
                });
            } else {
                console.error('Error fetching table positions:', data);
            }
        })
        .catch(error => console.error('Fetch error:', error));

    // Fetch tables by position and update main content
    function fetchTablesByPosition(tablePositionID) {
        fetch(`http://localhost:8080/TastyKing/table/${tablePositionID}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    const tables = data.result;
                    restaurantMap.innerHTML = '';
                    tables.forEach(table => {
                        const tableDiv = document.createElement('div');
                        tableDiv.classList.add('table');
                        tableDiv.classList.add(table.tableStatus.toLowerCase());
                        tableDiv.dataset.category = table.tablePosition.tablePosition.toLowerCase().replace(/ /g, '-');
                        tableDiv.dataset.table = table.tableID;
                        tableDiv.dataset.name = table.tableName;
                        tableDiv.dataset.position = table.tablePosition.tablePosition;
                        tableDiv.innerHTML = `${table.tableName}<br>${table.numOfchair} seats`;
                        restaurantMap.appendChild(tableDiv);
                    });

                    // Reinitialize table event listeners after adding new tables
                    initializeTableEventListeners();
                } else {
                    console.error('Error fetching tables:', data);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }

    // Function to initialize event listeners for tables
    function initializeTableEventListeners() {
        const tables = document.querySelectorAll('.table');

        // Function to filter tables based on category
        function filterTables(category) {
            tables.forEach(function (table) {
                const tableCategory = table.getAttribute('data-category');
                if (category === 'all' || tableCategory === category) {
                    table.style.display = 'block'; // Show tables matching category
                } else {
                    table.style.display = 'none'; // Hide tables not matching category
                    table.classList.remove('selected'); // Deselect hidden tables
                }
            });
        }

        // Initially show all tables
        filterTables('all');

        // Event listener for table selection
        tables.forEach(function (table) {
            table.addEventListener('click', function () {
                const tableID = this.getAttribute('data-table');
                const tableName = this.getAttribute('data-name');
                const tablePosition = this.getAttribute('data-position');
                const status = this.classList.contains('available') ? 'available' :
                    this.classList.contains('booked') ? 'booked' : 'serving';

                if (status === 'available') {
                    // Deselect any previously selected table
                    if (selectedTable) {
                        selectedTable.classList.remove('selected');
                    }

                    // Select the current table
                    this.classList.add('selected');
                    selectedTable = this;

                    // Store the selected table ID in localStorage
                    setLocalStorage('selectedTableID', tableID);

                    // Update booking message
                    document.getElementById('booking-message').innerHTML = `<p>Table ${tableName} - ${tablePosition} selected. Click 'Book Now' to confirm.</p>`;
                } else if (status === 'booked') {
                    document.getElementById('booking-message').innerHTML = `<p>Table ${tableName} - ${tablePosition} is already booked. Please choose another table.</p>`;
                } else if (status === 'serving') {
                    document.getElementById('booking-message').innerHTML = `<p>Table ${tableName} - ${tablePosition} is currently serving. Please choose another table.</p>`;
                }
            });
        });
    }

    // Initialize event listeners for tables on page load
    initializeTableEventListeners();

    // Add event listener to the "Book Now" button
    document.getElementById('bookNowButton').addEventListener('click', function () {
        const tableID = getLocalStorage('selectedTableID');
        if (tableID) {
            setLocalStorage('tableID', tableID, 4); // Store table ID in localStorage
            // Redirect to cart.html
            window.location.href = 'cart.html';
        } else {
            alert('Please select a table first.');
        }
    });
    document.addEventListener('DOMContentLoaded', function () {
        // Function to set localStorage with expiration
        function setLocalStorage(key, value, minutes) {
            const now = new Date();
            const expirationTime = now.getTime() + minutes * 60000; // Calculate expiration time in milliseconds
            const item = {
                value: value,
                expiration: expirationTime
            };
            localStorage.setItem(key, JSON.stringify(item));
        }

        // Function to get localStorage item with expiration check
        function getLocalStorage(key) {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) {
                return null;
            }

            const item = JSON.parse(itemStr);
            const now = new Date();

            if (now.getTime() > item.expiration) {
                localStorage.removeItem(key);
                return null;
            }

            return item.value;
        }

    })
})