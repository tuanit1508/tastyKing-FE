document.getElementById('change-password-button').addEventListener('click', function () {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Token not found!');
        return;
    }

    const decodedToken = jwt_decode(token);
    const email = decodedToken.sub;

    console.log('Decoded Token:', decodedToken);
    console.log('Email:', email);

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    if (!oldPassword || !newPassword) {
        alert('Please fill in both fields.');
        return;
    }

    const payload = {
        oldPass: oldPassword,
        newPass: newPassword
    };

    console.log('Payload:', payload);

    fetch(`http://localhost:8080/TastyKing/users/update-pass/${email}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            console.log('Response Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);

            if (data.code === 0) {
                alert('Password updated successfully!');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error updating password:', error);
            alert('An error occurred while updating password!');
        });
});