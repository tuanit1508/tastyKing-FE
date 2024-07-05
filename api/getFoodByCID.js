document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryID = urlParams.get('categoryID');

    if (categoryID) {
        // Fetch food items by categoryID
        fetch(`http://localhost:8080/TastyKing/food/${categoryID}`)
            .then(response => response.json())
            .then(data => {
                const foodItems = data.result;
                const foodContainer = document.getElementById("food-items");


                // Clear existing items
                foodContainer.innerHTML = "";

                // Populate food items
                foodItems.forEach(food => {
                    const foodCard = document.createElement("div");
                    foodCard.classList.add("col-lg-4", "col-md-6", "mb-4");
                    foodCard.innerHTML = `
                                <div class="d-flex align-items-center">
                        <img class="flex-shrink-0 img-fluid rounded" src="${food.foodImage}" alt="${food.foodName}" style="width: 80px;">
                        <div class="w-100 d-flex flex-column text-start ps-4">
                            <h5 class="d-flex justify-content-between border-bottom pb-2">
                                <a href="food-detail.html?foodID=${food.foodID}"><span>${food.foodName}</span></a>
                                <span class="text-primary">$${food.foodPrice}</span>
                            </h5>
                            <small class="fst-italic">${food.description}</small>
                        </div>
                    </div>
                            `;
                    foodContainer.appendChild(foodCard);
                });
            })
            .catch(error => console.error("Error fetching food items:", error));
    } else {
        console.error("No categoryID found in URL");
    }
});