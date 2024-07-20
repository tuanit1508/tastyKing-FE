document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const voucherID = params.get('voucherID');

    if (voucherID) {
        fetch(`http://localhost:8080/TastyKing/voucher/${voucherID}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    const voucher = data.result;
                    document.getElementById('voucherTitle').textContent = voucher.voucherTitle;
                    document.getElementById('voucherQuantity').textContent = `${voucher.voucherQuantity} voucher available`;
                    document.getElementById('voucherDiscount').textContent = `${voucher.voucherDiscount}% off`;
                    document.getElementById('voucherExchangePoint').textContent = `${voucher.voucherExchangePoint} points`;
                    document.getElementById('openDate').textContent = new Date(voucher.voucherStartDate).toLocaleDateString();
                    document.getElementById('endDate').textContent = new Date(voucher.voucherDueDate).toLocaleDateString();
                    document.getElementById('voucherImage').src = voucher.voucherImage;
                    document.getElementById('voucherImageLink').href = voucher.voucherImage;

                    if (voucher.expried) {
                        document.getElementById('addToCartBtn').style.display = 'none';
                        document.getElementById('expiredBtn').style.display = 'inline-block';
                    } else {
                        document.getElementById('expiredBtn').style.display = 'none';
                        document.getElementById('addToCartBtn').style.display = 'inline-block';
                    }
                }
            })
            .catch(error => console.error('Error fetching voucher details:', error));
    } else {
        console.error('No voucher ID found in URL');
    }
});