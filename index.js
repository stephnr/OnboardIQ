'use strict';

/*===============================
=            MODULES            =
===============================*/

var _ = require('lodash');
var request = require('request');
var Promise = require('bluebird');

/*=====  End of MODULES  ======*/

var OnboardIQ = module.exports = {};

/*===================================
=            CONSTRUCTOR            =
===================================*/

OnboardIQ.Client = function(apiToken, env) {
  if(_.isNil(apiToken)) {
    throw new Error('Missing OnboardIQ API Token');
  }

  if(_.isNil(env)) {
    throw new Error('Missing OnboardIQ API Version');
  } else if(!env.match(/^(v1|v2)$/)) {
    throw new Error('Invalid version for OnboardIQ API');
  }

  this.env = env;
  this.apiToken = apiToken;
  this.uri = 'https://www.onboardiq.com/api/' + env;
};

/*=====  End of CONSTRUCTOR  ======*/


/*==========================================
=            SHARED API METHODS            =
==========================================*/

OnboardIQ.Client.prototype.getApplicant = function(id, params) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'GET', params);
};

OnboardIQ.Client.prototype.addApplicant = function(params) {
  var uri = this.uri + '/applicants/';
  return this._constructPromiseRequest(uri, 'POST', params);
};

OnboardIQ.Client.prototype.updateApplicant = function(id, params) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'PUT', params);
};

OnboardIQ.Client.prototype.listApplicants = function() {
  var uri = this.uri + '/applicants/';
  return this._constructPromiseRequest(uri, 'GET', null);
};

OnboardIQ.Client.prototype.deleteApplicant = function(id) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'DELETE', null);
};

/*=====  End of SHARED API METHODS  ======*/

/*=======================================
=            V2 ONLY METHODS            =
=======================================*/

OnboardIQ.Client.prototype.listApplicantsLabels = function(id) {
  var uri = this.uri + '/applicants/' + id + '/labels';
  return this._executeV2OnlyRequest(uri, 'GET', null);
};

OnboardIQ.Client.prototype.updateApplicantsLabels = function(id, title, completed) {
  var uri = this.uri + '/applicants/' + id + '/labels/' + title;
  return this._executeV2OnlyRequest(uri, 'PUT', {completed: completed});
};

OnboardIQ.Client.prototype.listStagesLabels = function(id) {
  var uri = this.uri + '/stages/' + id + '/labels';
  return this._executeV2OnlyRequest(uri, 'GET', null);
};

/*=====  End of V2 ONLY METHODS  ======*/


/*=======================================
=            PRIVATE METHODS            =
=======================================*/

OnboardIQ.Client.prototype._executeV2OnlyRequest = function(uri, method, params) {
  if(this.env === 'v1') {
    throw new Error('Attempted to access a v2 only API endpoint');
  } else {
    return this._constructPromiseRequest(uri, method, params);
  }
};

OnboardIQ.Client.prototype._constructPromiseRequest = function(uri, method, params) {
  var Client = this;

  return new Promise(function(resolve, reject) {
    Client._authenticatedRequest({
      uri:    uri,
      method: method,
      body:   params
    }, resolve, reject);
  });
};

OnboardIQ.Client.prototype._authenticatedRequest = function(options, resolve, reject) {
  request({
    uri:    options.uri,
    method: options.method,
    json: _.extend({
      api_token: this.apiToken
    }, options.body)
  }, function(err, res, body) {
    _handleAPIResponse(err, res, body, resolve, reject);
  });
};

function _handleAPIResponse(err, res, body, resolve, reject) {
  var $body = {};

  if(res) {
    $body.statusCode = res.statusCode;
    $body.data = body;
  }

  return err ? reject(err) : resolve($body);
}

/*=====  End of PRIVATE METHODS  ======*/
