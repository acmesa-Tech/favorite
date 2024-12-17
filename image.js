// image.js
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); 1 
    const url = "http://localhost:8000/";
    const filename = "favs.txt";

    fetch(url + filename)
        .then(response => response.json())
        .then(favorites => {
            const favorite = favorites.find(fav => fav.id == id);
            if (favorite) {
                document.getElementById('food-image').src = favorite.image;
                document.getElementById('group').textContent = favorite.category;
                document.getElementById('url').textContent = favorite.image;
                document.getElementById('date').textContent = favorite['date-added'];

                document.getElementById('favorite-btn').addEventListener('click', () => {
                    unfavorite(id);
                });

                document.getElementById('back-btn').addEventListener('click', () => {
                    window.history.back();
                });
            }
        });

        function unfavorite(id) {
            fetch(url + filename)
                .then(response => response.json())
                .then(favorites => {
                    const updated = favorites.filter(fav => fav.id != id);
                    saveFavorites(updated);
                });
        }
        
        function saveFavorites(favorites) {
            fetch('/api/update-favs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(favorites),
            }).then(() => window.location.href = 'gallery.html'); // Redirect to gallery after unfavoriting
        }

        /*
    function unfavorite(id) {
        fetch(url + filename)
            .then(response => response.json())
            .then(favorites => {
                const updated = favorites.filter(fav => fav.id != id);
                saveFavorites(updated);
            });
    }

    function saveFavorites(favorites) {
        fetch('/api/update-favs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favorites),
        }).then(() => window.location.href = 'gallery.html');
    }*/


});