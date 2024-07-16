document.addEventListener('DOMContentLoaded', function() {
    // Check and delete reservationData cookie if it exists
    if (getCookie("reservationData")) {
        deleteCookie("reservationData");
    }

    document.getElementById("reservationForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Capture form data
        const reservationData = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            datetime: document.getElementById("datetime").value,
            people: document.getElementById("people").value,
            message: document.getElementById("note").value
        };

        // Validate "No of People"
        if (parseInt(reservationData.people) > 60) {
            document.getElementById("peopleError").innerText = "We only accept reservations for up to 60 people.";
            return;
        } else {
            document.getElementById("peopleError").innerText = "";
        }

        // Validate the reservation date and time
        const inputDate = new Date(reservationData.datetime);
        const currentDate = new Date();
        if (inputDate <= currentDate) {
            document.getElementById("datetimeError").innerText = "The reservation date and time must be in the future.";
            return;
        } else {
            document.getElementById("datetimeError").innerText = "";
        }

        // Save reservation data to cookies
        setCookie("reservationData", JSON.stringify(reservationData), 0.01); // 0.01 days expiration (approximately 14 minutes)
        window.location.href = 'cart.html';
    });

    // Utility functions for setting and getting cookies
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
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

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
});