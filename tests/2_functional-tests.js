/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

var testId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  test('#example Test GET /api/books', function(done){
    assert.fail();
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });  
  });
  
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Galapagos'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'should have property title');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.equal(res.body.title, 'Galapagos');
            testId = res.body._id;
            done();
          });     
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no title given');
            done();
          });
      }); 
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/fake_id_not_in_database')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + testId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.comments, 'comments should be an array');
          assert.property(res.body, 'commentcount');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.equal(res.body.title, 'Galapagos');
          assert.equal(res.body._id, testId);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testId)
          .send({
            _id: testId,
            comment: 'a cool comment'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.equal(res.body._id, testId);
            assert.equal(res.body.comments[0], 'a cool comment');
            done();
          });    
      });
      
    });

  });

});
