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

  this.apiToken = apiToken;
  this.uri = 'https://www.onboardiq.com/api/' + env;
};

/*=====  End of CONSTRUCTOR  ======*/


/*===============================
=            METHODS            =
===============================*/

OnboardIQ.Client.prototype.getApplicant = function(id, params) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'GET', params);
};

OnboardIQ.Client.prototype.addApplicant = function(params) {
  var uri = this.uri + '/applicants';
  return this._constructPromiseRequest(uri, 'POST', params);
};

OnboardIQ.Client.prototype.updateApplicant = function(id, params) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'PUT', params);
};

OnboardIQ.Client.prototype.listApplicants = function(params) {
  var uri = this.uri + '/applicants';
  return this._constructPromiseRequest(uri, 'GET', params);
};

OnboardIQ.Client.prototype.deleteApplicant = function(id, params) {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'DELETE', params);
};

/*=====  End of METHODS  ======*/


/*=======================================
=            PRIVATE METHODS            =
=======================================*/

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
