// instantiation of bootstrap review modal
// const reviewModal = new bootstrap.Modal(document.querySelector('#reviewModal'));

document.querySelectorAll('#btnReviewUpdate').forEach(item => {
  item.addEventListener('click', async function(e) {
    let review_id = e.currentTarget.dataset.reviewId
    await fetch(`/getReview/${review_id}`)
      .then(res => res.json())
      .then(review => {
        // update the hidden input form values with the movie_id and user_id
        document.querySelector("#rMovieId").value = review.movie_id
        document.querySelector("#rUserId").value = review.user_id
        document.querySelector("#rTitle").value = review.title
        document.querySelector("#rRating").value = review.rating
        document.querySelector("#rReview").value = review.review

        reviewModal.show()
      })
  }); 
});

document.querySelectorAll('#btnReviewDelete').forEach(item => {
  item.addEventListener('click', async function(e) {
    e.preventDefault();
    let review_id = e.currentTarget.dataset.reviewId
    await fetch(`/deleteReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        review_id: review_id
      })
    }).then(res => res.json())
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