document.getElementById('otpForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = localStorage.getItem('email');
    const otp = document.getElementById('otp1').value +
        document.getElementById('otp2').value +
        document.getElementById('otp3').value +
        document.getElementById('otp4').value +
        document.getElementById('otp5').value +
        document.getElementById('otp6').value;


    fetch('http://localhost:8080/TastyKing/users/verify-account', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, otp: otp })
    })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw new Error(data.message || 'Network response was not ok');
                }
                return data;
            });
        })
        .then(data => {
            if (data.code === 0) {
                alert(data.result);
                window.location.href = 'login.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('Authentication failed, click the OTP resend button to receive a new authentication code. Error: ' + error.message);
        });
});

document.getElementById('resendOtp').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior

    const email = localStorage.getItem('email');

    fetch(`http://localhost:8080/TastyKing/users/regenerate-otp?email=${encodeURIComponent(email)}`, {
        method: 'PUT'
    })
        .then(response => {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
                return response.json();
            })
                .then(data => {
                    alert('A new OTP has been sent to your email.');
                })
                .catch(error => {
                    alert('Failed to resend OTP: ' + error.message);
                });
        });
})
