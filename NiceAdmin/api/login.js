
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('yourUsername').value;
    const password = document.getElementById('yourPassword').value;

    const response = await fetch('http://localhost:8080/TastyKing/auth/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
    body: JSON.stringify({
    email: username,
    password: password
})
});

    const data = await response.json();

    if (response.ok && data.result.authenticated) {
    // Decode the JWT token to check the scope
    const token = data.result.token;
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.scope === 'ADMIN' || payload.scope === 'STAFF') {
    // Store the token (e.g., in localStorage) and redirect to admin page
    localStorage.setItem('token', token);
    window.location.href = 'index.html';
} else {
    // Show an error message
    document.getElementById('loginError').textContent = 'You do not have the required permissions to access this page.';
    document.getElementById('loginError').style.display = 'block';
}
} else {
    // Show an error message
    document.getElementById('loginError').textContent = 'Invalid username or password';
    document.getElementById('loginError').style.display = 'block';
}
});

