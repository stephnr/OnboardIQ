'use strict';

/*===============================
=            MODULES            =
===============================*/

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
// Load API module
var OnboardIQ = require('../');

// Mock endpoint calls
require('./mockEndpoints');

// Mock data
var mockApplicant = require('./mocks/applicant.json');

/*=====  End of MODULES  ======*/

describe('OnboardIQ', function() {
  var Client = {};

  beforeEach(function() {
    Client = new OnboardIQ.Client('XXX', 'v1');
  });

  describe('Methods', function() {
    it('should exist', function() {
      expect(Client).to.have.property('getApplicant');
      expect(Client).to.have.property('addApplicant');
      expect(Client).to.have.property('updateApplicant');
      expect(Client).to.have.property('listApplicants');
      expect(Client).to.have.property('deleteApplicant');
    });
  });

  describe('Applicants', function() {
    var newApplicant = {};

    before(function() {
      return Client.addApplicant({
        name: 'Jake',
        email: 'jake@gmail.com',
        phone_number: '5034834844',
        any: 'other',
        keys: 'that you might want'
      }).then(function(resp) {
        expect(resp.statusCode).to.match(/^20(0|1)$/);
        newApplicant = resp.data;
        return newApplicant;
      });
    });

    it('should be able to fetch an applicant', function() {
      Client.getApplicant(12).then(function(resp) {
        assert.equal(resp.data, mockApplicant);
      });
    });

    it('should be able to update an applicant', function() {
      var key = process.env.API_VERSION === 'v2' ? newApplicant.id : newApplicant.key;

      Client.updateApplicant(key, {
        name: 'John'
      }).then(function(resp) {
        assert.equal(resp.data.name, 'John');
        newApplicant = resp.data;
      });
    });

    it('should be able to list applicants', function() {
      var applicants, key, found = false;

      Client.listApplicants().then(function(resp) {
        assert.exists(resp);
      });
    });

    it('should be able to delete an applicant', function() {
      Client.deleteApplicant(12).then(function(resp) {
        expect(resp.statusCode).to.match(/^20(0|1)$/);
      });
    });
  });
});
