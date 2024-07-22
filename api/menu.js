document.addEventListener("DOMContentLoaded", function() {
    const foodContainer = document.getElementById("food-items");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let foods = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    function renderPage(page) {
        foodContainer.innerHTML = "";
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const foodsToDisplay = foods.slice(start, end);

        foodsToDisplay.forEach(food => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("col-lg-6");
            foodItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img class="flex-shrink-0 img-fluid rounded" src="${food.foodImage}" alt="${food.foodName}" style="width: 80px;">
                    <div class="w-100 d-flex flex-column text-start ps-4">
                        <h5 class="d-flex justify-content-between border-bottom pb-2">
                            <a href="food-detail.html?foodID=${food.foodID}"><span>${food.foodName}</span></a>
                            <span class="text-primary">${food.foodPrice}VND</span>
                        </h5>
                        <small class="fst-italic">${food.description}</small>
                    </div>
                </div>
            `;
            foodContainer.appendChild(foodItem);
        });
    }

    function updateButtons() {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * itemsPerPage >= foods.length;
    }

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            updateButtons();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < foods.length) {
            currentPage++;
            renderPage(currentPage);
            updateButtons();
        }
    });

    fetch("http://localhost:8080/TastyKing/food")
        .then(response => response.json())
        .then(data => {
            foods = data.result;
            renderPage(currentPage);
            updateButtons();
        })
        .catch(error => console.error("Error fetching food data:", error));
});