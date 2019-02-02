"use strict";

const express = require("express");
// we'll use morgan to log the HTTP layer
const morgan = require("morgan");
const mongoose = require('mongoose');
// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;
// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');
const {blogPosts} = require('./models');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
// "The first detail to note is that we're using body-parser's
// JSON-parser to parse the JSON data sent by clients."
const bodyParser = require("body-parser");
// "jsonParser is a piece of middleware that we supply as a
// second argument to our route handler below."
const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));
app.use(express.json());






// app.use routes requests to /blogPostsRouter
// to the blogPostsRouter const
app.use('/blogPostsRouter', blogPostsRouter);

// app.listen
app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });