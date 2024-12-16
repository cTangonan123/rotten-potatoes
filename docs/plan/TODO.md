# TODO List:
## Priority List
- [ ] create an about page
- [ ] alter footer after about page is created
  - 3 sections: About Page Link | github repo Link | attribute to TMDB

- [ ] ~~replace alerts with toasts~~
- [ ] ~~convert adding to watchlist and adding to review to be dynamically alter button instead of reloading // too dependent on the load cannot think of a way without interfering~~
- [x] add a genreResults view and swap its routes from searchResults
- [x] include genres search by popularity
- [x] on searchResults page, either induce infinitescroll, or pages to the api call
  - ensure passing of `page` value of 1 at initial /search call increment thereafter
- [x] fix login and create new account, convert to client-side js handling validation
- [x] chartjs for vote_average of movies on [movieDescription view](/views/movieDescription.ejs)
- [x] `grep -irl` minimizing all `.poster_path` image sizes and `.backdrop_path` image sizes
- [x] minimize all place holder images
- [ ] change any poster or backdrop to render client-side 
  - [recommended Movies Section in movieDescription.ejs](/views/movieDescription.ejs?plain=1#L64)
  - [Compare Watchlist Section in userSocialProfile.ejs](/views/userSocialProfile.ejs?plain=1#L46)
  - [Users Watchlist Section in userSocialProfile.ejs](/views/userSocialProfile.ejs?plain=1#L60)
- [x] look up express documentation and properly implement
- [x] use popovers on hover displaying key information of movie/user, [refererence to trigger popover](https://getbootstrap.com/docs/5.3/components/popovers/#disabled-elements)
  - apply to [recommended Movies Section in movieDescription.ejs](/views/movieDescription.ejs?plain=1#L64)

### example for popover trigger
```js
// for hovering over something, evnets 'mouseover' and 'mouseout' must be used
// consider to use popover compontent from bootstrap to display
// movie information when hovering over movie poste, client-side render 
/* Example of structure to trigger popover */
document.querySelector("#rBtnClose").addEventListener('mouseover', e => {
  let temp = e.currentTarget.style.backgroundColor
  e.currentTarget.style.backgroundColor = "red"
  e.currentTarget.addEventListener('mouseout', e => {
    e.currentTarget.style.backgroundColor = temp
  })
})
```



---
Due by Wednesday 12/11/2024
- Login implementation
- Create New User page
  - view
  - routing
- Admin Section
  - Edit Users page (for Admin only)
    - view
    - routing
  - Add Movie page (for Admin only)
    - view
    - routing
- Watchlist sidebar

Due by Sunday 12/8/2024
- [ ] Initial Search Page View 

Break: Getting Ready for Final Exam
- [ ] next meeting will be Saturday 12/7/2024 @ ???
Due by Wednesday 12/4/2024 
- [x] **Finalized Database Schema** by @cTangonan123
- [ ] **Work on initial Search Page (login could possibly be implemented later)**
- [ ] **Routing for initial API working.**
- [x] searchResults View page by @A-Lauper
  - [x] create writeReview modal partial by @cTangonan123
- [x] MovieDescription View Page by @A-Lauper

Due by Saturday 11/30/2024
- [x] Generate Diagrams
  - [x] View Diagrams by @A-Lauper
  - [x] State Diagrams by @cTangonan123
  - [ ] ~~UI Diagrams by @alexcbensen~~

  - 

<sub>\< [Back to Docs](/docs/README.md)</sub>
<sub>\<\< [Back to Main Page](/README.md)</sub>