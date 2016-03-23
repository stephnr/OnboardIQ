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
      expect(Client).to.have.property('listApplicantsLabels');
      expect(Client).to.have.property('updateApplicantsLabels');
      expect(Client).to.have.property('listStagesLabels');
    });
  });

  describe('Applicants', function() {
    var newApplicant = {};
    var newLabel = {};

    before(function() {
      return Client.addApplicant({
        name: 'Jake',
        email: 'jake@gmail.com',
        phone_number: '5034834844',
        any: 'other',
        keys: 'that you might want',
        data: {state: 'Test'}
      }).then(function(resp) {
        expect(resp.statusCode).to.match(/^20(0|1)$/);
        newApplicant = resp.data;
        return newApplicant;
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
        if(process.env.API_VERSION === 'v2') {
          applicants = resp.data.applicants;
          key = 'id';
        } else {
          applicants = resp.data;
          key = 'key';
        }

        applicants.forEach(function(el) {
          if(el[key] === newApplicant[key]) {
            found = true;
          }
        });

        assert.isTrue(found, 'the record exists');
      });
    });

    it('should be able to update an applicants labels', function() {
      var key = process.env.API_VERSION === 'v2' ? newApplicant.id : newApplicant.key;

      Client.updateApplicantsLabels(key, 'Test Label', true).then(function(resp) {
        assert.equal(resp.data.title, 'Test Label');
        newLabel = resp.data;
      });
    });

    it('should be able to list an applicants labels', function() {
      var applicant_id = process.env.API_VERSION === 'v2' ? newApplicant.id : newApplicant.key;
      var labels, key, found = false;
      Client.listApplicantsLabels(applicant_id).then(function(resp) {
        if(process.env.API_VERSION === 'v2') {
          labels = resp.data.labels;
          key = 'id';
        } else {
          labels = resp.data;
          key = 'key';
        }

        labels.forEach(function(el) {
          if(el[key] === newLabel[key]) {
            found = true;
          }
        });

        assert.isTrue(found, 'the record exists');
      });
    });

    // TODO: implement tests for Client.listStagesLabels()

    after(function() {
      var key = process.env.API_VERSION === 'v2' ? 'id' : 'key';

      return Client.deleteApplicant(newApplicant[key]).then(function(resp) {
        expect(resp.statusCode).to.match(/^20(0|4)$/);
        return resp;
      });
    });

  });
});
