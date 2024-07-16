document.addEventListener("DOMContentLoaded", function() {
    // Extract foodID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const foodID = urlParams.get('foodID');

    if (foodID) {
        // Fetch food details by foodID
        fetch(`http://localhost:8080/TastyKing/food/getFood/${foodID}`)
            .then(response => response.json())
            .then(data => {
                const food = data.result;
                // Update the page content with the fetched food details
                document.querySelector(".title").innerText = food.foodName;
                document.querySelector(".h5").innerText = `${food.foodPrice}.000VND`;
                document.querySelector(".per").innerText = `/per ${food.unit}`;
                document.querySelector("p").innerText = food.description;
                document.querySelector(".fit").src = food.foodImage;

                // Add event listener for "Add to Cart" button
                document.querySelector(".btn-primary").addEventListener("click", function() {
                    addToCart(food);
                });
            })
            .catch(error => console.error("Error fetching food details:", error));
    } else {
        console.error("No foodID found in URL");
    }
});

function addToCart(food) {
    // Get the existing cart from cookies
    let cart = JSON.parse(getCookie("cart") || "[]");

    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.foodID === food.foodID);

    if (existingItem) {
        // If it exists, increase the quantity
        existingItem.quantity += 1;
    } else {
        // If it does not exist, add it to the cart with a quantity of 1
        food.quantity = 1;
        cart.push(food);
    }

    // Save the updated cart back to the cookies
    setCookie("cart", JSON.stringify(cart), 7); // Expires in 7 days

    // Show the modal
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
