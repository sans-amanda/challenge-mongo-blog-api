'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogPostSchema = mongoose.Schema({
  // the `title` property is String type
  title: {type: String, required: true},
  // the `author` property is an array of string values
  author: [
    {firstName: String},
    {lastName: String}
  ],
  // the `content` property is String type
  content: {type: String, required: true},
  // the `content` type is a date, the default Date.now()` returns the current unix timestamp as a number
  created:  {type: Date, default: Date.now},

});


module.exports = {BlogPosts};