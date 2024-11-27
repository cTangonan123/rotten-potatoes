# Rotten Potatoes
## Table of Contents
- [Build Instructions](#build-instruction)
- **Documents** 
  - [Documents](/docs/README.md)
  - [TODO List](/docs/plan/TODO.md)
- **Diagrams**
  - [ER Diagrams](/docs/plan/diagrams/er.md)
  - [View Diagrams](/docs/plan/diagrams/view.md)
  - [State Diagrams](/docs/plan/diagrams/state.md)
  - [UI Diagrams](/docs/plan/diagrams/ui.md)

---
## Build Instruction
1) in working project folder directory enter in terminal/bash: `npm install` to downloaded all necessary dependencies
```bash
$ npm install
```
2) in working project folder directory enter in terminal/bash:
```bash
$ touch .env
```
  - this will create a file where you can place your environment variables

3) open the `.env` file and enter in your environment variables as followed
```bash
# can be changed to a port you'll be using:
PORT=3000

# reference: https://www.omdbapi.com , requires api key
OMDB_API_KEY=your_api_key

# DB Connection Info
QUOTE_DB_HOST=host_name_goes_here
QUOTE_DB_USER=db_username_goes_here
QUOTE_DB_PASSWORD=db_password_goes_here
QUOTE_DB_NAME=db_name_goes_here
```
4) if you look at the `package.json` file, you'll see that I've included some scripts to make some commands easier to remember, you can call them using `npm run script-name`
for example: the call for `nodemon index.js` to run the server is just:
```bash
$ npm run server
```

5) Bootstrap has also been installed if you wish to make changes, ie customize themes etc. run these two scripts in a seperate terminal to see build changes made, and for it to watch for any changes made.
```bash
npm run build-css
npm run watch-css
```
---