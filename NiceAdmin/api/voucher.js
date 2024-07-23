document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    function fetchVouchers() {
        fetch('http://localhost:8080/TastyKing/voucher', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const voucherTableBody = document.getElementById('voucherTableBody');
                voucherTableBody.innerHTML = '';

                data.result.forEach(voucher => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${voucher.voucherId}</td>
                    <td>${voucher.voucherTitle}</td>
                    <td>${new Date(voucher.voucherStartDate).toLocaleString()}</td>
                    <td>${new Date(voucher.voucherDueDate).toLocaleString()}</td>
                    <td>${voucher.expried ? 'Expired' : 'Unexpired'}</td>
                    <td>${voucher.voucherQuantity}</td>
                    <td>
                        <button class="btn btn-info view-btn" data-id="${voucher.voucherId}" data-bs-toggle="modal" data-bs-target="#viewVoucherModal">View</button>
                        
                    </td>
                `;
                    voucherTableBody.appendChild(tr);
                });

                document.querySelectorAll('.view-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const voucherId = this.getAttribute('data-id');
                        viewVoucher(voucherId);
                    });
                });

                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const voucherId = this.getAttribute('data-id');
                        editVoucher(voucherId);
                    });
                });
            })
            .catch(error => console.error('Error fetching vouchers:', error));
    }

    function viewVoucher(voucherId) {
        fetch(`http://localhost:8080/TastyKing/voucher/${voucherId}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const voucher = data.result;
                document.querySelector('#viewVoucherModal #voucher-detail').innerHTML = `
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td rowspan="3" class="text-center">
                                <img src="http://localhost:63343/TastyKing-FE/${voucher.voucherImage}" alt="Voucher Image" class="img-fluid" style="max-width: 150px; border: 1px solid #ddd; border-radius: 8px;">
                            </td>
                            <td colspan="2"><strong>Voucher Code:</strong> ${voucher.voucherCode}</td>
                        </tr>
                        <tr>
                            <td><strong>Voucher Title:</strong></td>
                            <td>${voucher.voucherTitle}</td>
                        </tr>
                        <tr>
                            <td><strong>Discount:</strong></td>
                            <td>${voucher.voucherDiscount}%</td>
                        </tr>
                        <tr class="table-active">
                            <th colspan="3">Voucher Information</th>
                        </tr>
                        <tr>
                            <td><strong>Exchange Point:</strong></td>
                            <td colspan="2">${voucher.voucherExchangePoint}</td>
                        </tr>
                        <tr>
                            <td><strong>Due Date:</strong></td>
                            <td colspan="2">${new Date(voucher.voucherDueDate).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            `;
            })
            .catch(error => console.error('Error fetching voucher details:', error));
    }

    function editVoucher(voucherId) {
        fetch(`http://localhost:8080/TastyKing/voucher/${voucherId}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const voucher = data.result;
                document.getElementById('updatevoucherID').value = voucher.voucherId;
                document.getElementById('updateVoucherTitle').value = voucher.voucherTitle;
                document.getElementById('updateDiscount').value = voucher.voucherDiscount;
                document.getElementById('updateQuantity').value = voucher.voucherQuantity;
                document.getElementById('updateExchangePoint').value = voucher.voucherExchangePoint;
                document.getElementById('updateopendate').value = new Date(voucher.voucherStartDate).toISOString().slice(0, 16);
                document.getElementById('updateenddate').value = new Date(voucher.voucherDueDate).toISOString().slice(0, 16);
                document.getElementById('updateDescription').value = voucher.voucherDescribe;
                const voucherImagePreview = document.getElementById('voucherImagePreview');
                voucherImagePreview.src = `http://localhost:63343/TastyKing-FE/${voucher.voucherImage}`;
            })
            .catch(error => console.error('Error fetching voucher details:', error));
    }

    // Submit new voucher form
    document.getElementById('voucherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('http://localhost:8080/TastyKing/voucher', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                fetchVouchers(); // Refresh the voucher list
                const myModal = bootstrap.Modal.getInstance(document.getElementById('voucherModal'));
                myModal.hide();
            })
            .catch(error => console.error('Error creating voucher:', error));
    });

    // Submit updated voucher form
    document.getElementById('updatevoucherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const voucherId = document.getElementById('updatevoucherID').value;
        const formData = new FormData(this);

        const updateopendate = document.getElementById('updateopendate').value;
        const updateenddate = document.getElementById('updateenddate').value;

        if (!updateopendate || !updateenddate) {
            alert('Start Date and End Date cannot be empty.');
            return;
        }

        formData.set('updateOpenDate', new Date(updateopendate).toISOString());
        formData.set('updateEndDate', new Date(updateenddate).toISOString());

        // Log form data for debugging
        console.log('Updating voucher with data:', {
            voucherId,
            voucherTitle: formData.get('updateVoucherTitle'),
            discount: formData.get('updateDiscount'),
            quantity: formData.get('updateQuantity'),
            exchangePoint: formData.get('updateExchangePoint'),
            startDate: formData.get('updateOpenDate'),
            dueDate: formData.get('updateEndDate'),
            description: formData.get('updateDescription'),
            image: formData.get('updateVoucherImage')
        });

        fetch(`http://localhost:8080/TastyKing/voucher/${voucherId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                fetchVouchers(); // Refresh the voucher list
                const myModal = bootstrap.Modal.getInstance(document.getElementById('updatevoucherModal'));
                myModal.hide();
            })
            .catch(error => console.error('Error updating voucher:', error));
    });

    // Fetch vouchers initially
    fetchVouchers();
});
