# SQL Notes
## For building the userProfile view
**SQL call for Populating the Reviews Section**
```js
let user_id = req.session.user_id
const sql = `
  SELECT r.id, r.movie_id, m.title as movie_title, r.title as review_title, r.rating, m.poster_path, m.backdrop_path
  FROM reviews r
  LEFT JOIN movie m ON r.movie_id = m.id
  WHERE r.user_id = ?;`;

const [rows] = await conn.query(sql, [user_id]);
```

## For building the watchlist option
**SQL for filling up the watchlist sidebar**
```js
let user_id = req.session.user_id
const sql = `
  SELECT w.movie_id, m.title, m.release_date, m.overview, m.backdrop_path, m.poster_path, m.vote_average 
  FROM watchlist w 
  LEFT JOIN movie m 
  ON w.movie_id = m.id 
  WHERE w.user_id = ?; 
`;

const [rows] = await conn.query(sql, [user_id])
```