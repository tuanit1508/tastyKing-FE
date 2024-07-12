document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('#rating .fa-star');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function () {
            rating = this.getAttribute('data-value');
            updateStars(rating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    document.getElementById('reviewForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const message = document.getElementById('message').value;
        const email = localStorage.getItem('loggedInUserEmail');
        const token = localStorage.getItem('authToken');
        const urlParams = new URLSearchParams(window.location.search);
        const foodID = urlParams.get('foodID');

        if (!email || !token || !foodID) {
            alert('Missing necessary information.');
            return;
        }

        const reviewRequest = {
            user: {
                email: email
            },
            food: {
                foodID: foodID
            },
            reviewText: message,
            rating: rating
        };

        fetch('http://localhost:8080/TastyKing/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(reviewRequest)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert('Review submitted successfully!');
                    document.getElementById('reviewForm').reset();
                    updateStars(0);
                    loadReviews(foodID); // Call loadReviews after a successful review submission
                } else {
                    alert('Failed to submit review: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the review.');
            });
    });

    function loadReviews(foodID) {
        $.ajax({
            url: `http://localhost:8080/TastyKing/food/getReview/${foodID}`,
            method: 'GET',
            success: function(response) {
                if (response.code === 0) {
                    displayReviews(response.result);
                } else {
                    console.error('Failed to fetch reviews');
                }
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function displayReviews(reviews) {
        const reviewList = $('#review-list');

        // Clear the existing reviews
        reviewList.empty();

        // Append each review to the review list
        reviews.forEach(review => {
            const reviewDate = moment(review.reviewDate).format('MMMM Do YYYY');
            const reviewItem = `
                <li>
                    <div class="d-flex">
                        <div class="left">
                            <span>
                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="profile-pict-img img-fluid" alt="" />
                            </span>
                        </div>
                        <div class="right">
                            <h4>
                                ${review.user.email}
                                <span class="gig-rating text-body-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" width="15" height="15">
                                        <path
                                            fill="currentColor"
                                            d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z"
                                        ></path>
                                    </svg>
                                    ${review.rating}
                                </span>
                            </h4>
                            <div class="country d-flex align-items-center">
                                <span id="reviewDate">
                                    ${reviewDate}
                                </span>
                            </div>
                            <div class="review-description">
                                <p>
                                    ${review.reviewText}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            reviewList.append(reviewItem);
        });
    }

    // Ensure initial reviews are loaded
    const foodID = getQueryParameter('foodID');
    if (foodID) {
        loadReviews(foodID);
    } else {
        console.error('foodID not found in the URL');
    }
});

// Function to get query parameter value by name
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
