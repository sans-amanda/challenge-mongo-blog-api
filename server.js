"use strict";

const express = require("express");
// we'll use morgan to log the HTTP layer
const morgan = require("morgan");
const mongoose = require("mongoose");
// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;
// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require("./config");
const {BlogPosts} = require("./models");
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
app.use(morgan("common"));
app.use(express.json());

//app.get posts
app.get("/posts", (req, res) => {
  BlogPosts
    .find()
    .then(posts => {
      res.json(
        posts.map(
          post => post.serialize())
        );
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    });
});

//app.get posts by id
app.get("/posts/:id", (req, res) => {
  BlogPosts
    .findById(req.params.id)
    .then(post =>
      res.json(
        post.serialize()
      )
    )
    .catch(err => {
      console.error(err);
        res.status(500).json({message: "Internal server error"});
    });
});

//app.post to post
app.post("/posts", (req, res) => {
  const requiredFields = ["title", "author", "content"];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  BlogPosts
    .create({
      title: req.body.title,
      author: req.body.author,
      content: req.body.content
    })
    .then(
      blogPosts => res.status(201).json(blogPosts.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Internal server error"});
    });
});


//app.delete post by id
app.delete("/posts/:id", (req, res) => {
  BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});

//app.put to update post
app.put("/posts/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ["title", "author", "content"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



//connect to database, start server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// closes the server, and returns a promise
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };