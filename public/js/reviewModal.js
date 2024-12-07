// Purpose: To handle the review modal and submission of reviews

// instantiation of bootstrap review modal
const reviewModal = new bootstrap.Modal(document.querySelector('#reviewModal'));

// specifically for the write review buttons from results
document.querySelectorAll('#writeReview').forEach(item => {
  item.addEventListener('click', e => {
    let movie_id = e.currentTarget.dataset.movieId
    reviewModal.show()
    console.log(movie_id)

    // update the hidden input form values with the movie_id and user_id
    document.querySelector("#rMovieId").value = movie_id
    // document.querySelector("#rUserId").value = 1 // hardcoded for now, TODO: change to session user id
  }); 
});

// for the submission of the review form
document.querySelector("#reviewModal").addEventListener('submit', async(e) => {
  e.preventDefault()
  console.log("clicked")
  // get all values from the form
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
      // clear the form
      // TODO: add toast message indicating that the review was submitted
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
  location.reload()

});