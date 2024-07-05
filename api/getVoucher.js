document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8080/TastyKing/voucher')
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const vouchers = data.result;
                const voucherContainer = document.getElementById('voucher-container');
                vouchers.forEach(voucher => {
                    const voucherElement = document.createElement('a');
                    voucherElement.href = `voucher-details.html?voucherID=${voucher.voucherId}`;
                    voucherElement.classList.add('col-lg-3', 'col-sm-6', 'wow', 'fadeInUp');
                    voucherElement.setAttribute('data-wow-delay', '0.1s');
                    voucherElement.innerHTML = `
                                <div class="service-item rounded pt-3">
                                    <div class="p-4">
                                        <img src="${voucher.voucherImage}" alt="Voucher Image">
                                        <h5>${voucher.voucherTitle}</h5>
                                        <p>${voucher.voucherDescribe}</p>
                                        <div class="voucher-meta">
                                            <span><i class="fa fa-eye"></i> ${voucher.numberVoucherUsed}</span>
                                            <span><i class="fa fa-tags"></i> ${voucher.voucherQuantity}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                    voucherContainer.appendChild(voucherElement);
                });
            }
        })
        .catch(error => console.error('Error fetching vouchers:', error));
});