
    document.addEventListener("DOMContentLoaded", function() {
    const foodContainer = document.getElementById("food-items");

    fetch("http://localhost:8080/TastyKing/food")
    .then(response => response.json())
    .then(data => {
    const foods = data.result;
    foods.forEach(food => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("col-lg-6");
    foodItem.innerHTML = `
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
    foodContainer.appendChild(foodItem);
});
})
    .catch(error => console.error("Error fetching food data:", error));
});


///////////////////////////////////////////////////////////
