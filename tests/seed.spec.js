// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');
var dbURI = 'postgres://localhost:5432/testing-fsg';
var db = new Sequelize(dbURI, {
    logging: false
});

require('../seed.js');


describe('Seed File', function(){
  it('does not throw an error')
  describe('Users', function(){
    it('populates a non-admin user');
    it('populates an admin user');
    it('populates a guest user');
    it('guest user only has email')
  });

  describe('Songs', function(){
    it('populates at least five songs')
    it('are associated with composers')
  })

  describe('Composers', function(){
    it('populates at least three composers')
    it("one composer has no songs")
  })

  describe("Orders", function(){
    it('populates at least three orders')
    it('are associated with a user')
    it('at least one order is from a guest account')
    it('are associated with songs through the SongOrders table')
    it('have the correct number of songs')
    it('song orders have the correct quantities')
  })

  describe("Reviews", function(){
    it("populates at least three reviews")
    it("reviews are associated with a song")
    it("reviews belong to a user")
    it("there is a song that has two reviews")
  })

})
