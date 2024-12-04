import express from 'express';                    // Import express module
import 'dotenv/config';                           // Import dotenv module
import mysql from 'mysql2/promise';               // Import mysql module

const app = express();

app.set('port', process.env.PORT || 3000);        // Set the port
app.set('view engine', 'ejs');                    // Set the view engine

app.use(express.static('public'));                // Serve static files from the public folder

app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(express.json());                          // Parse JSON bodies


const pool = mysql.createPool({                   // Create a pool to connect to the database
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true
});

const conn = await pool.getConnection();          // Get a connection from the pool

app.get('/', async (req, res) => {
  let sql = 'SELECT * FROM user';                // SQL query to select all the users
  const [rows] = await conn.execute(sql);         // Execute the query
  for (let row of rows) {
    console.log(row);                             // Print the rows
  }
  res.render('index', {"greeting": "Hello, World!", "port": process.env.PORT});
});

app.get('/search/results', async (req, res) => {
  const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let response = await fetch(url, options);
  let data = await response.json();
    
  res.render('searchResults', { "shows": data.results });
});

app.get('/description', async (req, res) => {
  let id = req.query.id;
  const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
    }
  };

  let response = await fetch(url, options);
  let data = await response.json();
  res.render('movieDescription', { "show": data });
});

/* POST Requests */

// Handle adding watchlist form submission
app.post('/watchlist', async (req, res) => {
  console.log(req.body.movie_id);
  const movie_id = req.body.movie_id;
  // check if movie is already in database
  // if not, add it
  let sql = `SELECT * FROM movie WHERE id = ?`;
  const [rows] = await conn.query(sql, [movie_id]);
  

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

  // where we add the movie to the database if it isn't already in there
  if (rows.length === 0) {
    sql = `INSERT INTO movie (
      id, title, release_date, overview, backdrop_path, poster_path, vote_average
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
    )`;
    await conn.query(sql, [result.id, result.title, result.release_date, result.overview, result.backdrop_path, result.poster_path, result.vote_average]);
  }

  // add the movie to the watchlist
  let sql2 = `INSERT INTO watchlist (movie_id, user_id) VALUES (?, ?)`;
  await conn.query(sql2, [movie_id, 1]);

  res.json({ message: 'Movie added to your watchlist' });
});

app.post('/submitReview', async (req, res) => {
  console.log(req.body);
  // getting the values from the form
  const { movie_id, user_id, title, rating, review } = req.body;
  
  // inserting the values into the database
  // TODO: check first if movie is in database 
  // then check if the user has already submitted a review for this movie
  // if they have, update the review instead of inserting a new one
  let sql = `INSERT INTO reviews (movie_id, user_id, title, rating, review) VALUES (?, ?, ?, ?, ?)`;
  await conn.query(sql, [movie_id, user_id, title, rating, review])
    .then(() => console.log('Review submitted!'))
    .catch(err => console.error(err));
    
  // inserting movie to the watchlist when review is submitted.
  let sqlWatchList = `INSERT INTO watchlist (movie_id, user_id) VALUES (?, ?)`;
  await conn.query(sqlWatchList, [movie_id, user_id])
    .then(() => console.log('Movie added to watchlist!'))
    .catch(err => console.error(err));
  
  res.json({ message: 'Review submitted!' });
});



app.listen(process.env.PORT, () => {                // Start the server
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});