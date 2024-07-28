document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:8080/TastyKing/order'; // Replace with your API URL
    const paymentApiUrl = 'http://localhost:8080/TastyKing/payment'; // Replace with your Payment API URL
    const token = localStorage.getItem('token'); // Replace with your Bearer token
    const itemsPerPage = 5;
    let currentPage = 1;
    let orders = [];

    function fetchOrders() {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && Array.isArray(data.result)) {
                    orders = data.result;
                    displayOrders(currentPage);
                    setupPagination();
                } else {
                    displayNoEntriesFound();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function displayOrders(page) {
        const tbody = document.querySelector('table.datatable tbody');
        tbody.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = orders.slice(start, end);

        if (paginatedItems.length > 0) {
            paginatedItems.forEach(order => {
                const row = document.createElement('tr');

                const cellOrderBy = document.createElement('td');
                cellOrderBy.textContent = order.user.email;
                row.appendChild(cellOrderBy);
                const cellOrderID = document.createElement('td');
                cellOrderID.textContent = order.orderID;
                row.appendChild(cellOrderID);

                const cellOrderDate = document.createElement('td');
                cellOrderDate.textContent = new Date(order.orderDate).toLocaleDateString();
                row.appendChild(cellOrderDate);

                const cellBookingDate = document.createElement('td');
                cellBookingDate.textContent = new Date(order.bookingDate).toLocaleDateString();
                row.appendChild(cellBookingDate);

                const cellOrderStatus = document.createElement('td');
                cellOrderStatus.textContent = order.orderStatus;
                row.appendChild(cellOrderStatus);

                const cellAction = document.createElement('td');
                const viewButton = document.createElement('button');
                viewButton.textContent = 'View';
                viewButton.classList.add('btn', 'btn-primary');
                viewButton.onclick = function () {
                    fetchOrderDetails(order.orderID);
                };
                cellAction.appendChild(viewButton);
                row.appendChild(cellAction);

                tbody.appendChild(row);
            });
        } else {
            displayNoEntriesFound();
        }
    }

    function setupPagination() {
        const paginationDiv = document.querySelector('.pagination');
        paginationDiv.innerHTML = '';
        const totalPages = Math.ceil(orders.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.toggle('active', i === currentPage);
            button.addEventListener('click', function () {
                currentPage = i;
                displayOrders(currentPage);
                setupPagination();
            });
            paginationDiv.appendChild(button);
        }
    }

    function displayNoEntriesFound() {
        const tbody = document.querySelector('table.datatable tbody');
        tbody.innerHTML = '';
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '6');
        cell.classList.add('datatable-empty');
        cell.textContent = 'No entries found';
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    function fetchOrderDetails(orderID) {
        fetch(`${apiUrl}/${orderID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    viewOrder(data.result);
                } else {
                    console.error('Order not found or an error occurred');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function viewOrder(order) {
        const modalBody = document.querySelector('#orderModal .modal-body');
        modalBody.innerHTML = `
            <div class="container-fluid mt-3">
                <div id="orders-container" style="width: 100%;">
                    <table style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 100%; margin-bottom: 20px;">
                        <tbody>
                            <tr>
                                <td colspan="3" style="text-align: left; padding: 20px; font-weight: bold;">Order ID: ${order.orderID}</td>
                            </tr>
                            ${order.orderDetails.map(item => `
                                <tr>
                                    <td rowspan="2" style="text-align: center; padding: 20px; width: 150px;">
                                        <img src="http://localhost:63343/TastyKing-FE/${item.foodImage}" alt="Product Image" style="width: 100px; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                                    </td>
                                    <td style="text-align: left; padding: 20px;">Food Name:</td>
                                    <td style="text-align: right; padding: 20px; padding-right: 20px;">${item.foodName}</td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; padding: 20px;">Quantity:</td>
                                    <td style="text-align: right; padding: 20px; padding-right: 20px;">${item.quantity}</td>
                                </tr>
                            `).join('')}
                            <tr style="background-color: #f2f2f2;">
                                <th scope="row" colspan="3" style="color: #333; text-align: right; padding: 20px; padding-right: 20px;">
                                    Total amount: ${order.totalAmount}VND
                                </th>
                            </tr>
                            <tr style="background-color: #f2f2f2;">
                                <th scope="row" colspan="3" style="color: red; text-align: right; padding: 20px; padding-right: 20px;">
                                    Deposit: ${order.deposit}VND
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Order code:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${order.orderID}</td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Booking date:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${order.bookingDate}</td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Customer name:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${order.customerName}</td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Table:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">
                                    ${['Canceled', 'Done', 'Processing', 'InProgress', 'InProgressNotPaying'].includes(order.orderStatus) ? '' : `
                                        <button class="btn btn-warning" onclick="receiveTable(${order.orderID})">Receive Table</button>
                                    `}
                                    ID: ${order.tables.tableID}: ${order.tables.tablePosition.tablePosition} - ${order.tables.tableName}
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Number of Customer:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${order.numOfCustomer}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: left; padding: 20px;">Customer phone: <a href="tel:+${order.customerPhone}" style="color: #007bff;">${order.customerPhone}</a></td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding: 20px;">Order Status:</td>
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">
                                    ${getOrderStatusButton(order.orderStatus)}
                                </td>
                            </tr>
                            <!-- New row for buttons -->
                            <tr id="action-buttons">
                                <td colspan="3" style="text-align: center; padding: 20px;">
                                    ${getActionButtons(order.orderStatus, order.orderID)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        var modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    }

    function getOrderStatusButton(status) {
        return `<button class="btn ${status === 'Completed' ? 'btn-success' : 'btn-warning'}">${status}</button>`;
    }

    function getActionButtons(status, orderID) {
        let buttons = '';
        if (status === 'Processing' || status === 'Updating') {
            buttons = `
                <h3>Click to "Confirm" to confirm order</h3>
                <button class="btn btn-success m-2" onclick="confirmOrder(${orderID})">Confirm</button>
                <button class="btn btn-danger m-2" onclick="cancelOrder(${orderID})">Cancel</button>
            `;
        } else if (['InProgressNotPaying'].includes(status)) {
            buttons = `
                <a href="update-order.html?orderID=${orderID}" class="m-2" style="text-decoration: none;">
                    <button style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px;">
                        Update
                    </button>
                </a>
                <button class="btn btn-primary m-2" onclick="showPaymentModal(${orderID})">Payment</button>
            `;
        } else if (['Canceled'].includes(status)) {
            buttons = ``;
        } else if (['InProgress'].includes(status)) {
            buttons = `
                <button onclick="payment(${orderID})" style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px;">
                    Payment
                </button>
            `;
        } else if (['Done'].includes(status)) {
            buttons = `
            <button onclick="printBill(${orderID})" style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px;">
                Print Bill
            </button>
            <button onclick="viewFeedback(${orderID})" style="background-color: #18a0ff; color: white; border: none; border-radius: 5px; padding: 10px 20px;">
                Feedback
            </button>
        `;
        }
    else if (['Confirmed'].includes(status)) {
        buttons = `
                
            `;
    }
        return buttons;
    }
    window.viewFeedback = function(orderID) {
        var orderModalElement = document.getElementById('orderModal');
        var orderModal = bootstrap.Modal.getInstance(orderModalElement);
        if (orderModal) {
            orderModal.hide();
        }

        const url = `http://localhost:8080/TastyKing/feedback/getFeedbackOrder/${orderID}`;
        const token = localStorage.getItem('token'); // Replace with your actual token retrieval method

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    const feedback = data.result;
                    document.getElementById('email').value = feedback.user.email;
                    document.getElementById('emotion').value = feedback.emotion;
                    document.getElementById('content').value = feedback.content;

                    // Show the modal
                    var feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
                    feedbackModal.show();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching feedback details:", error);
                alert("An error occurred while fetching the feedback details. Please try again.");
            });
    }

    window.printBill = function(orderID) {
        const url = `http://localhost:8080/TastyKing/bill/print/${orderID}`;
        const token = localStorage.getItem('token'); // Thay thế bằng token thực của bạn

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const newTab = window.open(blobUrl, '_blank');
                if (newTab) {
                    newTab.onload = function() {
                        window.URL.revokeObjectURL(blobUrl);
                    };
                } else {
                    alert('Please allow popups for this website');
                    window.URL.revokeObjectURL(blobUrl);
                }
            })
            .catch(error => {
                console.error('Error generating bill:', error);
                alert('An error occurred while generating the bill. Please try again.');
            });
    }


    window.showPaymentModal = function(orderID) {
        var orderModalElement = document.getElementById('orderModal');
        var orderModal = bootstrap.Modal.getInstance(orderModalElement);
        if (orderModal) {
            orderModal.hide();
        }
        // Set the order ID in the modal form
        document.getElementById('orderID').value = orderID;
        // Fetch order details to get totalAmount and deposit
        fetch(`${apiUrl}/${orderID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    const order = data.result;
                    document.getElementById('totalAmount').value = order.totalAmount;
                    document.getElementById('deposit').value = order.deposit;

                    // Show the modal
                    var paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
                    paymentModal.show();
                } else {
                    alert("Order not found or error retrieving order details.");
                }
            })
            .catch(error => {
                console.error("Error fetching order details:", error);
                alert("An error occurred while fetching the order details. Please try again.");
            });
    }

    document.getElementById('paymentForm').addEventListener('input', function () {
        const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
        const deposit = parseFloat(document.getElementById('deposit').value) || 0;
        const customerPayment = parseFloat(document.getElementById('customerPayment').value) || 0;
        const adjustedTotalAmount = totalAmount - deposit;

        if (customerPayment > adjustedTotalAmount) {
            const changeAmount = customerPayment - adjustedTotalAmount;
            document.getElementById('changeAmount').value = changeAmount;
            document.getElementById('changeAmountDiv').style.display = 'block';
        } else {
            document.getElementById('changeAmountDiv').style.display = 'none';
            document.getElementById('changeAmount').value = '';
        }
    });

    document.getElementById('paymentForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const orderID = document.getElementById('orderID').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const totalAmount = document.getElementById('totalAmount').value;
        const deposit = document.getElementById('deposit').value;
        const customerPayment = document.getElementById('customerPayment').value;

        const paymentData = {
            orderID: parseInt(orderID),
            paymentMethod: paymentMethod,
            paymentAmount: parseFloat(totalAmount) - parseFloat(deposit)
        };

        fetch(`${paymentApiUrl}/paymentByAdmin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert(`Payment submitted for Order ID: ${orderID}\nPayment Method: ${paymentMethod}\nTotal Amount: ${totalAmount}\nDeposit: ${deposit}\nAmount Received: ${customerPayment}`);
                    var paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                    paymentModal.hide();
                } else {
                    alert("Failed to create payment. Error code: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error creating payment:", error);
                alert("An error occurred while creating the payment. Please try again.");
            });
    });

    window.payment = function(orderID) {
        var orderModalElement = document.getElementById('orderModal');
        var orderModal = bootstrap.Modal.getInstance(orderModalElement);
        if (orderModal) {
            orderModal.hide();
        }
        // Fetch payment details
        fetch(`http://localhost:8080/TastyKing/payment/getPayment/${orderID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    // Set the payment details in the modal form
                    document.getElementById('paymentID2').value = data.result.paymentID;
                    document.getElementById('orderID2').value = data.result.orderID;
                    document.getElementById('paymentMethod2').value = data.result.paymentMethod;

                    // Fetch order details to get totalAmount and deposit
                    fetch(`${apiUrl}/${orderID}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(orderData => {
                            if (orderData.code === 0 && orderData.result) {
                                const totalAmount = orderData.result.totalAmount;
                                const deposit = orderData.result.deposit;
                                const newTotalAmount = totalAmount - deposit;
                                document.getElementById('totalAmount2').value = totalAmount;
                                document.getElementById('deposit2').value = deposit;
                                document.getElementById('newTotalAmount2').value = newTotalAmount;
                            } else {
                                alert("Order not found or error retrieving order details.");
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching order details:", error);
                            alert("An error occurred while fetching the order details. Please try again.");
                        });

                    // Show the modal
                    var paymentModal = new bootstrap.Modal(document.getElementById('paymentModal2'));
                    paymentModal.show();
                } else {
                    alert("Payment not found or error retrieving payment details.");
                }
            })
            .catch(error => {
                console.error("Error fetching payment details:", error);
                alert("An error occurred while fetching the payment details. Please try again.");
            });
    }

    document.getElementById('paymentForm2').addEventListener('input', function () {
        const newTotalAmount = parseFloat(document.getElementById('newTotalAmount2').value) || 0;
        const customerPayment = parseFloat(document.getElementById('customerPayment2').value) || 0;

        if (customerPayment > newTotalAmount) {
            const changeAmount = customerPayment - newTotalAmount;
            document.getElementById('changeAmount2').value = changeAmount;
            document.getElementById('changeAmountDiv2').style.display = 'block';
        } else {
            document.getElementById('changeAmountDiv2').style.display = 'none';
            document.getElementById('changeAmount2').value = '';
        }
    });

    document.getElementById('paymentForm2').addEventListener('submit', function (event) {
        event.preventDefault();

        const paymentID = document.getElementById('paymentID2').value;
        const orderID = document.getElementById('orderID2').value;
        const paymentMethod = document.getElementById('paymentMethod2').value;
        const newTotalAmount = document.getElementById('newTotalAmount2').value;

        const paymentData = {
            orderID: parseInt(orderID),
            paymentMethod: paymentMethod,
            paymentAmount: parseFloat(newTotalAmount)
        };

        fetch(`http://localhost:8080/TastyKing/payment/update/${paymentID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert(`Payment updated for Order ID: ${orderID}\nPayment Method: ${paymentMethod}\nTotal Amount: ${newTotalAmount}`);
                    var paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal2'));
                    paymentModal.hide();
                } else {
                    alert("Failed to update payment. Error code: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error updating payment:", error);
                alert("An error occurred while updating the payment. Please try again.");
            });
    });

    window.confirmOrder = function (orderID) {
        fetch(`http://localhost:8080/TastyKing/order/confirmOrder/${orderID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert(data.result);
                    fetchOrders(); // Refresh the orders list
                } else {
                    console.error('Error confirming the order');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    window.cancelOrder = function (orderID) {
        fetch(`http://localhost:8080/TastyKing/order/cancelOrderByAdmin/${orderID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert(data.result);
                    window.location.reload(); // Reload the page

                } else {
                    console.error('Error canceling the order');
                }
            })
            .catch(error => console.error('Error:', error));
    };


    window.receiveTable = function (orderID) {
        fetch(`http://localhost:8080/TastyKing/order/receiveTable/${orderID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert(data.result);
                    fetchOrders(); // Refresh the orders list
                } else {
                    alert(data.message)
                    console.error('Error receiving the table');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    fetchOrders();
});