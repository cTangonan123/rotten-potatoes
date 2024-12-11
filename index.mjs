import express from 'express';                    // Import express module
import 'dotenv/config';                           // Import dotenv module
import mysql from 'mysql2/promise';               // Import mysql module
import bcrypt from 'bcrypt';                       // Import bcrypt module
import session from 'express-session';             // Import express-session module

const app = express();

app.set('port', process.env.PORT || 3000);        // Set the port
app.set('view engine', 'ejs');                    // Set the view engine

app.use(express.static('public'));                // Serve static files from the public folder

app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(express.json());                          // Parse JSON bodies

// setting up session
app.set('trust proxy', 1); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  
}))

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

// Handles rendering of the login view
app.get('/', async (req, res) => {
  // let sql = 'SELECT * FROM user';
  // const [rows] = await conn.execute(sql);         
  // for (let row of rows) {
  //   console.log(row);                             
  // }
  // res.render('index', {"greeting": "Hello, World!", "port": process.env.PORT});, res) => {
  res.render('login');
});

// Handles rendering of the searchPage view
app.get('/search', isAuthenticated, getWatchListForUser, getPopularMovies, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;
  let watchlist = req.session.user_watchlist;
  let popularMovies = req.session.popularMovies;

  res.render('searchPage', { user_id, watchlist, popularMovies, is_admin, user_name });
});

// Handles rendering of the searchResults view, once user submits a search query
app.get('/search/results', isAuthenticated, getWatchListForUser, getReviewsForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;
  let watchlist = req.session.user_watchlist;
  let reviews = req.session.user_reviews;
  let searchQuery = req.query.searchQuery;
  let searchQueryURL = searchQuery.replace(/ /g, '%20');

  let watched = new Set(watchlist.map(movie => movie.movie_id));
  let reviewed = new Map(reviews.map(review => [review.movie_id, review.id]));


  // https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1

  // console.log("this is the user id: " + user_id) // for testing
  // console.log("this is the watchlist:*********")
  // for (let movie of watchlist) {
  //   console.log(movie)
  // }

  // let user_id = 2;
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

  
    
  res.render('searchResults', { "shows": data.results, user_id, user_name, is_admin, watchlist, watched, reviewed });
});

// Handles rendering of the movieDescription view, once user clicks on a specific movie
app.get('/description', isAuthenticated, getWatchListForUser, getReviewsForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;
  let watchlist = req.session.user_watchlist;
  let reviews = req.session.user_reviews;
  let movie_id = req.query.id;

  let watched = new Set(watchlist.map(movie => movie.movie_id));
  let reviewed = new Map(reviews.map(review => [review.movie_id, review.id]));

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

  const urlRecommendations = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&page=1`;
  const optionsRecommendations = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let respRecommendations = await fetch(urlRecommendations, optionsRecommendations)
  let dataRecommendations = await respRecommendations.json();

  let sql = `
    SELECT r.user_id, r.movie_id, r.title, r.rating, r.review, u.user_name
    FROM reviews r
           LEFT JOIN user u ON r.user_id = u.id
    WHERE movie_id = ?`;
  const [rows] = await conn.query(sql, [movie_id]);
  console.log(rows);

  res.render('movieDescription', { "show": data, "reviews": rows, user_id, user_name, is_admin, watchlist, watched, reviewed, recommendations: dataRecommendations.results });
});

// Handles rendering of the userProfile view
app.get('/userProfile', isAuthenticated, getUserId, checkAdmin, getWatchListForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let is_admin = req.session.is_admin;
  let user_name = req.session.user_name;
  let watchlist = req.session.user_watchlist;

  let sql = `
    SELECT m.id as movie_id, m.title as movie_title, m.poster_path, r.id as review_id, r.title as review_title, r.rating, review
    FROM reviews r
           LEFT JOIN movie m ON r.movie_id = m.id
    WHERE user_id = ?
    ORDER BY r.date DESC`;
  const [rows] = await conn.query(sql, [user_id]);

  res.render('userProfile', { "reviews": rows, user_id, is_admin, user_name, watchlist });
});

app.get('/getUsersProfile', isAuthenticated, getUserId, checkAdmin, getWatchListForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let is_admin = req.session.is_admin;
  let user_name = req.session.user_name;
  let watchlist = req.session.user_watchlist;
  
  let users_id = req.query.id;
  let users_name = req.query.username;
  let sqlWatched = `
    SELECT m.id, m.title, m.poster_path
    FROM watchlist w
    LEFT JOIN movie m
    ON w.movie_id = m.id
    WHERE w.user_id = ?`;
  const [usersWatchlist] = await conn.query(sqlWatched, [users_id]);

  let sqlCommon = `
    with user1 as (
      SELECT movie_id
      FROM watchlist
      WHERE user_id = ?
    ), user2 as (
      SELECT movie_id
      FROM watchlist
      WHERE user_id = ?
    ), common as (
      SELECT u1.movie_id
      FROM user1 u1
      JOIN user2 u2
      ON u1.movie_id = u2.movie_id
    )
    SELECT m.id, m.title, m.poster_path
    FROM common c
    LEFT JOIN movie m
    ON c.movie_id = m.id;
  `
  let [usersCommon] = await conn.query(sqlCommon, [user_id, users_id]);

  res.render('userSocialProfile', {user_id, is_admin, user_name, watchlist, users_id, users_name, usersWatchlist, usersCommon})
})

// Handles rendering of the editUsers view
app.get('/editUsers', getUserId, checkAdmin, getWatchListForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;
  
  let watchlist = req.session.user_watchlist;

  let sql = 'SELECT * FROM user';
  const [users] = await conn.query(sql);
  res.render('editUsers', { users, user_id, user_name, is_admin, watchlist });
});

// Handles redirecting to the login page once user logs out
app.get('/logout', (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.redirect('/search');
  //   }
  //   res.clearCookie('connect.sid');
  //   res.redirect('/');
  // });
  req.session.destroy();
  res.redirect('/');
});

/* API Specific(associated with client-side js) GET Requests */

// Handles the retrieval of a specific review from the database
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

// Handles username availability check
app.get('/api/usernameAvailable/:username', async (req, res) => {
  let username = req.params.username;
  let sql = `
  SELECT * 
  FROM user
  WHERE user_name = ?`;
  // let sql = `
  //   SELECT EXISTS
  //   (SELECT * 
  //   FROM user
  //   WHERE user_name = ?)`;
  const [rows] = await conn.query(sql, [username]);
  console.log(rows[0]);
  if (rows.length === 0) {
    res.json({"available": true});
  } else {
    res.json({"available": false});
  }
});

// Handles rendering of the createNewAccount view
app.get('/createNewAccount', (req, res) => {
  res.render('createNewAccount');
});

// AddUser GET Route - Shows the form to create a new user
app.get('/addUser', isAuthenticated, checkAdmin, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;

  res.render('addUser', { user_id, user_name, is_admin });
});




/* POST Requests */
// Handles the creation of a new account
app.post("/newUser", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  let sqlSelect = 'SELECT * FROM user WHERE user_name = ?';
  const [rows] = await conn.query(sqlSelect, [username]);

  if (rows.length !== 0) {
    res.render('createNewAccount', { username, password, message: 'Username unavailable.' });
    return;
  }

  if (password.length < 6) {
    res.render('createNewAccount', { username, password, message: 'Password must have at least six characters.' });
    return;
  }

  let sql = `INSERT INTO user (user_name, password, is_admin) VALUES (?, ?, 0)`;  // hard-coded not admin
  let params = [username, hashedPassword];
  const [result] = await conn.query(sql, params);

  req.session.user_id = result.insertId;  // Set the session user_id
  req.session.user_name = username;
  req.session.is_admin = 0;
  req.session.authenticated = true;

  res.redirect('/search');
});

// Handles the login form submission
app.post('/login', async (req, res) => {
  const user_name = req.body.user_name;
  const password = req.body.password;

  let sql = 'SELECT * FROM user WHERE user_name = ?';
  const [rows] = await conn.query(sql, [user_name]);

  if (rows.length === 0) {
    res.render('login', { message: 'Invalid username or password' });
    return;
  }

  const user = rows[0];
  console.log(user.password)

  const match = await bcrypt.compare(password, user.password);
  console.log(match)
  // const match = password === user.password;
  if (match) {
    req.session.user_id = user.id;
    req.session.user_name = user.user_name;
    req.session.is_admin = user.is_admin;
    req.session.authenticated = true;
    res.redirect('/search');
  } else {
    res.render('login', { message: 'Invalid username or password' });
  }
});

// Handles the update of a user
app.post('/updateUser', async (req, res) => {
  const { id, user_name, is_admin } = req.body;
  let sql = 'UPDATE user SET user_name = ?, is_admin = ? WHERE id = ?';
  await conn.query(sql, [user_name, is_admin ? 1 : 0, id]);
  res.redirect('/editUsers');
});

// Handles the deletion of a user
app.post('/deleteUser', async (req, res) => {
  const { id } = req.body;
  let sql = 'DELETE FROM user WHERE id = ?';
  await conn.query(sql, [id]);
  res.redirect('/editUsers');
});

// Handles adding a movie to a users watchlist
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

// Handles removing a movie from users watchlist
app.post('/removeFromWatchList', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  const movie_id = req.body.movie_id;

  let sql = `
    DELETE FROM watchlist 
    WHERE movie_id = ? AND user_id = ?`;
  await conn.query(sql, [movie_id, user_id]);

  res.json({ message: 'Movie removed from your watchlist' });
})

// Handles review form submission
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

// Handles review deletion
app.post('/deleteReview', getUserId, async (req, res) => {
  let user_id = req.body.user_id; // hard-coded for now, TODO: change to session user_id
  const review_id = req.body.review_id;

  let sql = `
    DELETE FROM reviews 
    WHERE id = ?`;
  await conn.query(sql, [review_id]);

  res.json({ message: 'Review deleted' });
});

// Handles password update
app.post('/updatePassword', getUserId, async (req, res) => {
  const user_id = req.body.user_id;
  const newPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  let sql = 'UPDATE user SET password = ? WHERE id = ?';
  await conn.query(sql, [hashedPassword, user_id]);

  res.redirect('/userProfile');
});

// AddUser POST Route - Creates a new user
app.post("/addUser", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  const conn = await getDbConnection();
  let sqlSelect = 'SELECT * FROM user WHERE user_name = ?';
  const [rows] = await conn.query(sqlSelect, [username]);

  if (rows.length !== 0) {
    res.render('addUser', { username, message: 'Username unavailable.' });
    return;
  }

  if (password.length < 6) {
    res.render('addUser', { username, message: 'Password must have at least six characters.' });
    return;
  }

  let sql = `INSERT INTO user (user_name, password, is_admin) VALUES (?, ?, 0)`;  // hard-coded not admin
  let params = [username, hashedPassword];
  const [result] = await conn.query(sql, params);

  res.redirect('/editUsers');  // Redirect to user list after adding a user
});

/** MIDDLEWARE Functions **/
// middleware to check if user is authenticated, apply first to all views that require authentication
function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect('/');
  } else {
    next();
  }
}

// middleware to get watchlist for user
async function getWatchListForUser(req, res, next) {
  // get user_id from session
  let user_id = req.session.user_id; // hard-coded for now, TODO: change to session user_id
  
  // get watchlist for user
  let sql = `
    SELECT m.id as movie_id, m.title as movie_title, m.poster_path
    FROM watchlist w
    LEFT JOIN movie m
    ON w.movie_id = m.id
    WHERE w.user_id = ?
    ORDER BY w.date DESC;
  `
  const [rows] = await conn.query(sql, [user_id]);
  req.session.user_watchlist = rows;

  next();
  
}

// middleware to get reviews for user
async function getReviewsForUser(req, res, next) {
  // get user_id from session
  let user_id = req.session.user_id; // hard-coded for now, TODO: change to session user_id
  
  // get watchlist for user
  let sql = `
    SELECT *
    FROM reviews r
    WHERE r.user_id = ?;
  `
  const [rows] = await conn.query(sql, [user_id]);
  req.session.user_reviews = rows;

  next();
}

// middleware to get popular movies
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
  req.session.popularMovies = data.results;

  next();
}

// deprecated after integrating session
async function getUserId(req, res, next) {
  // Get user_id from session
  let user_id = req.session.user_id;
  req.body.user_id = user_id;
  next();
}

// deprecated after integrating session
async function checkAdmin(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  let sql = 'SELECT is_admin FROM user WHERE id = ?';
  const [rows] = await conn.query(sql, [req.session.user_id]);

  if (rows.length > 0 && rows[0].is_admin) {
    req.body.is_admin = true;
  } else {
    req.body.is_admin = false;
  }

  next();
}



app.listen(process.env.PORT, () => {                // Start the server
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
