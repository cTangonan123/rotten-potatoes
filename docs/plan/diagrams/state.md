# Sequence Diagrams
## Resources
- [mermaidchart](https://www.mermaidchart.com/landing?utm_source=google_ads&utm_medium=primary_search&utm_campaign=markdownfocus-US&gad_source=1&gclid=Cj0KCQiAgJa6BhCOARIsAMiL7V_qx7LTRMCpA4KrpHJeeZg82YthBNYfP-ypsQgVA6MVsWzpbXP6NNEaAsKAEALw_wcB): mermaid chart application that allows click and drag for different types of diagrams

---
## [Login View](/docs/plan/diagrams/view.md#view-login-page) with sign-in click
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
    sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor A1 as User
  participant altV as main.ejs
  participant V as login.ejs
  participant CS-JS as client-side.js
  participant SS as index.mjs
  participant DB as database
  autonumber
  A1 ->> V: User clicks Sign in Button
  alt input not valid
    V ->>+ CS-JS: user: "" || pwd: ""
    CS-JS ->>- V: update view<br>invalid
  else input is valid
    V ->>+ CS-JS: user: * && pass: *
    CS-JS ->>- SS: Post Request:<br>username<br>password
  end
  SS ->>+ DB: request query
  DB ->>- SS: return response
  alt response is empty
    SS ->>+ CS-JS: return response
    CS-JS ->>- V: update view<br>invalid
  else response is ok && not empty
    SS ->>+ altV: Valid, redirect to Main View
    
  end
  box darkgrey Client-Side
  participant altV
  participant V
  participant CS-JS
  end
  box darkgrey Server-Side
  participant SS
  participant DB
  end
```

---
## [Login View](/docs/plan/diagrams/view.md#view-login-page) User Clicks New User
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
    sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor A1 as User
  participant V as login.ejs
  participant CS-JS as client-side.js
  participant SS as index.mjs
  participant DB as database
  autonumber
  A1 ->> V: User clicks Sign Up Button
  V ->>+ CS-JS: 
  CS-JS ->>- V: opens modal for creating User
  alt wait for user input
    V ->> V: 
  end
  V->>+ CS-JS: User Clicks submit button
  CS-JS ->>- SS: send inputs as <br>Post Request
  SS ->>+ DB: send query to DB <br>see if user in db
  DB ->>- SS: respond with query
  alt if response not OK || query returns non-empty
    SS ->>+ CS-JS: send error message
    CS-JS ->>- V: update modal with input vaidation
  else if response OK &&<br> query returns empty
    SS ->> V: render login all over
  end
  box darkgrey Client-Side
    
    participant V
    participant CS-JS
  end
  box darkgrey Server-Side
    participant SS
    participant DB
  end
  ```
---
## [Search View](/docs/plan/diagrams/view.md#view-movie-search) User Inputs and Clicks Search Button
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
    sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---

sequenceDiagram
  actor U as User
  participant altV as movieDescription.ejs
  participant V as searchContent.ejs
  participant cJS as client-side.js
  participant SS as index.mjs
  participant DB as database
  participant API as omdb's API
  autonumber
  U ->> V: User inputs:<br>search<br>typeOfContent<br>&<br>click's search button
  alt input validation
    V->>cJS: search="" [invalid]
    cJS->>V: update view showing invalidity
  else
    V->>cJS: search="*" [valid]
    cJS->>+SS: POST Request to server for:<br>search & type
  end
  SS->>+API: GET Request of<br>search & type
  
  API->>-SS: GET Response
  alt empty GET response
    SS->>-cJS: POST Repsonse
    cJS->>V: update view showing no response
  else valid GET response
    SS->>altV: redirect to movieDescription.ejs
  end

  box darkgrey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  box darkgrey Server-Side
    participant SS
    participant DB
  end
```
## [Search Results View](/docs/plan/diagrams/view.md#view-search-results)
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
    sequenceNumberColor: "#0dcaf0"
    signalTextColor: white
    labelBoxBkgColor: "#20c997"
    labelBoxBorderColor: "#ffc107"
    labelTextColor: white
    loopTextColor: white
---
sequenceDiagram
  actor U as User
  #participant altV as movieDescription.ejs
  participant V as searchResults.ejs
  participant cJS as client-side.js
  #participant SS as index.mjs
  #participant DB as database
  #participant API as omdb's API
  autonumber
  U ->> V: User clicks write review button
  V ->> cJS: click event sent<br> [stop propogation]
  cJS ->> V: review Modal triggered
  box grey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  #box grey Server-Side
    #participant SS
    #participant DB
  #end
```
---
## [Search Results View: Review Modal](/docs/plan/diagrams/view.md#view-movie-review-form)
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
  actor U as User
  #participant altV as movieDescription.ejs
  participant V as searchResults.ejs
  participant cJS as client-side.js
  participant SS as index.mjs
  participant DB as database
  participant API as omdb's API
  autonumber
  U ->> V: User inputs:<br>title & rating & review<br>clicks submit on modal
  V->>cJS: 
  cJS ->> SS: POST Request<br>data: title, rating, review, movie_id
  SS ->>+ DB: query if movie_id<br> exists in movie table
  DB ->> SS: response
  alt doesn't exist in DB
    SS->>API: GET request for movie details
    API->>SS: GET response for movie detals
    SS->>DB: insert movie into movie table
  end
  SS->>DB: insert review into DB
  SS->>cJS: POST Response
  alt response not ok
    cJS->>V: show alert indicating review not recorded
  else response ok
    cJS->>V: close Modal, show Toast indicating review recorded
  end

  links SS: {"Dashboard": "https://dashboard.contoso.com/alice", "document": "/index.mjs"}

  box grey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  box grey Server-Side
    participant SS
    participant DB
  end
```
---
## [View Edit User: username update](/docs/plan/diagrams/view.md#view-edit-user)
- as a note updating of password should be similar, simply replace any instance of username with password instead
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
  actor U as User
  #participant altV as movieDescription.ejs
  participant V as editUser.ejs
  participant cJS as client-side.js
  participant SS as index.mjs
  participant DB as database
  #participant API as omdb's API
  autonumber
  U ->> V: User inputs:<br>new username<br>clicks Update for username
  V->>cJS: input validation
  alt input invalid
    cJS->>V: update view<br>indicating invalidation
  else input valid
    cJS->>SS: POST Request<br>update username
  end
  SS->>DB: insert new value into username
  DB->>SS: query response
  SS->>cJS: POST Response
  cJS->>V: display toast<br>username changed
  box grey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  box grey Server-Side
    participant SS
    participant DB
  end

```

---
## [View User Edit: an Edit Review is clicked](/docs/plan/diagrams/view.md#view-edit-user)
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
  actor U as User
  #participant altV as movieDescription.ejs
  participant V as editUser.ejs
  participant cJS as client-side.js
  participant SS as index.mjs
  participant DB as database
  #participant API as omdb's API
  autonumber
  U ->> V: User clicks edit button<br>on a review
  V->> cJS: handle event
  cJS->> SS: POST Request for full Review info
  SS->>DB: query review details
  DB->>SS: query Response
  SS->>cJS: POST Response
  cJS->>V: modal to edit pops up<br> pre-filled with data from database
  box grey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  box grey Server-Side
    participant SS
    participant DB
  end
```
---
## [View User Edit: an Edit Review Modal is Filled and Submitted](/docs/plan/diagrams/view.md#view-edit-user)
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
  actor U as User
  #participant altV as movieDescription.ejs
  participant V as editUser.ejs
  participant cJS as client-side.js
  participant SS as index.mjs
  participant DB as database
  #participant API as omdb's API
  autonumber
  U ->> V: User Edits old Review<br> in edit modal
  V->> cJS: handle event
  cJS->> SS: POST Request to UPDATE Review
  SS->>DB: query UDPATE review details
  DB->>SS: query Response of UDPATE
  SS->>cJS: POST Response of UPDATE
  cJS->>V: toast shown<br>Review has been updated
  box grey Client-Side
    #participant altV
    participant V
    participant cJS
  end
  box grey Server-Side
    participant SS
    participant DB
  end
```
---





<sub>\< [Back to Docs](/docs/README.md)</sub>
<sub>\<\< [Back to Main Page](/README.md)</sub>

