document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/TastyKing/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Please check your email or password');
            }
            return response.json();
        })
        .then(data => {
            // Handle success response
            const authenticate = data.result.authenticated;
            if (authenticate) {
                localStorage.setItem('authToken', data.result.token);
                window.location.href = 'index.html';
            } else {
                // Handle the case where authentication fails
                alert('Authentication failed. Please check your credentials.');
            }
        })
        .catch(error => {
            // Handle error response
            const errorAlert = document.getElementById('errorAlert');
            const errorMessage = error.message || 'An error occurred. Please try again.';
            errorAlert.textContent = errorMessage;
            errorAlert.style.display = 'block';
        });
});

// window.onload = function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     if (token) {
//         $('#loginSuccessModal').modal('show');
//         localStorage.setItem('authToken', token);
//         console.log(token);
//         document.getElementById('proceedBtn').addEventListener('click', function() {
//             window.location.href = 'index.html';
//         });
//     }
// };
