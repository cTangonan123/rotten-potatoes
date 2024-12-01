# API Notes

## [The Movie Database API](https://developer.themoviedb.org)

### `search/movie` [endpoint](https://developer.themoviedb.org/reference/search-movie)
```js
// note: spaces need to be replaced with `%20` in urls.
// search_query variable is determined by user
const url = `https://api.themoviedb.org/3/search/movie?query=${search_query}&page=1`;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json)) // where you do stuff
  .catch(err => console.error(err));

```
#### Example Results
```js
{
  "page": 1,
  "results": [
    {
      "adult": false,
      "backdrop_path": "/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg", // need in DB
      "genre_ids": [
        28,
        12,
        878
      ], 
      "id": 545611, // need in DB
      "original_language": "en",
      "original_title": "Everything Everywhere All at Once", 
      "overview": "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.", // need in DB
      "popularity": 63.141,
      "poster_path": "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", // need in DB refer to [imageURLS](/docs/plan/API%20Notes.md#image-urls)
      "release_date": "2022-03-24", // need in DB
      "title": "Everything Everywhere All at Once", // need in DB
      "video": false,
      "vote_average": 7.8, // need in DB
      "vote_count": 6549
    },
    {
      "adult": false,
      "backdrop_path": "/2uHOdm0oL6c64vftYOLN207LCCu.jpg",
      "genre_ids": [
        99
      ],
      "id": 1258497,
      "original_language": "en",
      "original_title": "Almost Everything You Ever Wanted to Know About Everything Everywhere All at Once",
      "overview": "A behind-the-scenes look at Everything Everywhere All at Once, with interviews from the directors/writers, cast and crew.",
      "popularity": 5.89,
      "poster_path": "/A8eqNfQMAEI7GTChsA3XunC59RV.jpg",
      "release_date": "2022-07-05",
      "title": "Almost Everything You Ever Wanted to Know About Everything Everywhere All at Once",
      "video": false,
      "vote_average": 10,
      "vote_count": 1
    }
  ],
  "total_pages": 1,
  "total_results": 2
}
```
### `movie/details` [endpoint](https://developer.themoviedb.org/reference/movie-details)
- will be used in our movieDescription view
- need to pass the `movie_id` to it in the api call to server.
```js
const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json)) // where to do stuff
  .catch(err => console.error(err));
```

### `movie/recommendations` [endpoint](https://developer.themoviedb.org/reference/movie-recommendations)
- can be used in our `movieDescription` view
- need to pass the `movie_id` to it in the api call to server.
```js
const url = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&page=1`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json)) // do stuff here
  .catch(err => console.error(err));

```


### [Image URLs](https://developer.themoviedb.org/docs/image-basics)
- in their responses in order to access their poster images this is the url pattern, where `poster_path` is a property within the data response
```js
// poster_path is a property generated in the search movie endpoint and the movie details endpoint
let url = `https://image.tmdb.org/t/p/original${poster_path}`
```
- can also refer to the [/configuration api call](https://developer.themoviedb.org/reference/configuration-details) for a different file sizes, could be good for when displaying lists of movies.
#### Example
Say we wanted to get smaller sized images of the poster saw with a width of 185px, we could then use.
```js
let poster_sizes = [
  "w92",
  "w154",
  "w185", // what we're looking for, index = 2
  "w342",
  "w500",
  "w780",
  "original"
]
let baseURL = `https://image.tmdb.org/t/p/`
let url = `${baseURL}${poster_sizes[2]}${poster_path}`
```

### [Movie Video Endpoints](https://developer.themoviedb.org/reference/movie-videos)
use the `key` property of the data response in the url for youtube videos.
```js
let movie_id = 545611 //example
const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?language=en-US`;

// key property is generated from the above fetch, which contains a list of objects, you will need to determine which are Youtube videos.
let youtubeURL = `https://www.youtube.com/watch?v=${key}`
```

### [Watch Providers](https://developer.themoviedb.org/reference/tv-season-watch-providers)
- must attribute JustWatch in order to use
- does not provide deeplinks, only for displaying where it's available
```js
let url = `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`
```