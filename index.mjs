import express from 'express';                    // Import express module
import 'dotenv/config';                           // Import dotenv module
import mysql from 'mysql2/promise';               // Import mysql module

const app = express();

app.set('port', process.env.PORT || 3000);        // Set the port
app.set('view engine', 'ejs');                    // Set the view engine

app.use(express.static('public'));                // Serve static files from the public folder

app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(express.json());                          // Parse JSON bodies

// Setup MySQL connection
const pool = mysql.createPool({                   
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true
});

const conn = await pool.getConnection();

/* GET Requests */

/* VIEW Specific GET Requests */

// skeleton code for initial page, replace with login handling
app.get('/', async (req, res) => {
  let sql = 'SELECT * FROM user';                
  const [rows] = await conn.execute(sql);         
  for (let row of rows) {
    console.log(row);                             
  }
  res.render('index', {"greeting": "Hello, World!", "port": process.env.PORT});
});

app.get('/search', getUserId, getWatchListForUser, getPopularMovies, async(req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  let watchlist = req.body.user_watchlist;
  let popularMovies = req.body.popularMovies;

  res.render('searchPage', { "user_id": user_id, "watchlist": watchlist , "popularMovies": popularMovies });
});

// handles the results of a search query
app.get('/search/results', getUserId, getWatchListForUser, getReviewsForUser, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  let watchlist = req.body.user_watchlist;
  let reviews = req.body.user_reviews;
  let searchQuery = req.query.searchQuery;
  let searchQueryURL = searchQuery.replace(/ /g, '%20');

  let setWatched = new Set(watchlist.map(movie => movie.movie_id));
  let setReviewed = new Map(reviews.map(review => [review.movie_id, review.id]));

  // https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1

  // console.log("this is the user id: " + user_id) // for testing
  // console.log("this is the watchlist:*********")
  // for (let movie of watchlist) {
  //   console.log(movie)
  // }

  // let user_id = 2; // hard-coded for now, TODO: change to session user_id
  // const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchQueryURL}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let response = await fetch(url, options);
  let data = await response.json();
    
  res.render('searchResults', { "shows": data.results, "user_id": user_id, "watchlist": watchlist, "watched": setWatched, "reviewed": setReviewed });
});

// handle form submission of specific movie submission
app.get('/description', getUserId, getWatchListForUser, getReviewsForUser, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  let watchlist = req.body.user_watchlist;
  let reviews = req.body.user_reviews;
  let movie_id = req.query.id;

  let setWatched = new Set(watchlist.map(movie => movie.movie_id));
  let setReviewed = new Map(reviews.map(review => [review.movie_id, review.id]));
  
  const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let response = await fetch(url, options);
  let data = await response.json();
  console.log(data);

  let sql = `
    SELECT r.user_id, r.movie_id, r.title, r.rating, r.review, u.user_name 
    FROM reviews r
    LEFT JOIN user u ON r.user_id = u.id
    WHERE movie_id = ?`;
  const [rows] = await conn.query(sql, [movie_id]);
  console.log(rows);

  res.render('movieDescription', { "show": data, "reviews": rows, "user_id": user_id, "watchlist": watchlist, "watched": setWatched, "reviewed": setReviewed });
});

// handle user profile page
app.get('/userProfile', getUserId, getWatchListForUser, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  let watchlist = req.body.user_watchlist;

  let sql = `
    SELECT m.id as movie_id, m.title as movie_title, m.poster_path, r.id as review_id, r.title as review_title, r.rating, review
    FROM reviews r
    LEFT JOIN movie m ON r.movie_id = m.id
    WHERE user_id = ?`;
  const [rows] = await conn.query(sql, [user_id]);
  console.log(rows);

  res.render('userProfile', { "reviews": rows, "user_id": user_id, "watchlist": watchlist });
});

/* API Specific(associated with client-side js) GET Requests */

app.get('/getReview/:id', async (req, res) => {
  let review_id = req.params.id;
  let sql = `
    SELECT * 
    FROM reviews 
    WHERE id = ?`;
  const [rows] = await conn.query(sql, [review_id]);
  console.log(rows[0]);
  res.json(rows[0]);
});


/* POST Requests */

// Handle adding watchlist form submission
app.post('/addToWatchList', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  // console.log(req.body.movie_id);
  const movie_id = req.body.movie_id;
  // check if movie is already in database
  // if not, add it
  let sql = `SELECT * FROM movie WHERE id = ?`;
  const [rows] = await conn.query(sql, [movie_id]);
  
  
  // where we add the movie to the database if it isn't already in there
  if (rows.length === 0) {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let result = await fetch(url, options)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
      
    }) 
    .catch(err => console.error(err));

    sql = `
      INSERT INTO movie (
      id, title, release_date, overview, backdrop_path, poster_path, vote_average
      ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
      )`;
    await conn.query(sql, [result.id, result.title, result.release_date, result.overview, result.backdrop_path, result.poster_path, result.vote_average]);
  }

  // add the movie to the watchlist
  
  let sql2 = `INSERT INTO watchlist (movie_id, user_id) VALUES (?, ?)`;
  await conn.query(sql2, [movie_id, user_id]); 

  res.json({ message: 'Movie added to your watchlist' });
});

app.post('/removeFromWatchList', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  const movie_id = req.body.movie_id;

  let sql = `
    DELETE FROM watchlist 
    WHERE movie_id = ? AND user_id = ?`;
  await conn.query(sql, [movie_id, user_id]);

  res.json({ message: 'Movie removed from your watchlist' });
})

// Handle review form submission
app.post('/submitReview', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  
  // getting the values from the form
  const { movie_id, title, rating, review } = req.body;

  // check if movie exists in database movie table,
  let sqlMovie = `SELECT * FROM movie WHERE id = ?`;
  const [rows] = await conn.query(sqlMovie, [movie_id]);

  // if movie is not in database, pull from TMDB API and insert into database
  if (rows.length === 0) {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
      }
    };

    let result = await fetch(url, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return data;
        
      }) // where to do stuff
      .catch(err => console.error(err));
    
    sqlMovie = `
      INSERT INTO movie (
      id, title, release_date, overview, backdrop_path, poster_path, vote_average
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
    )`;
    await conn.query(sqlMovie, [result.id, result.title, result.release_date, result.overview, result.backdrop_path, result.poster_path, result.vote_average]);
  }
  
  // check database if user has already submitted a review for this movie
  let sqlReviewCheck = `
    SELECT count(*) as count 
    FROM reviews 
    WHERE movie_id = ? AND user_id = ?`;

  const [countReview] = await conn.query(sqlReviewCheck, [movie_id, user_id]);

  // if user has already submitted a review, update the review
  if (countReview[0].count > 0) {
    let sqlReviewUpdate = `
      UPDATE reviews 
      SET title = ?, rating = ?, review = ? 
      WHERE movie_id = ? AND user_id = ?`;

    await conn.query(sqlReviewUpdate, [title, rating, review, movie_id, user_id])
  // if user has not submitted a review, insert a new review
  } else {
    let sqlReview = `
      INSERT INTO reviews (
      movie_id, user_id, title, rating, review
      ) VALUES (
      ?, ?, ?, ?, ?)`;

    await conn.query(sqlReview, [movie_id, user_id, title, rating, review])
      .then(() => console.log('Review submitted!'))
      
  }
    
  // inserting movie to the watchlist when review is submitted.
  let sqlWatchListCheck = `
    SELECT count(*) as count 
    FROM watchlist 
    WHERE movie_id = ? AND user_id = ?`;
  
  const [countWatchList] = await conn.query(sqlWatchListCheck, [movie_id, user_id]);
  // if movie is not in watchlist, add it
  if (countWatchList[0].count === 0) {
    let sqlWatchList = `
      INSERT INTO watchlist (
      movie_id, user_id
      ) VALUES (
      ?, ?)`;

    await conn.query(sqlWatchList, [movie_id, user_id])
      .then(() => console.log('Movie added to watchlist!'))
      
  }
  
  res.json({ message: 'Database has been updated' });
});

app.post('/deleteReview', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  const review_id = req.body.review_id;

  let sql = `
    DELETE FROM reviews 
    WHERE id = ?`;
  await conn.query(sql, [review_id]);

  res.json({ message: 'Review deleted' });
});

/** MIDDLEWARE Functions **/
// middleware to get userId from session
async function getUserId(req, res, next) {
  // get user_id from session
  let user_id = 1; // hard-coded for now, TODO: change to session user_id
  req.body.user_id = user_id;
  next();
}


async function getWatchListForUser(req, res, next) {
  // get user_id from session
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  
  // get watchlist for user
  let sql = `
    SELECT m.id as movie_id, m.title as movie_title, m.poster_path
    FROM watchlist w
    LEFT JOIN movie m
    ON w.movie_id = m.id
    WHERE w.user_id = ?;
  `
  const [rows] = await conn.query(sql, [user_id]);
  req.body.user_watchlist = rows;

  next();
  
}

async function getReviewsForUser(req, res, next) {
  // get user_id from session
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  
  // get watchlist for user
  let sql = `
    SELECT *
    FROM reviews r
    WHERE r.user_id = ?;
  `
  const [rows] = await conn.query(sql, [user_id]);
  req.body.user_reviews = rows;

  next();
}

async function getPopularMovies(req, res, next) {
  const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let response = await fetch(url, options)
  let data = await response.json();
  req.body.popularMovies = data.results;

  next();
}

app.listen(process.env.PORT, () => {                // Start the server
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});