document.addEventListener('DOMContentLoaded', function() {
    fetchOrders();

    // Add event listener to dynamically created cancel buttons
    document.getElementById('orders-container').addEventListener('click', function(event) {
        if (event.target.closest('.cancel-order')) {
            event.preventDefault();
            const orderID = event.target.closest('.cancel-order').getAttribute('data-order-id');
            cancelOrder(orderID);
        }
    });
});

let currentPage = 1;
const ordersPerPage = 5;
let ordersData = [];

async function fetchOrders() {
    try {
        const authToken = localStorage.getItem("authToken");
        const email = localStorage.getItem("loggedInUserEmail"); // Replace with the desired email
        const response = await fetch(`http://localhost:8080/TastyKing/order/getOrder/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        const data = await response.json();

        if (data.code === 0) {
            ordersData = data.result;
            displayOrders(ordersData, currentPage);
            setupPagination(ordersData);
        } else {
            console.error('Error fetching orders:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayOrders(orders, page) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    const startIndex = (page - 1) * ordersPerPage;
    const endIndex = page * ordersPerPage;
    const ordersToDisplay = orders.slice(startIndex, endIndex);

    ordersToDisplay.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');
        orderElement.innerHTML = `
                    <table style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 100%; margin-bottom: 20px;">
                        <tbody>
                            <tr>
                                <td colspan="2" style="text-align: left; padding: 20px; font-weight: bold;">Order ID: ${order.orderID}</td>
                                <td style="text-align: right; padding: 20px;">
                                    Order detail<span id="toggle-arrow-${order.orderID}" style="cursor: pointer; margin-left: 10px">&#9654;</span>
                                </td>
                            </tr>
                            <!-- Container for order details -->
                            <tr class="order-details" id="order-details-${order.orderID}" style="display: none;">
                                <td colspan="3">
                                    ${order.orderDetails.map(item => `
                                        <table style="width: 100%;">
                                            <tr>
                                                <td rowspan="2" style="text-align: center; padding: 20px; width: 150px;">
                                                    <img src="${item.foodImage}" alt="Product Image" style="width: 100px; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                                                </td>
                                                <td style="text-align: left; padding: 20px;">Food Name:</td>
                                                <td style="text-align: right; padding: 20px; padding-right: 20px;">${item.foodName}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: left; padding: 20px;">Quantity:</td>
                                                <td style="text-align: right; padding: 20px; padding-right: 20px;">${item.quantity}</td>
                                            </tr>
                                        </table>
                                    `).join('')}
                                </td>
                            </tr>
                            <tr style="background-color: #f2f2f2;">
                                <th scope="row" colspan="3" style="color: #333; text-align: right; padding: 20px; padding-right: 20px;">Total amount: ${order.totalAmount}</th>
                            </tr><tr style="background-color: #f2f2f2;">
                                <th scope="row" colspan="3" style="color: red; text-align: right; padding: 20px; padding-right: 20px;">Deposit: ${order.deposit}</th>
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
                                <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">ID:${order.tables.tableID} (${order.tables.tableName})</td>
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
                            <tr>
                                <td colspan="3" style="text-align: center; padding: 20px;">
                                    ${order.orderStatus !== 'Canceled' && order.orderStatus !== 'InProgress' && order.orderStatus !== 'Done' ?
            `<a href="#" class="m-2 cancel-order" data-order-id="${order.orderID}" style="text-decoration: none;">
                                            <button style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px; margin-right: 10px;">
                                                Cancel
                                            </button>
                                        </a>` : ''}
                                    ${order.orderStatus !== 'Canceled' && order.orderStatus !== 'Done' && order.orderStatus !== 'Confirm' && order.orderStatus !== 'InProgress' ?
            `<a href="updateOrder.html?orderID=${order.orderID}" class="m-2" style="text-decoration: none;">
                                            <button style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px;">
                                                Update
                                            </button>
                                        </a>` : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;
        container.appendChild(orderElement);

        // JavaScript to toggle order details visibility
        document.getElementById(`toggle-arrow-${order.orderID}`).addEventListener('click', function() {
            const details = document.getElementById(`order-details-${order.orderID}`);
            if (details.style.display === 'none') {
                details.style.display = 'table-row';
                this.innerHTML = '&#9660;'; // Down arrow
            } else {
                details.style.display = 'none';
                this.innerHTML = '&#9654;'; // Right arrow
            }
        });
    });
}

function setupPagination(orders) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('page-button');
        pageButton.style.margin = '0 5px';
        pageButton.style.padding = '10px 15px';
        pageButton.style.border = '1px solid #007bff';
        pageButton.style.borderRadius = '5px';
        pageButton.style.backgroundColor = '#007bff';
        pageButton.style.color = 'white';
        pageButton.addEventListener('click', function() {
            currentPage = i;
            displayOrders(orders, currentPage);
            document.querySelectorAll('.pagination button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });

        paginationContainer.appendChild(pageButton);
    }
}

function getOrderStatusButton(status) {
    const statusMap = {
        "Processing": "grey",
        "Confirmed": "#16ff36",
        "InProgress": "#fff21d",
        "Canceled": "red",
        "Done": "greenyellow"
    };
    const color = statusMap[status] || "grey";
    return `<button disabled style="background-color: ${color}; color: white; border: none; border-radius: 5px; padding: 10px 20px;">${status}</button>`;
}

async function cancelOrder(orderID) {
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch(`http://localhost:8080/TastyKing/order/cancelOrder/${orderID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        const data = await response.json();

        if (data.code === 0) {
            alert(data.result); // Thông báo hủy đơn thành công
            fetchOrders(); // Cập nhật danh sách đơn hàng sau khi hủy
        } else {
            alert(data.message);
            console.error('Error canceling order:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}