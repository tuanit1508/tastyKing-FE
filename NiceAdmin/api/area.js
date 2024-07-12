document.addEventListener("DOMContentLoaded", function() {
    // Get a reference to the button that triggers the create modal
    var showModalBtn = document.getElementById('showModalBtn');

    // Add click event listener to the button
    showModalBtn.addEventListener('click', function () {
        // Create a new modal object using bootstrap.modal
        var myModal = new bootstrap.Modal(document.getElementById('areaModal'));
        // Show the modal
        myModal.show();
    });
})