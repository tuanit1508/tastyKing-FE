document.addEventListener("DOMContentLoaded", function() {
    // Extract voucherID from URL
    const voucherCode = getQueryParam('voucherID');

    // Show the initial modal when the "Get Voucher" button is clicked
    document.getElementById("addToCartBtn").addEventListener("click", function() {
        const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        exampleModal.show();
    });

    // Handle the confirmation button click in the initial modal
    document.getElementById("confirmExchangeBtn").addEventListener("click", function() {
        const email = localStorage.getItem('loggedInUserEmail');
        const token = localStorage.getItem('authToken');

        if (email && token) {
            exchangeVoucher(voucherCode, email, token);
        } else {
            alert("User not logged in or token not available.");
        }
    });
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function exchangeVoucher(voucherCode, email, token) {
    const requestBody = {
        user: {
            email: email
        },
        voucher: {
            voucherId: voucherCode
        }
    };

    fetch('http://localhost:8080/TastyKing/voucherExchange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const successModal = new bootstrap.Modal(document.getElementById('trade-success'));
                successModal.show();
            } else {
                document.getElementById("failMessage").textContent = data.message;
                const failModal = new bootstrap.Modal(document.getElementById('trade-fail'));
                failModal.show();
            }
        })
        .catch(error => {
            console.error("Error exchanging voucher:", error);
            document.getElementById("failMessage").textContent = "An unexpected error occurred. Please try again.";
            const failModal = new bootstrap.Modal(document.getElementById('trade-fail'));
            failModal.show();
        });
}
