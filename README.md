# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
All shortened URLs can be accessed by anyone as long as they have the exact link. The app is user specific, so although anyone can see the URLs, only valid users can create, edit and delete their own urls.

## Final Product

!["The user's main page displays all the shortened URLs that they have created"](#)
!["All URLs can be seen by anyone, but only their creators can edit them"](#)
!["In order to create shortened URLs, users must have a registered account"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.