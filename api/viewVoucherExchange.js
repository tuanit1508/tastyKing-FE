let vouchers = [];
let currentPage = 1;
const itemsPerPage = 5;

document.addEventListener("DOMContentLoaded", function() {
    const email = localStorage.getItem('loggedInUserEmail');
    const token = localStorage.getItem('authToken');
    fetchVoucherExchanges(email, token);

    document.getElementById("pagination-controls").addEventListener("click", function(event) {
        if (event.target.classList.contains("page-link")) {
            currentPage = parseInt(event.target.dataset.page);
            displayVouchers();
        }
    });
});

function fetchVoucherExchanges(email, token) {
    fetch(`http://localhost:8080/TastyKing/voucherExchange/getVoucherExchange/${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                vouchers = data.result;
                displayVouchers();
            } else {
                alert("Error fetching vouchers.");
            }
        })
        .catch(error => {
            console.error("Error fetching vouchers:", error);
            alert("Error fetching vouchers. Please try again.");
        });
}

function displayVouchers() {
    const voucherList = document.getElementById("voucher-list");
    voucherList.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedVouchers = vouchers.slice(start, end);

    paginatedVouchers.forEach(voucher => {
        voucherList.innerHTML += `
            <table style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 100%; margin-bottom: 20px;">
                <tbody>
                    <tr>
                        <td rowspan="3" style="text-align: center; padding: 20px;">
                            <img src="${voucher.voucher.voucherImage}" alt="Product Image" style="width: 150px; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                        </td>
                        <td colspan="2" style="text-align: left; padding: 20px; font-weight: bold;">Voucher Code: ${voucher.voucher.voucherId}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 20px;">Voucher title:</td>
                        <td style="text-align: right; padding: 20px; padding-right: 20px;">${voucher.voucher.voucherTitle}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 20px;">Discount:</td>
                        <td style="text-align: right; padding: 20px; padding-right: 20px; color: green;">${voucher.voucher.voucherDiscount}%</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th scope="row" colspan="3" style="color: #333; text-align: right; padding: 20px; padding-right: 20px;">Voucher information</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 20px;">Exchange Date:</td>
                        <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${new Date(voucher.voucherExchangeDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 20px;">Due date:</td>
                        <td style="text-align: right; padding: 20px; padding-right: 20px;" colspan="2">${new Date(voucher.voucher.voucherDueDate).toLocaleDateString()}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });

    displayPagination();
}

function displayPagination() {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(vouchers.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        paginationControls.innerHTML += `
            <button class="page-link" data-page="${i}" style="margin: 0 5px; ${i === currentPage ? 'font-weight: bold;' : ''}">
                ${i}
            </button>
        `;
    }
}
