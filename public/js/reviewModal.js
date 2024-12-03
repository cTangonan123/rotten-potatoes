document.querySelectorAll('#addToWatchList').forEach(item => {
  item.addEventListener('click', e => {
    //handle click
    let movie_id = e.currentTarget.dataset.movieId
    console.log(movie_id)

    fetch('/watchlist', {
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

// instantiation of bootstrap review modal
const reviewModal = new bootstrap.Modal(document.querySelector('#reviewModal'));

// specifically for the write review buttons from results
document.querySelectorAll('#writeReview').forEach(item => {
  item.addEventListener('click', e => {
    let movie_id = e.currentTarget.dataset.movieId
    reviewModal.show()
    console.log(movie_id)
    document.querySelector("#rMovieId").value = movie_id
    document.querySelector("#rUserId").value = 1 // hardcoded for now



  }); //handle click
});

// for the save button on the review modal
document.querySelector("#reviewModal").addEventListener('submit', async(e) => {
  e.preventDefault()
  console.log("clicked")
  // get all values
  
  let el_movie_id = document.querySelector("#rMovieId")
  let el_user_id = document.querySelector("#rUserId")
  let el_title = document.querySelector("#rTitle")
  let el_rating = document.querySelector("#rRating")
  let el_review = document.querySelector("#rReview")
  if (el_rating.value == "" || el_review.value == "" || el_title.value == "" || el_rating.value > 10 || el_rating.value < 0) {
    alert("Please fill out all fields")
    return
  }

  // send fetch request
  // TODO: add post request /submitReview to index.mjs
  // TODO: add toasts for success
  await fetch('/submitReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      movie_id: el_movie_id.value, 
      user_id: el_user_id.value, 
      title: el_title.value, 
      rating: el_rating.value, 
      review: el_review.value 
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      el_movie_id.value = ""
      el_title.value = ""
      el_rating.value = ""
      el_review.value = ""
      alert(data.message)
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Error: " + error)
    });
  
  // close


  reviewModal.hide()

});