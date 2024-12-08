# Table of Contents
\<\< [Back to Main Page](/README.md)
- [TODO's List](/docs/plan/TODO.md)
- [View Diagrams](/docs/plan/diagrams/view.md)
- [State Diagrams](/docs/plan/diagrams/state.md)
- [UI Diagrams](/docs/plan/diagrams/ui.md)
- [API Notes](/docs/plan/API%20Notes.md)
- [SQL Notes](/docs/plan/SQL%20Notes.md)

## Overall Plan
- Title of the Project: **Rotten Potatoes**
- Description of the plan:
- Generate diagrams:
  - [ER Diagram](/docs/plan/diagrams/er.md): 
  - [Views Diagrams](/docs/plan/diagrams/view.md)
    - Will be Done by Arielle
  - [State Diagram(s)](/docs/plan/diagrams/state.md)
    - Will be Done by Chris
  - [UI Diagram](/docs/plan/diagrams/ui.md)
    - Will be Done by Alex
## How We Plan to Address Each Requirement:
### Minimum Requirements
  - **Title:** Rotten Potatoes
  - **Description:**
    - We’ll be utilizing NodeJS, Express, mySQL, Bootstrap and EJS for our project. Our project will be themed around movie review sites such as: Rotten Tomato, IMDB, Metacritic etc. Where the user is able to login via username and password, select and choose movies to review. We’ll be storing the reviews in an external database using mySQL, and also an external web api referring to [https://developer.themoviedb.org](https://developer.themoviedb.org) . At minimum it seems as we’ll require 4 separate views, One for logging in, one main page where the user can search for movies, another in which lists the movie description along with a list of reviews for the designated movie that has a button trigger initializing a modal that allows the user to record their review. Another page in which the user can view all the reviews they have submitted with the capability to edit via modal popup.
  - Task Distribution
    - For Chris and Arielle we’ll be working on both front-end and back-end to maintain an overall perspective of the program
  - Changes from the Original Design(for final submission)
  - Database Schema(for final submission)
  - Screenshots of the finished project(for final submission)
  - Must use 3 Database tables
    - Refer to [ER Diagram](/docs/plan/diagrams/er.md)
### Feature Requirements:
- Minimum of 3 Different types of form elements
  - Input text for searching a movie
  - Password text for password of the user
  - Number for rating
  - Dropdown for movie, series or episode
  - Textarea for the review itself
- The project uses Web Storage or Express Sessions
  - Yet to be determined
- The project allow users to update existing records in the database in a friendly way (minimum 3 fields)
  - User can edit their rating and review with click of edit button
  - User can change their username and password
- The project allows user to add records to the database
  - User review is added to the reviews table in the database
- The project must have 50 lines of client-side javascript code
  - Client-side JS handles api call. Passes query on to server, then server initiates fetch to intended api.
  - Client-side JS handles user input validation.
- The project includes at least two local or external Web API’s
  - Local: database
  - External: [https://www.omdbapi.com/](https://www.omdbapi.com/) or [The Movie Database(better and works with justwatch)](https://developer.themoviedb.org)

  - [https://quoteapi.pythonanywhere.com/](https://quoteapi.pythonanywhere.com/)
  - for streaming available[https://apis.justwatch.com/docs/api/](https://apis.justwatch.com/docs/api/)
- Project looks professional with consistent design, free of typos, and at least 50 CSS properties or bootstrap
  - We’ll be using bootstrap



---
![TODOs](/docs/plan/TODO.md#todo-list)

---
<sub>\< [Back to Docs](/docs/README.md)</sub>
<sub>\<\< [Back to Main Page](/README.md)</sub>
