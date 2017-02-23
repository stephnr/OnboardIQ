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

  describe('V1', function() {
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

      it('should be able to fetch an applicant', function() {
        Client.getApplicant(12).then(function(resp) {
          assert.deepEqual(resp.data, mockApplicant);
        });
      });

      it('should be able to update an applicant', function() {
        Client.updateApplicant(newApplicant.key, {
          name: 'John'
        }).then(function(resp) {
          assert.equal(resp.data.name, 'John');
          newApplicant = resp.data;
        });
      });

      it('should be able to list applicants', function() {
        var applicants, key, found = false;

        Client.listApplicants().then(function(resp) {
          assert.isDefined(resp);
        });
      });

      it('should be able to delete an applicant', function() {
        Client.deleteApplicant(12).then(function(resp) {
          expect(resp.statusCode).to.match(/^20(0|1)$/);
        });
      });
    });
  });

  describe('V2', function() {
    var ClientV2 = {};

    beforeEach(function() {
      ClientV2 = new OnboardIQ.Client('XXX', 'v2');
    });

    describe('Methods', function() {
      it('should exist', function() {
        expect(ClientV2).to.have.property('getApplicant');
        expect(ClientV2).to.have.property('addApplicant');
        expect(ClientV2).to.have.property('updateApplicant');
        expect(ClientV2).to.have.property('listApplicants');
        expect(ClientV2).to.have.property('deleteApplicant');
        expect(ClientV2).to.have.property('listApplicantsLabels');
        expect(ClientV2).to.have.property('updateApplicantsLabels');
        expect(ClientV2).to.have.property('listStagesLabels');
      });
    });

    describe('Applicants', function() {
      var newApplicant = {};
      var newLabel = {};

      before(function() {
        return ClientV2.addApplicant({
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

      it('should be able to fetch an applicant', function() {
        ClientV2.getApplicant(12).then(function(resp) {
          assert.deepEqual(resp.data, mockApplicant);
        });
      });

      it('should be able to update an applicant', function() {
        ClientV2.updateApplicant(newApplicant.id, {
          name: 'John'
        }).then(function(resp) {
          assert.equal(resp.data.name, 'John');
          newApplicant = resp.data;
        });
      });

      it('should be able to list applicants', function() {
        var applicants, key, found = false;

        ClientV2.listApplicants().then(function(resp) {
          assert.isDefined(resp);
        });
      });

      it('should be able to delete an applicant', function() {
        ClientV2.deleteApplicant(12).then(function(resp) {
          expect(resp.statusCode).to.match(/^20(0|1)$/);
        });
      });

      it('should be able to update an applicants labels', function() {
        ClientV2.updateApplicantsLabels(newApplicant.id, 'Test Label', true).then(function(resp) {
          assert.equal(resp.data.title, 'Test Label');
          newLabel = resp.data;
        });
      });

      it('should be able to list an applicants labels', function() {
        var labels, key, found = false;
        ClientV2.listApplicantsLabels(newApplicant.id).then(function(resp) {
          labels = resp.data.labels;
          key = 'id';

          labels.forEach(function(el) {
            if(el[key] === newLabel[key]) {
              found = true;
            }
          });

          assert.isTrue(found, 'the record exists');
        });
      });

      // TODO: implement tests for Client.listStagesLabels()
    });
  });

});
