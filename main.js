// main.js
document.addEventListener('DOMContentLoaded', () => {
    const foodImage = document.getElementById('food-image');
    const foodGroup = document.getElementById('food-group');
    const foodURL = document.getElementById('food-url');
    const favoriteBtn = document.getElementById('favorite-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentFood = null;

    const url = "http://localhost:8000/";
    const filename = "favs.txt";
    // Fetch a random food image from the API
    function fetchFood(category) {
        fetch(`https://foodish-api.com/api/images/${category}`)
            .then(response => response.json())
            .then(data => {
                currentFood = data.image;
                foodImage.src = currentFood;
                foodGroup.textContent = category;
                foodURL.textContent = currentFood;
                checkFavorite(currentFood);
            })
            .catch(error => console.error('Error fetching food image:', error));
    }

    // Load favorites from favs.txt
    async function loadFavorites() {
        try {
            const response = await fetch(url + filename);
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            const data = await response.text(); // The data 
            // Parse the data, ensure it defaults to an empty array if invalid or empty
            const favorites = data.trim() ? JSON.parse(data) : [];

            if (!Array.isArray(favorites)) {
                throw new Error('Favorites is not an array');
            }

            return favorites; // Return the array
        } catch (error) {
            console.error('Error loading favorites:', error);
            return []; // Return an empty array in case of error
        }
    }

    // Check if the current image is a favorite
    async function checkFavorite(imageUrl) {
        const favorites = await loadFavorites();

        // Ensure favorites is an array before calling .some()
        if (!Array.isArray(favorites)) {
            console.error('Favorites is not an array');
            return false;
        }

        const isFavorite = favorites.some(fav => fav.image === imageUrl);

        // Update favorite button icon
        favoriteBtn.className = isFavorite ? 'icon-heart-filled' : 'icon-heart-outline';
        favoriteBtn.textContent = isFavorite ? '❤️ Unlike it' : '🤍 Like it'; // Update button text
    }


    // Toggle favorite status for the current food image
    async function toggleFavorite() {
        const favorites = await loadFavorites();
        const index = favorites.findIndex(fav => fav.image === currentFood);

        if (index >= 0) {
            // Remove from favorites
            favorites.splice(index, 1);
        } else {
            // Add to favorites
            favorites.push({
                id: Date.now(),
                image: currentFood,
                category: foodGroup.textContent,
                'date-added': new Date().toLocaleDateString(),
            });
        }

        saveFavorites(favorites);
        checkFavorite(currentFood);
    }
/*
    // Save favorites to favs.txt
    function saveFavorites(favorites) {
        fetch('/api/update-favs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).catch(error => console.error('Error saving favorites:', error));
    }
    */

    // Save favorites to favs.txt (using POST with a custom header)
    function saveFavorites(favorites) {
        fetch('/api/update-favs', {
            method: 'POST', // Use POST instead of PUT
            headers: { 
                'Content-Type': 'application/json',
                'X-HTTP-Method-Override': 'PUT' // Add a custom header
            },
            body: JSON.stringify(favorites),
        }).catch(error => console.error('Error saving favorites:', error));
    }


    // Event listeners for category selection
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', () => fetchFood(radio.value));
    });

    // Event listeners for favorite and next buttons
    // Event listeners for favorite and next buttons
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(); 
        fetchFood(foodGroup.textContent); // Fetch the next image after favoriting
    });
    nextBtn.addEventListener('click', () => fetchFood(foodGroup.textContent));

    //favoriteBtn.addEventListener('click', toggleFavorite);
    //nextBtn.addEventListener('click', () => fetchFood(foodGroup.textContent));

    // Fetch the default food category on load
    fetchFood('burger');

});