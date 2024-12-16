# Working Out Psuedo of Pagination section
```js
/* FOR PAGINATION: see table below at bottom of this comment
// variables to be used for a navbar which consistently presents the option of 5 pages, once the currentPage reaches center, it will maintain center position incrementing or decrementing at each change of the page.

center = c = 3        // once it reaches this threshold stay keep current page on it
index = i             // should be [currentPage - 2, currentPage + 2] from [Math.floor(currentPage/center)>0 && totalPages-center+1>currentPage]
Math.floor() = f()    // used as a check
totalPages = t = 15   // should be passed every time, can be any number 15 was used as an example below

Math.floor(i-1/center)

cP   t   f(cP/t)  nav         c       f(cP/c)   f(cP-1/c)>=1   t-c+1<cP   t==cP
-----------------------------------------------------------------------
1   15   0       [1]2345>    3        0         F
2   15   0       <1[2]345>   3        0         F
3   15   0       <12[3]45>   3        [1]         F
4   15   0       <23[4]56>            1         {T}                          //indicates cycling
5   15   1       <34[5]67>            1         
6   15   1       <45[6]78>            2
7   15   1       <56[7]89>
8   15   1
9   15   1
10  15   2
11  15   2
12  15   2      < 10 11 [12] 13 14 >  4  
13  15   2      < 11 12 [13] 14 15 >  4                   F
14  15   2      < 11 12 13 [14] 15 >  4                   T
15  15   3      < 11 12 13 14 [15]    5                   T           T

// let currentPage=12 // remember that whats being passed will just be the current page remove the outer for loop
let limit = 5 // indicates number of page options in pagination
let center = Math.ceil(limit/2) // indicates center of pagination element
let totalPages = 64

for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
  let nav = ''
  if (currentPage > 1) {
    // <li>\ltArrow</li> // pointing to currentPage-1
    nav += '< '
  }
  if (currentPage < center) {
    for (let i = 1; i <= limit; i++) {
      // <li>i</li> // set active to currentPage
      nav += (i == currentPage) ? `[${i}] ` : `${i} ` // active or ''
    }
  }
  else if (totalPages-center+1 > currentPage) {
    for (let i = currentPage-center+1; i <= currentPage+center-1; i++){
      // <li>i</li> // set active to currentPage
      nav += (i == currentPage) ? `[${i}] ` : `${i} ` // active or ''
    }
  } else {
    for (let i = totalPages-limit+1; i <= totalPages; i++){
      // <li>i</li>  // set active to currentPage
      nav += (i == currentPage) ? `[${i}] ` : `${i} ` // active or ''
    }
  }
  if (currentPage < totalPages) {
    // <li>\rtArrow</li> // pointing to currentPage+1
    nav += `>`

  }
  console.log(nav)
  // console.log("hello")
}
```