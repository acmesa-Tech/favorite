// gallery.js
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const url = "http://localhost:8000/";
    const filename = "favs.txt";

    async function loadFavorites(category) {
        try {
            const response = await fetch(url + filename);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const text = await response.text(); // Retrieve the file as plain text
            try {
                const favorites = JSON.parse(text); // Parse the JSON text
                const filteredFavorites = category === 'all' ? favorites : favorites.filter(fav => fav.category === category);
                displayFavorites(filteredFavorites); // Pass the filtered favorites to be displayed
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                document.getElementById('gallery-container').innerHTML = "<p>Error parsing favorites. Please check the file format.</p>";
            }
        } catch (fetchError) {
            console.error("Error fetching favorites:", fetchError);
            document.getElementById('gallery-container').innerHTML = "<p>Error loading favorites. Please try again later.</p>";
        }
    }


    function displayFavorites(favorites) {
        galleryContainer.innerHTML = ''; // Clear existing content

        if (favorites.length === 0) {
            galleryContainer.innerHTML = '<p>No favorites found for this category.</p>';
            return;
        }

        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${fav.image}" alt="${fav.category}">
                <p>Category: ${fav.category}</p>
                <p class="card-smallLetter">URL: ${fav['image']}</p>
                <p class="card-mediumLetter">Date added: ${fav['date-added']}</p>
                <div class="card-actions">
                    <button id="favorite-btn" class="icon-heart-filled" data-id="${fav.id}">❤️ Unlike it</button>
                    <button id="select-btn" class="icon-open" data-id="${fav.id}"></button>
                </div>
            `;
            galleryContainer.appendChild(card);

            card.querySelector('.icon-heart-filled').addEventListener('click', () => unfavorite(fav.id));
            card.querySelector('.icon-open').addEventListener('click', () => openImage(fav.id));
        });
    }

    function unfavorite(id) {
        fetch(url + filename)
            .then(response => response.json())
            .then(favorites => {
                const updated = favorites.filter(fav => fav.id !== id);
                saveFavorites(updated);
    
                // Remove the card from the gallery
                const cardToRemove = document.querySelector(`.card [data-id="${id}"]`).closest('.card');
                if (cardToRemove) {
                    galleryContainer.removeChild(cardToRemove);
                }
            });
    }

    /*
    function unfavorite(id) {
        fetch(url + filename)
            .then(response => response.json())
            .then(favorites => {
                const updated = favorites.filter(fav => fav.id !== id);
                saveFavorites(updated);
            });
    }
     */

    function openImage(id) {
        window.location.href = `image.html?id=${id}`;
    }

    function saveFavorites(favorites) {
        fetch('/api/update-favs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).then(() => loadFavorites(document.querySelector('input[name="category"]:checked').value));
    }

    categoryRadios.forEach(radio => {
        radio.addEventListener('change', () => loadFavorites(radio.value));
    });

    loadFavorites('all'); // Default category
});