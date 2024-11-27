import express from 'express';                    // Import express module
import 'dotenv/config';                           // Import dotenv module
import mysql from 'mysql2/promise';               // Import mysql module

const app = express();

app.set('port', process.env.PORT || 3000);        // Set the port
app.set('view engine', 'ejs');                    // Set the view engine

app.use(express.static('public'));                // Serve static files from the public folder

app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
// app.use(express.json());                       // Parse JSON bodies


const pool = mysql.createPool({                   // Create a pool to connect to the database
  host: process.env.QUOTE_DB_HOST,
  user: process.env.QUOTE_DB_USER,
  password: process.env.QUOTE_DB_PASSWORD,
  database : process.env.QUOTE_DB_NAME,
  connectionLimit: 10,
  waitForConnections: true
});

const conn = await pool.getConnection();          // Get a connection from the pool

app.get('/', async (req, res) => {
  res.render('index', {"greeting": "Hello, World!", "port": process.env.PORT});
});

app.listen(process.env.PORT, () => {                // Start the server
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});