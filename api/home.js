document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        localStorage.setItem('authToken', token);
    }

    const authButtons = document.getElementById('auth-buttons');
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
        const decodedToken = jwt_decode(storedToken);
        const username = decodedToken.sub;
        localStorage.setItem('loggedInUserEmail', username)
        // Extract the "sub" field for the username
        console.log(token);
        authButtons.innerHTML = `
            <div class="nav-item dropdown">
                <a href="#" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="fa fa-user"></i>
                </a>
                <div class="dropdown-menu m-0">
                    <div class="dropdown-item" id="username">${username}</div>
                    <a href="viewProfile.html" class="dropdown-item">View Profile</a>
                     <a href="updatePass.html" class="dropdown-item">Security</a>
                    <a href="viewOrder.html" class="dropdown-item">View Order</a>
                    <a href="voucherManage.html" class="dropdown-item">Voucher Manage</a>
                    <a href="#" id="logout" class="dropdown-item">Logout</a>
                </div>
            </div>
            <div class="nav-item">
                <a href="cart.html" class="btn btn-outline-light">
                    <i class="fa fa-shopping-cart"></i>
                </a>
            </div>
        `;

        document.getElementById('logout').addEventListener('click', function() {
            // List of local storage items to remove
            const itemsToRemove = [
                'loggedInUserEmail',
                'authToken',
                'checkoutData',
                'orderData',
                'email',
                'selectedTableID',
                'tableID',
                'token',
                'total',
                'voucherId'// Assuming this is a different token
            ];

            // Remove items from local storage
            itemsToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            // Utility function to delete cookies
            function deleteCookie(name) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }

            // List of cookies to delete
            const cookiesToDelete = [
                'comboData',
                'cart',
                'checkoutData',
                'orderData',
                'comboCart'
            ];

            // Remove cookies
            cookiesToDelete.forEach(cookie => {
                deleteCookie(cookie);
            });

            // Redirect to index.html
            window.location.href = 'index.html';
        });
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-primary me-2">Login</a>
            <a href="register.html" class="btn btn-secondary me-2">Register</a>
        `;
    }
});
