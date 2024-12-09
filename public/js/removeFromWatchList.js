
document.querySelectorAll('#removeFromWatchList').forEach(item => {
  item.addEventListener('click', e => {
    //handle click
    let movie_id = e.currentTarget.dataset.movieId
    console.log(movie_id)
    
    // POST request to add movie to watchlist
    fetch('/removeFromWatchList', {
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
        location.reload()
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  });
});