document.addEventListener('DOMContentLoaded', function() {
    // Get token from localStorage
    const token = localStorage.getItem('authToken'); // Adjust the key name according to your actual localStorage key

    // Check if token is available
    if (!token) {
        alert('Token not found!');
        return;
    }

    // Decode the JWT token to get the email
    const decodedToken = jwt_decode(token);
    const email = decodedToken.sub;

    // API call to get user information
    fetch('http://localhost:8080/TastyKing/users/myInfo', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const user = data.result;

                // Populate the form with user data
                document.getElementById('username-display').textContent = user.userName;
                document.getElementById('email-display').textContent = user.email;
                document.getElementById('input-username').value = user.userName;
                document.getElementById('input-email').value = user.email;
                document.getElementById('input-fullname').value = user.fullName;
                document.getElementById('input-phone').value = user.phone;
            } else {
                alert('Failed to retrieve user information!');
            }
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
            alert('An error occurred while fetching user information!');
        });

    // Add event listener to the Save Profile button
    document.getElementById('save-profile-button').addEventListener('click', function () {
        // Get the updated values from the form
        const updatedUser = {
            userName: document.getElementById('input-username').value,
            fullName: document.getElementById('input-fullname').value,

            phone: document.getElementById('input-phone').value
        };

        // API call to update user information
        fetch(`http://localhost:8080/TastyKing/users/update/${email}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    const user = data.result;

                    // Update the display with the new user data
                    document.getElementById('username-display').textContent = user.userName;
                    document.getElementById('email-display').textContent = user.email;
                    document.getElementById('input-username').value = user.userName;
                    document.getElementById('input-email').value = user.email;
                    document.getElementById('input-fullname').value = user.fullName;
                    document.getElementById('input-phone').value = user.phone;

                    alert('Profile updated successfully!');
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('An error occurred while updating profile!');
            });
    });
    })
