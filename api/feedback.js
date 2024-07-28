document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = localStorage.getItem('loggedInUserEmail');
    const urlParams = new URLSearchParams(window.location.search);
    const orderID = urlParams.get('orderID');
    const testimonial = document.getElementById('testimonial').value;
    const satisfaction = document.querySelector('input[name="satisfaction"]:checked').value;
    const consent = document.getElementById('consent').checked;

    if (!consent) {
        alert('You must agree to the terms and conditions.');
        return;
    }

    const feedbackRequest = {
        user: {
            email: email
        },
        order: {
            orderID: orderID
        },
        content: testimonial,
        emotion: satisfaction
    };
const authToken =localStorage.getItem('authToken');
    fetch('http://localhost:8080/TastyKing/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(feedbackRequest)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to submit feedback.');
        });
});