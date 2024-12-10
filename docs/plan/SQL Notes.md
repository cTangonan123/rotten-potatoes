# SQL Notes
## Building the tables for your database
- Follow along the instructions set under [Creating a MySQL Database in FastComet](https://docs.google.com/document/d/1vygpxkGuA7CecHa55cSbh7_v7Bj9C6dV0IettNYGEkI/edit?tab=t.0#heading=h.iil8ahsceu1b)
- Then under [Step 1. of lab 5](https://docs.google.com/document/d/15uTrxXPhH4T1vjv7r7CZCkDQYtZ7PVKsJ55VqTAe9ig/edit?tab=t.0) follow along up until you reach the point of copying the sql, instead use the [snippet below](#sql-snippet-for-generating-tables) instead of the SQL code for quotes in the designated database you created.
- after you run this code in fast comet you should be able to access your new database with your own designated credentials. and be able to see the queries you generate.
### SQL snippet for generating tables(UPDATED)
```sql
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 09, 2024 at 06:31 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `footangt_rotten_potatoes`
--

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `release_date` date NOT NULL,
  `overview` varchar(700) COLLATE utf8mb4_unicode_ci NOT NULL,
  `backdrop_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poster_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vote_average` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `title` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL,
  `review` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `user_name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(72) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `is_admin`, `user_name`, `password`) VALUES
(1, 1, 'chris', '$2a$10$G9atEzBijDB.bjK8o0B4YerTTiuHbqtXOkSxsOKm5ok7jpXFVGnUa'), -- password is 'cst336'
(2, 1, 'arielle', '$2a$10$G9atEzBijDB.bjK8o0B4YerTTiuHbqtXOkSxsOKm5ok7jpXFVGnUa'), -- password is 'cst336'
(3, 1, 'alex', '$2a$10$G9atEzBijDB.bjK8o0B4YerTTiuHbqtXOkSxsOKm5ok7jpXFVGnUa'), -- password is 'cst336'
(4, 1, 'ranjita', '$2a$10$G9atEzBijDB.bjK8o0B4YerTTiuHbqtXOkSxsOKm5ok7jpXFVGnUa'), -- password is 'cst336'
(5, 0, 'user', '$2a$10$G9atEzBijDB.bjK8o0B4YerTTiuHbqtXOkSxsOKm5ok7jpXFVGnUa'); -- password is 'cst336'

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
CREATE TABLE `watchlist` (
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`movie_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`user_id`,`movie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

```



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