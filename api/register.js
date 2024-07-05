document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/TastyKing/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            fullName: fullname,
            phone: phone,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            // Handle success response
            localStorage.setItem('email', email);
            console.log(data);
            alert(data.result);
            window.location.href = 'verify-account.html';
        })
        .catch(error => {
            // Handle error response
            console.error(error);
            const errorAlert = document.getElementById('errorAlert');
            errorAlert.textContent = error.message || 'An error occurred. Please try again.';
            errorAlert.style.display = 'block';
        });
});
