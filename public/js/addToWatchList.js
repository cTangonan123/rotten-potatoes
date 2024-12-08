// Purpose: Add movie to watchlist based on user input

document.querySelectorAll('#addToWatchList').forEach(item => {
  item.addEventListener('click', e => {
    //handle click
    let movie_id = e.currentTarget.dataset.movieId
    console.log(movie_id)
    
    // POST request to add movie to watchlist
    fetch('/addToWatchList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movie_id: movie_id })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert(data.message)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  });
});