'use strict';

var nock = require('nock');
var rootURL = 'https://api.fountain.com';

var mockApplicant = require('./mocks/applicant.json');
var mockApplicantLabels = require('./mocks/applicantLabels.json');

var APPLICANT_TEST_URL = /\/v\d\/applicants\/[^(404)]*/;
var APPLICANT_LABELS_TEST_URL = /\/v\d\/applicants\/[^(404)]*\/labels/;

// Get Applicant
nock(rootURL)
.get(APPLICANT_TEST_URL)
.reply(200, mockApplicant);

// Create Applicant
nock(rootURL)
.post('/applicants/')
.reply(201, mockApplicant);

// Update Applicant
nock(rootURL)
.put(APPLICANT_TEST_URL)
.reply(200, mockApplicant);

// List Applicants
nock(rootURL)
.get('/applicants/')
.reply(200, mockApplicant);

// Delete Applicant
nock(rootURL)
.post(APPLICANT_TEST_URL)
.reply(200, {});

// Failed to get applicant
nock(rootURL)
.get('/applicants/404')
.reply(401, {
  message: 'Authentication is required'
});

// Delete an applicant
nock(rootURL)
.delete(APPLICANT_TEST_URL)
.reply(200, {});

// Delete an applicant
nock(rootURL)
.delete('/applicants/404')
.reply(401, {
  message: 'Authentication is required'
});

nock(rootURL)
.get(APPLICANT_LABELS_TEST_URL)
.reply(200, mockApplicantLabels);
