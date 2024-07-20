document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:8080/TastyKing/payment'; // Replace with your API endpoint
    const bearerToken = localStorage.getItem('token');// Replace with your Bearer Token

    function fetchPayments() {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    displayPayments(data.result);
                } else {
                    console.error('Failed to fetch payments:', data);
                }
            })
            .catch(error => console.error('Error fetching payments:', error));
    }

    function displayPayments(payments) {
        const paymentTableBody = document.getElementById('paymentTableBody');
        paymentTableBody.innerHTML = '';

        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${payment.paymentID}</td>
        <td>${payment.orderID}</td>
        <td>${payment.paymentMethod}</td>
        <td>${payment.paymentAmount}VND</td>
        <td>${payment.paymentStatus}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewPayment(${payment.paymentID})">View</button>
        </td>
      `;
            paymentTableBody.appendChild(row);
        });
    }

    window.viewPayment = function(paymentID) {
        const paymentDetailsUrl = `http://localhost:8080/TastyKing/payment/get/${paymentID}`;

        fetch(paymentDetailsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.result) {
                    showModal(data.result);
                } else {
                    console.error('Failed to fetch payment details:', data);
                }
            })
            .catch(error => console.error('Error fetching payment details:', error));
    };

    function showModal(payment) {
        document.getElementById('orderID').value = payment.orderID;
        document.getElementById('paymentMethod').value = payment.paymentMethod;
        document.getElementById('totalAmount').value = payment.paymentAmount;
        document.getElementById('paymentDate').value = new Date(payment.paymentDate).toLocaleString();
        document.getElementById('status').value = payment.paymentStatus;
        document.getElementById('paymentDescription').value = payment.paymentDescription;

        // Show the modal
        var paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    }

    // Initial fetch
    fetchPayments();
});