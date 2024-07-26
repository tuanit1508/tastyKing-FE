document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const comboID = urlParams.get('comboId');

    if (comboID) {
        fetch(`http://localhost:8080/TastyKing/combo/getCombo/${comboID}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    const combo = data.result;
                    document.getElementById('comboTitle').innerText = combo.comboTitle;
                    document.getElementById('comboDescriptionTab').innerText = combo.comboDescription;
                    document.getElementById('openDate').innerText = new Date(combo.openDate).toLocaleDateString();
                    document.getElementById('endDate').innerText = new Date(combo.endDate).toLocaleDateString();
                    document.getElementById('newPriceText').innerText = `${combo.newPrice} VND`;
                    document.getElementById('comboImage').src = combo.comboImage;
                    document.getElementById('comboImageLink').href = combo.comboImage;

                    // Add event listener for "Add to Cart" button
                    document.getElementById('addToCartBtn').addEventListener('click', function(event) {
                        event.preventDefault();
                        addToCart(combo);
                    });
                } else {
                    console.error('Failed to fetch combo details:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching combo details:', error);
            });
    } else {
        console.error('No comboId found in URL');
    }
});

// Utility functions to handle cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function addToCart(combo) {
    // Get the existing cart from cookies
    let comboCart = JSON.parse(getCookie("comboCart") || "[]");

    // Check if the item is already in the cart
    const existingItem = comboCart.find(item => item.comboID === combo.comboID);

    if (existingItem) {
        // If it exists, increase the quantity
        existingItem.quantity += 1;
    } else {
        // If it does not exist, add it to the cart with a quantity of 1
        combo.quantity = 1;
        comboCart.push(combo);
    }

    // Save the updated cart back to the cookies
    setCookie("comboCart", JSON.stringify(comboCart), 1); // Expires in 7 days

    // Show the modal
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}
