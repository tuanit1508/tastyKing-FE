document.addEventListener('DOMContentLoaded', function() {
    const apiEndpoint = 'http://localhost:8080/TastyKing/review'; // Replace with your actual API endpoint
    const bearerToken = localStorage.getItem('token'); // Replace with your actual bearer token

    function fetchReviews() {
        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 0) {
                    displayReviews(data.result);
                } else {
                    console.error('Error in API response: ', data);
                }
            })
            .catch(error => {
                console.error('Error fetching reviews: ', error);
            });
    }

    function displayReviews(reviews) {
        const reviewTableBody = document.getElementById('reviewTableBody');
        reviewTableBody.innerHTML = '';

        reviews.forEach(review => {
            const reviewRow = document.createElement('tr');

            reviewRow.innerHTML = `
                <td>${review.reviewId}</td>
                <td>${review.user.fullName}</td>
                <td>${review.rating}</td>
                <td>${review.foodName}</td>
                <td>${new Date(review.reviewDate).toLocaleString()}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewReview(${review.reviewId})">View</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteReview(${review.reviewId})">Delete</button>
                </td>
            `;

            reviewTableBody.appendChild(reviewRow);
        });
    }

    window.viewReview = function(reviewId) {
        fetch(`${apiEndpoint}/${reviewId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 0) {
                    const review = data.result.reviewText;
                    document.getElementById('reviewText').value = review;
                    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
                    reviewModal.show();
                } else {
                    console.error('Error in API response: ', data);
                }
            })
            .catch(error => {
                console.error('Error fetching review: ', error);
            });
    };

    window.deleteReview = function(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            fetch(`${apiEndpoint}/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.code === 0) {
                        alert(data.result);
                        fetchReviews(); // Refresh the reviews list
                    } else {
                        console.error('Error in API response: ', data);
                    }
                })
                .catch(error => {
                    console.error('Error deleting review: ', error);
                });
        }
    };

    // Fetch and display reviews on page load
    fetchReviews();
});
