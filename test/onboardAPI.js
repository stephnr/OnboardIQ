'use strict';

/*===============================
=            MODULES            =
===============================*/

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
// Load API module
var OnboardIQ = require('../index');
// Load env props
require('dotenv').config();

/*=====  End of MODULES  ======*/

describe('OnboardIQ', function() {
  var Client = {};

  beforeEach(function() {
    Client = new OnboardIQ.Client(process.env.PRIVATE_API_KEY, process.env.API_VERSION);
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

    beforeEach(function() {
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

    it('should be able to update an applicant', function() {
      if(process.env.API_VERSION === 'v2') {
        Client.updateApplicant(newApplicant.id, {
          name: 'John'
        }).then(function(applicant) {
          assert.equal(applicant.data.name, 'John');
          newApplicant = applicant;
        });
      } else {
        Client.updateApplicant(newApplicant.key, {
          name: 'John'
        }).then(function(applicant) {
          assert.equal(applicant.data.name, 'John');
          newApplicant = applicant;
        });
      }
    });

    it('should be able to list applicants', function() {
      if(process.env.API_VERSION === 'v2') {
        Client.listApplicants().then(function(resp) {
          var found = false;

          resp.applicants.forEach(function(el) {
            if(el.id === newApplicant.id) {
              found = true;
            }
          });

          assert.isTrue(found, 'the record exists');
        });
      } else {
        Client.listApplicants().then(function(resp) {
          var found = false;

          resp.data.forEach(function(el) {
            if(el.key === newApplicant.key) {
              found = true;
            }
          });

          assert.isTrue(found, 'the record exists');
        });
      }
    });

    afterEach(function() {
      if(process.env.API_VERSION === 'v2') {
        return Client.deleteApplicant(newApplicant.id).then(function(resp) {
          expect(resp.statusCode).to.match(/^20(0|4)$/);
          return resp;
        });
      } else {
        return Client.deleteApplicant(newApplicant.key).then(function(resp) {
          assert.equal(resp.statusCode, 200, 'successfully deleted applicant');
          return resp;
        });
      }
    });
  });
});

// client.listApplicants().then(function(resp) {
// });

// client.updateApplicant('1676b7488094580c', {
//   name: 'Stephen'
// }).then(function(resp) {
// });
