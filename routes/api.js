/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

//const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
//I'm using mongoose - don't know how to connect without it
mongoose.connect(process.env.DB, { useNewUrlParser: true });

var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: {type: String, required: true},
  commentcount: Number,
  comments: [String]
});

var bookModel = mongoose.model('bookModel', bookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
    bookModel.find({}, function(err, doc){
      if (err) { return res.send("error accessing database"); }
      var commentcount = 0;
      res.send(doc);
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
    
      if(!title) { return res.send("no title given"); }  
    
      var newBook = new bookModel({
        title: req.body.title,
        commentcount: 0
      });
    
      newBook.save(function(err, doc){
        if (err) { return res.send("error saving to database"); }
        res.json({ _id: doc._id, title: doc.title, commentcount: 0, comments: []});
      });
      //response will contain new book object including at least _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      bookModel.deleteMany({}, function(err){
        if (err) { return res.send("error deleting"); }
        res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      bookModel.findById(req.params.id, function(err, doc){
        if (err) { return res.send("no book exists"); }
        if (!doc) { return res.send("no book exists"); }
        res.send(doc);
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;

      if (!req.params.id) { return res.send("no book exists"); }  
    
      //json res format same as .get
      var query = bookModel.findById(req.params.id, function(err, doc){
        if (!doc) { return res.send("no book exists"); }
        var count = doc.commentcount + 1;
        doc.comments.push(req.body.comment);
        doc.commentcount++;
        doc.save(function (err){
          if (err) { return res.send("error adding comment to database"); }
          res.send(doc);
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      bookModel.findOneAndDelete({_id: req.params.id}, function(err){
        if (err) { return res.send("error deleting"); }
        res.send("delete successful");
      });
    });
  
};
