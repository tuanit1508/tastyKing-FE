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
                    document.getElementById('newPrice').innerText = `${combo.newPrice}.000VND`;
                    document.getElementById('comboDescription').innerText = combo.comboDescription;
                    document.getElementById('openDate').innerText = new Date(combo.openDate).toLocaleDateString();
                    document.getElementById('endDate').innerText = new Date(combo.endDate).toLocaleDateString();
                    document.getElementById('newPriceText').innerText = `${combo.newPrice}.000VND`;
                    document.getElementById('comboImage').src = combo.comboImage;
                    document.getElementById('comboImageLink').href = combo.comboImage;

                    // Add to Cart Button Handler
                    document.getElementById('addToCartBtn').addEventListener('click', function() {
                        fetch(`http://localhost:8080/TastyKing/combo/getComboFood/${comboID}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.code === 0) {
                                    let cartItems = JSON.parse(getCookie('cartItems') || '[]');
                                    cartItems.push(...data.result);
                                    setCookie('cartItems', JSON.stringify(cartItems), 7); // Store for 7 days
                                    window.location.href = 'cart.html';
                                } else {
                                    console.error('Failed to fetch combo food items:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching combo food items:', error);
                            });
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
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}
