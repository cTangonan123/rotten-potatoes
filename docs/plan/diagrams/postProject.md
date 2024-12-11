# Post Project
## Rendered by Copilot post Project

cTangonan123: @workspace could you generate mermaid ui diagrams that illustrate the possible actions a user would take?

Workspace: Sure, here are the Mermaid UI diagrams illustrating the possible actions a user would take:

### User Registration Flow
```mermaid
---
config:
  theme: neo-dark
  themeVariables:
    actorBkg: "#0d6efd"
    actorBorder: white
    actorTextColor: white
    primaryColor: "#0d6efd"
    signalColor: "#0dcaf0"
    #sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Server as Server
  participant DB as Database

  User ->> Browser: Fill registration form
  Browser ->> Server: POST /newUser
  Server ->> DB: SELECT * FROM user WHERE user_name = ?
  DB ->> Server: Return user data
  alt Username unavailable
    Server ->> Browser: Render createNewAccount with message 'Username unavailable.'
  else Password too short
    Server ->> Browser: Render createNewAccount with message 'Password must have at least six characters.'
  else Valid registration
    Server ->> DB: INSERT INTO user (user_name, password, is_admin)
    DB ->> Server: Return insertId
    Server ->> Browser: Redirect to /search
  end
```
---
#### User Registration Flowchart
```mermaid
---
config: {theme: dark}
---
flowchart TD
    A[Registration Page] --> B[Fill Registration Form]
    B --> C[Submit Registration Form]
    C --> D{Validate Form}
    D -->|Invalid| E[Show Registration Error]
    D -->|Valid| F[Check Username Availability]
    F --> G{Username Available?}
    G -->|No| E[Show Username Unavailable Error]
    G -->|Yes| H[Create New User]
    H --> I[Redirect to Search Page]
```
---

### User Login Flow
```mermaid
---
config:
  theme: neo-dark
  themeVariables:
    actorBkg: "#0d6efd"
    actorBorder: white
    actorTextColor: white
    primaryColor: "#0d6efd"
    signalColor: "#0dcaf0"
    #sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Server as Server
  participant DB as Database

  User ->> Browser: Fill login form
  Browser ->> Server: POST /login
  Server ->> DB: SELECT * FROM user WHERE user_name = ?
  DB ->> Server: Return user data
  alt Invalid username or password
    Server ->> Browser: Render login with message 'Invalid username or password'
  else Valid login
    Server ->> Browser: Redirect to /search
  end
```
---
#### User Login workflow
```mermaid
---
config: {theme: dark}
---
flowchart TD
    A[Login Page] --> B[Fill Login Form]
    B --> C[Submit Login Form]
    C --> D{Validate Credentials}
    D -->|Invalid| E[Show Login Error]
    D -->|Valid| F[Redirect to Search Page]
```

### User Search Flow
```mermaid
---
config:
  theme: neo-dark
  themeVariables:
    actorBkg: "#0d6efd"
    actorBorder: white
    actorTextColor: white
    primaryColor: "#0d6efd"
    signalColor: "#0dcaf0"
    #sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Server as Server
  participant API as TMDB API

  User ->> Browser: Enter search query
  Browser ->> Server: GET /search?query=searchQuery
  Server ->> API: GET /search/movie?query=searchQuery
  API ->> Server: Return search results
  Server ->> Browser: Render searchResults with data
```

### User Add to Watchlist Flow
```mermaid
---
config:
  theme: neo-dark
  themeVariables:
    actorBkg: "#0d6efd"
    actorBorder: white
    actorTextColor: white
    primaryColor: "#0d6efd"
    signalColor: "#0dcaf0"
    #sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Server as Server
  participant DB as Database

  User ->> Browser: Click add to watchlist
  Browser ->> Server: POST /addToWatchList
  Server ->> DB: SELECT * FROM watchlist WHERE movie_id = ? AND user_id = ?
  DB ->> Server: Return watchlist data
  alt Movie not in watchlist
    Server ->> DB: INSERT INTO watchlist (movie_id, user_id)
    DB ->> Server: Return insertId
    Server ->> Browser: Render message 'Movie added to watchlist'
  else Movie already in watchlist
    Server ->> Browser: Render message 'Movie already in watchlist'
  end
```
---
#### User Search Flowchart
```mermaid
---
config: {theme: dark}
---
flowchart TD
    A[Search Page] --> B[Enter Search Query]
    B --> C[Submit Search Query]
    C --> D[Fetch Search Results]
    D --> E[Display Search Results]
    E --> F[View Movie Details]
    E --> G[Add to Watchlist]
    E --> H[Submit Review]
    F --> I[View Movie Details Page]
    G --> J[Add Movie to Watchlist]
    H --> K[Submit Movie Review]
    I --> L[Return to Search Page]
    J --> L[Return to Search Page]
    K --> L[Return to Search Page]
```
---
### User Submit Review Flow
```mermaid
---
config:
  theme: neo-dark
  themeVariables:
    actorBkg: "#0d6efd"
    actorBorder: white
    actorTextColor: white
    primaryColor: "#0d6efd"
    signalColor: "#0dcaf0"
    #sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Server as Server
  participant DB as Database

  User ->> Browser: Fill review form
  Browser ->> Server: POST /submitReview
  Server ->> DB: SELECT * FROM reviews WHERE movie_id = ? AND user_id = ?
  DB ->> Server: Return review data
  alt Review exists
    Server ->> DB: UPDATE reviews SET title = ?, rating = ?, review = ? WHERE movie_id = ? AND user_id = ?
    DB ->> Server: Return update status
    Server ->> Browser: Render message 'Review updated'
  else New review
    Server ->> DB: INSERT INTO reviews (movie_id, user_id, title, rating, review)
    DB ->> Server: Return insertId
    Server ->> Browser: Render message 'Review submitted'
  end
```
---
```mermaid
---
config: {theme: dark}
---
flowchart TD
    A[Search Page] --> B[View Movie Details]
    B --> C[Submit Review]
    C --> D[Fill Review Form]
    D --> E[Submit Review Form]
    E --> F{Validate Review}
    F -->|Invalid| G[Show Review Error]
    F -->|Valid| H[Save Review to Database]
    H --> I[Return to Movie Details]
```
---
## User navigation flowchart
```mermaid
---
config: {theme: dark}
---
flowchart TD
    A[Home Page] --> B[Login Page]
    A --> C[Registration Page]
    A --> D[Search Page]
    B --> E[Submit Login Form]
    C --> F[Submit Registration Form]
    D --> G[View Movie Details]
    D --> H[Add to Watchlist]
    D --> I[Submit Review]
    E -->|Success| J[Redirect to Search Page]
    E -->|Failure| B[Show Login Error]
    F -->|Success| J[Redirect to Search Page]
    F -->|Failure| C[Show Registration Error]
    G --> K[View Movie Details Page]
    H --> L[Add Movie to Watchlist]
    I --> M[Submit Movie Review]
    K --> N[Add to Watchlist from Details]
    K --> O[Submit Review from Details]
    L --> D[Return to Search Page]
    M --> D[Return to Search Page]
    N --> K[Return to Movie Details]
    O --> K[Return to Movie Details]
```

These diagrams illustrate the main actions a user can take in your application.