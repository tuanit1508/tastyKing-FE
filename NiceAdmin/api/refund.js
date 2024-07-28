document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:8080/TastyKing/refund'; // Replace with your API endpoint
    const bearerToken = localStorage.getItem('token');// Replace with your Bearer Token

    function fetchRefunds() {
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
                    displayRefunds(data.result);
                } else {
                    console.error('Failed to fetch refunds:', data);
                }
            })
            .catch(error => console.error('Error fetching refunds:', error));
    }

    function displayRefunds(refunds) {
        const refundTableBody = document.getElementById('refundTableBody');
        refundTableBody.innerHTML = '';

        refunds.forEach(refund => {
            const row = document.createElement('tr');
            let acceptButton = '';

            // Add "ACCEPT" button if refundStatus is "NOT_ACCEPT_YET"
            if (refund.refundStatus === "NOT_ACCEPT_YET") {
                acceptButton = `<button class="btn btn-success btn-sm" onclick="acceptRefund(${refund.orderID})">Accept</button>`;
            }

            row.innerHTML = `
        <td>${refund.refundID}</td>
        <td>${refund.orderID}</td>
        <td>${refund.refundBankAccountOwner}</td>
        <td>${refund.refundAmount}VND</td>
        <td>${refund.refundStatus}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewRefund(${refund.refundID})">View</button>
          ${acceptButton}
        </td>
      `;
            refundTableBody.appendChild(row);
        });
    }

    window.viewRefund = function (refundID) {
        const refundDetailsUrl = `http://localhost:8080/TastyKing/refund/get/${refundID}`;

        fetch(refundDetailsUrl, {
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
                    console.error('Failed to fetch refund details:', data);
                }
            })
            .catch(error => console.error('Error fetching refund details:', error));
    };

    function showModal(refund) {
        document.getElementById('orderID').value = refund.orderID;
        document.getElementById('refundBankAccountOwner').value = refund.refundBankAccountOwner;
        document.getElementById('refundBankAccount').value = refund.refundBankAccount;
        document.getElementById('refundBankName').value = refund.refundBankName;
        document.getElementById('totalAmount').value = refund.refundAmount;
        document.getElementById('refundDate').value = new Date(refund.refundDate).toLocaleString();
        document.getElementById('refundStatus').value = refund.refundStatus;
        document.getElementById('refundDescription').value = refund.refundDescription;
        const refundImage = document.getElementById('refundImageReview');
        refundImage.src = `http://localhost:63343/TastyKing-FE/${refund.refundImage}`;
        const refundLink = document.getElementById('refundImageLink');
        refundLink.href= `http://localhost:63343/TastyKing-FE/${refund.refundImage}`;

        // Show the modal
        var refundModal = new bootstrap.Modal(document.getElementById('refundModal'));
        refundModal.show();
    }

    window.acceptRefund = function (orderID) {
        const acceptUrl = `http://localhost:8080/TastyKing/order/cancelOrderByAdmin/${orderID}`;

        fetch(acceptUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    // Successfully accepted the refund
                    fetchRefunds(); // Refresh the list to remove the ACCEPT button
                    alert('Processed successfully'); // Show alert
                } else {
                    console.error('Failed to accept refund:', data);
                }
            })
            .catch(error => console.error('Error accepting refund:', error));
    };

    // Initial fetch
    fetchRefunds();
});