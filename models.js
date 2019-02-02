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

//add virtual to get and create author name
blogPostSchema.virtual('fullName').get( function() {
  const auth = this.author;
  return `${author.firstName} ${author.lastName}`;
  })
  .set(function( fullName ) {
  const [first, last] = fullName.split(' ');
  this.author.firstName = first;
  this.author.lastName = last;
});

//an instance method to return blogPostSchema
blogPostSchema.methods.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    author: this.fullName,
    content: this.content,
    created: this.created
  };
};

const BlogPosts = mongoose.model('Blogposts', blogPostSchema);

module.exports = {BlogPosts};