import express from 'express';                    // Import express module
import 'dotenv/config';                           // Import dotenv module
import mysql from 'mysql2/promise';               // Import mysql module
import bcrypt from 'bcrypt';                       // Import bcrypt module
import session from 'express-session';             // Import express-session module
import fetch from 'node-fetch';                    // Import node-fetch to make external API calls

const app = express();

app.set('port', process.env.PORT || 3000);        // Set the port
app.set('view engine', 'ejs');                    // Set the view engine

app.use(express.static('public'));                // Serve static files from the public folder
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(express.json());                          // Parse JSON bodies

// Setting up session
app.set('trust proxy', 1); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Setup MySQL connection pool
const pool = mysql.createPool({                   
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true
});

async function getDbConnection() {
  return await pool.getConnection();
}

/* GET Requests */

/* VIEW Specific GET Requests */

// Handles rendering of the login view
app.get('/', async (req, res) => {
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

// Handles rendering of the searchResults view
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

// Handles rendering of the movieDescription view
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

  const urlRecommendations = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&page=1`;
  const optionsRecommendations = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let respRecommendations = await fetch(urlRecommendations, optionsRecommendations);
  let dataRecommendations = await respRecommendations.json();

  const conn = await getDbConnection();
  let sql = `SELECT r.user_id, r.movie_id, r.title, r.rating, r.review, u.user_name
             FROM reviews r
             LEFT JOIN user u ON r.user_id = u.id
             WHERE movie_id = ?`;
  const [rows] = await conn.query(sql, [movie_id]);

  res.render('movieDescription', { "show": data, "reviews": rows, user_id, user_name, is_admin, watchlist, watched, reviewed, recommendations: dataRecommendations.results });
});

// Handles rendering of the userProfile view
app.get('/userProfile', isAuthenticated, getUserId, checkAdmin, getWatchListForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let is_admin = req.session.is_admin;
  let user_name = req.session.user_name;
  let watchlist = req.session.user_watchlist;

  const conn = await getDbConnection();
  let sql = `SELECT m.id as movie_id, m.title as movie_title, m.poster_path, r.id as review_id, r.title as review_title, r.rating, review
             FROM reviews r
             LEFT JOIN movie m ON r.movie_id = m.id
             WHERE user_id = ?
             ORDER BY r.date DESC`;
  const [rows] = await conn.query(sql, [user_id]);

  res.render('userProfile', { "reviews": rows, user_id, is_admin, user_name, watchlist });
});

// Handles rendering of the editUsers view
app.get('/editUsers', getUserId, checkAdmin, getWatchListForUser, async (req, res) => {
  let user_id = req.session.user_id;
  let user_name = req.session.user_name;
  let is_admin = req.session.is_admin;
  let watchlist = req.session.user_watchlist;

  const conn = await getDbConnection();
  let sql = 'SELECT * FROM user';
  const [users] = await conn.query(sql);
  res.render('editUsers', { users, user_id, user_name, is_admin, watchlist });
});

// Handles redirecting to the login page once user logs out
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// API Specific GET Requests

// Handles the retrieval of a specific review from the database
app.get('/getReview/:id', async (req, res) => {
  let review_id = req.params.id;
  const conn = await getDbConnection();
  let sql = `SELECT * FROM reviews WHERE id = ?`;
  const [rows] = await conn.query(sql, [review_id]);
  res.json(rows[0]);
});

// Handles username availability check
app.get('/api/usernameAvailable/:username', async (req, res) => {
  let username = req.params.username;
  const conn = await getDbConnection();
  let sql = `SELECT * FROM user WHERE user_name = ?`;
  const [rows] = await conn.query(sql, [username]);
  if (rows.length === 0) {
    res.json({ "available": true });
  } else {
    res.json({ "available": false });
  }
});

// Handles rendering of the createNewAccount view
app.get('/createNewAccount', (req, res) => {
  res.render('createNewAccount');
});

/* POST Requests */

// Handles the creation of a new account
app.post("/newUser", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  const conn = await getDbConnection();
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
app.post('/login', async
