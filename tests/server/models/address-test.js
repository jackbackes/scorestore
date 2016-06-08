var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));

var Sequelize = require('sequelize');
var Promise = require('sequelize').Promise;
var dbURI = 'postgres://localhost:5432/testingfsg';
var db = new Sequelize(dbURI, {
    logging: false
});

require('../../../server/db/models/address')(db);

var Address = db.model('address');

describe('Address Model', function () {

    beforeEach('Sync DB', function () {
       return db.sync({ force: true });
    });


       describe('Validations', function () {

            it('throws an error if firstName is not provided', function() {
                var address = Address.build({lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY', zipCode: '10001'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'firstName');
                });
            });
       

            it('throws an error if lastName is not provided', function() {
                var address = Address.build({firstName: 'John', address: '1 Main Street', city: 'New York', State: 'NY', zipCode: '10001'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'lastName');
                });
            });

            it('throws an error if address is not provided', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', city: 'New York', State: 'NY', zipCode: '10001'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'address');
                });
            });

            it('throws an error if city is not provided', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', address: '1 Main Street', State: 'NY', zipCode: '10001'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'city');
                });
            });

            it('throws an error if state is not provided', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', zipCode: '10001'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'state');
                });
            });

            it('throws an error if zipCode is not provided', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'zipCode');
                });
            });

            it('throws an error if zipCode is not provided', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY'});
                return address.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'zipCode');
                });
            });

            it('throws an error if length of zipCode is not 5', function() {
                var address = Address.build({firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY', zipCode: 1100});
                return address.save()
                .then(function () {
                    throw Error('Promise should have rejected');
                  }, function (err) {
                    expect(err).to.exist;
                    expect(err.message).to.contain('len failed');
                  });
            });


        });

       

});