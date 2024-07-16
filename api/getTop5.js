document.addEventListener('DOMContentLoaded', function() {
    // Array of image URLs
    const imageUrls = [
        "https://www.iconarchive.com/download/i59020/hopstarter/superhero-avatar/Avengers-Black-Widow.ico",
        "https://lh4.googleusercontent.com/proxy/Chu2HhloGQYgKuAJZ-Dj3alsaMYEG-1qb_KAepzzDqNOW7vuFlyNlQT2DPa8J25_8bZK5EAxj_AAqr0IKg0a-uSCoy5ENo-04HG-_Ov_p7SFJ9MD7Tw1zNBgKDJG3dkIh5o",
        "https://icons.veryicon.com/png/Avatar/Avengers%20Superhero%20Avatar/Avengers%20Thor.png",
        "https://cdn.pixabay.com/photo/2023/02/01/09/25/cristiano-ronaldo-7760045_640.png",
        "https://w1.pngwing.com/pngs/299/181/png-transparent-cristiano-ronaldo-2018-world-cup-football-smiley-neymar-green-yellow-cartoon.png"
    ];

    // Function to get a random image URL
    function getRandomImageUrl() {
        return imageUrls[Math.floor(Math.random() * imageUrls.length)];
    }

    fetch('http://localhost:8080/TastyKing/point/top5')
        .then(response => response.json())
        .then(data => {
            const rankingsContainer = document.getElementById('reward-point-rankings');
            rankingsContainer.innerHTML = '';
            data.forEach(user => {
                const userCard = `
                            <div class="d-flex mb-3">
                                <a href="#" class="me-3">
                                    <img src="${getRandomImageUrl()}" style="min-width: 96px; height: 96px;" class="img-md img-thumbnail" />
                                </a>
                                <div class="info">
                                    <a href="#" class="nav-link mb-1">
                                        ${user.user.email} <br />
                                    </a>
                                    <strong class="text-dark">${user.balance} points</strong>
                                </div>
                            </div>
                        `;
                rankingsContainer.innerHTML += userCard;
            });
        })
        .catch(error => console.error('Error fetching reward points:', error));
});