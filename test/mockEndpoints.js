'use strict';

var nock = require('nock');
var rootURL = 'https://www.onboardiq.com/api';

var mockApplicant = require('./mocks/applicant.json');
var mockApplicantLabels = require('./mocks/applicantLabels.json');

var APPLICANT_TEST_URL = /\/v1\/applicants\/[^(404)]*/;
var APPLICANT_LABELS_TEST_URL = /\/v2\/applicants\/[^(404)].*\/labels/;
var APPLICANT_V2_TEST_URL = /\/v2\/applicants\/[^(404)]*/;

nock.disableNetConnect();

// Get Applicant
nock(rootURL)
.get(APPLICANT_TEST_URL)
.reply(200, mockApplicant);

nock(rootURL)
.get(APPLICANT_V2_TEST_URL)
.reply(200, mockApplicant);

// Create Applicant
nock(rootURL)
.post(APPLICANT_TEST_URL)
.reply(201, mockApplicant);

nock(rootURL)
.post(APPLICANT_V2_TEST_URL)
.reply(201, mockApplicant);

// Update Applicant
nock(rootURL)
.put(APPLICANT_TEST_URL)
.reply(200, mockApplicant);

nock(rootURL)
.put(APPLICANT_V2_TEST_URL)
.reply(200, mockApplicant);

// List Applicants
nock(rootURL)
.get('/v1/applicants/')
.reply(200, mockApplicant);

nock(rootURL)
.get('/v2/applicants/')
.reply(200, mockApplicant);

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

nock(rootURL)
.delete(APPLICANT_V2_TEST_URL)
.reply(200, {});

nock(rootURL)
.get(APPLICANT_LABELS_TEST_URL)
.reply(200, mockApplicantLabels);

nock(rootURL)
.put(APPLICANT_LABELS_TEST_URL)
.reply(200, function(uri) {
  return mockApplicantLabels[0].title = uri.substring(uri.lastIndexOf('/'));
});
