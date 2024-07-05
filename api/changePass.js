document.getElementById('change-password-button').addEventListener('click', function () {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = new URLSearchParams(window.location.search).get('email'); // Assuming email is passed as a query parameter
    console.log(email)
    if (!email) {
        alert('Email not found!');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const payload = {
        newPass: newPassword
    };

    fetch(`http://localhost:8080/TastyKing/users/change-pass/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                alert(data.result);
                window.location.href='login.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password!');
        });
});