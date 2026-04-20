let movies = [];
function saveMovies(){
    localStorage.setItem('movies', JSON.stringify(movies));
}
function loadMovies(){
    const stored = localStorage.getItem('movies');
    if(stored){
        movies = JSON.parse(stored);
    }
}
function renderMovies(movieList = movies) {
    const container = document.getElementById('movie-grid');
    container.innerHTML = '';
    document.getElementById('movie-count').textContent = `${movieList.length} movie${movieList.length !== 1 ? 's' : ''} in your library`
    movieList.forEach(element => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.id= element.id;
        movieCard.innerHTML = `
            <h3>${element.title}</h3>
            <span class="genre-badge">${element.genre}</span>
            <p class="rating">⭐ ${element.rating}/10</p>
            <span class="status-badge status-${element.status.toLowerCase().replace(' ', '-')}">${element.status}</span>
            <div class="card-buttons">
                <button class="toggle-btn">Toggle Status</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        movieCard.querySelector('.delete-btn').addEventListener('click', function (){
            deleteMovie((element.id));
        })
        movieCard.querySelector('.toggle-btn').addEventListener('click',function(){
            toggleStatus((element.id));
        })

        container.appendChild(movieCard);

    });
}
document.getElementById('add-movie-form').addEventListener('submit', function(e) {
    e.preventDefault();  

    const title = document.getElementById('add-movie-title').value; 
    const genre = document.getElementById('add-movie-genre').value;
    const rating = document.getElementById('rating').value;

    if (title===''){
        alert('Please enter a Movie title')
        return;
    }

    const newMovie = {
        id: Date.now(),
        title: title,
        genre: genre,
        rating: Number(rating),
        status: 'To Watch',
        dateAdded: new Date().toISOString()
    }

    movies.push(newMovie);
    saveMovies();
    renderMovies();
    document.getElementById('add-movie-form').reset();
});
loadMovies()
renderMovies();

function deleteMovie(id) {
    
    movies = movies.filter(movie => movie.id !== id)
    saveMovies();
    renderMovies();
    
}
function toggleStatus(id) {
    
    const movie = movies.find(movie => movie.id === id)
    
    
    if (movie.status === 'To Watch') {
        movie.status = 'Watching'
    } else if (movie.status === 'Watching') {
        movie.status = 'Watched'
    } else {
        movie.status = 'To Watch'
    }

    saveMovies();
    renderMovies();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase()
    const genre = document.getElementById('filter-genre').value
    const status = document.getElementById('filter-status').value
    const sortBy = document.getElementById('sort-by').value

    let filtered = movies

    
    if (searchTerm) {
        filtered = filtered.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        )
    }

    
    if (genre) {
        filtered = filtered.filter(movie => movie.genre === genre)
    }

    

    if(status){
        filtered = filtered.filter(movie => movie.status === status)
    }
    
    if (sortBy === 'alphabetical') {
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'rating') {
        filtered = filtered.sort((a, b) => b.rating - a.rating)
    } else {
        
        filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    }

    renderMovies(filtered)
}
document.getElementById('search-input').addEventListener('input', applyFilters)
document.getElementById('filter-genre').addEventListener('change', applyFilters)
document.getElementById('filter-status').addEventListener('change', applyFilters)
document.getElementById('sort-by').addEventListener('change', applyFilters)