'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../../app/');
var mongo = require('../../lib/mongo/');
var Post = require('./post');

describe('Post Routes', function () {

  before(function (done) {
    mongo.connect(function () {
      var seedPosts = [
        {text: 'Foo'},
        {text: 'Bar'}
      ];

      Post.collection.insertMany(seedPosts, done);
    });
  });

  after(function (done) {
    Post.dropCollection(done);
  });

  describe('GET /', function () {
    it('should respond with posts', function (done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.contain('Foo');
          expect(res.text).to.contain('Bar');
          done();
        });
    });
  });

  describe('POST /post' , function () {
    it('should create a post', function (done) {
      Post.count(function (err, count) {
        expect(count).to.equal(2);

        request(app)
          .post('/post')
          .field('text', 'Baz')
          .expect(302)
          .expect('Moved Temporarily. Redirecting to /')
          .end(function (err) {
            if (err) throw err;
            Post.count(function (err, count) {
              expect(count).to.equal(3);
              done();
            });
          });
      });
    });
  });
});