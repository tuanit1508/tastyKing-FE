    document.addEventListener("DOMContentLoaded", function() {
    // Fetch all categories
    fetch("http://localhost:8080/TastyKing/category")
        .then(response => response.json())
        .then(data => {
            const categories = data.result;
            const dropdownMenu = document.querySelector(".dropdown-menu");

            // Clear existing items
            dropdownMenu.innerHTML = "";

            // Populate dropdown with categories
            categories.forEach(category => {
                const categoryItem = document.createElement("a");
                categoryItem.classList.add("dropdown-item");
                categoryItem.href = `category.html?categoryID=${category.categoryID}`;
                categoryItem.innerText = category.categoryName;
                dropdownMenu.appendChild(categoryItem);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
});

