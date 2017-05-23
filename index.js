// ────────────────────────────────────────────────────────────────────────────────
// MODULES

const _ = require('lodash');
const request = require('request');
const Promise = require('bluebird');

// ────────────────────────────────────────────────────────────────────────────────
// ONBOARD MODULE

const OnboardIQ = module.exports = {};

// ────────────────────────────────────────────────────────────────────────────────
// CONSTRUCTOR

OnboardIQ.Client = (apiToken, env) => {
  if (_.isNil(apiToken)) {
    throw new Error('Missing OnboardIQ API Token');
  }

  if (_.isNil(env)) {
    throw new Error('Missing OnboardIQ API Version');
  } else if (!env.match(/^(v1|v2)$/)) {
    throw new Error('Invalid version for OnboardIQ API');
  }

  this.env = env;
  this.apiToken = apiToken;
  this.uri = 'https://www.onboardiq.com/api/' + env;
};

// ────────────────────────────────────────────────────────────────────────────────
// SHARED API METHODS

OnboardIQ.Client.prototype.getApplicant = (id, params) => {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'GET', params);
};

OnboardIQ.Client.prototype.addApplicant = (params) => {
  var uri = this.uri + '/applicants/';
  return this._constructPromiseRequest(uri, 'POST', params);
};

OnboardIQ.Client.prototype.updateApplicant = (id, params) => {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'PUT', params);
};

OnboardIQ.Client.prototype.listApplicants = () => {
  var uri = this.uri + '/applicants/';
  return this._constructPromiseRequest(uri, 'GET', null);
};

OnboardIQ.Client.prototype.deleteApplicant = (id) => {
  var uri = this.uri + '/applicants/' + id;
  return this._constructPromiseRequest(uri, 'DELETE', null);
};

// ────────────────────────────────────────────────────────────────────────────────
// V2 ONLY METHODS

OnboardIQ.Client.prototype.listApplicantsLabels = (id) => {
  var uri = this.uri + '/applicants/' + id + '/labels';
  return this._executeV2OnlyRequest(uri, 'GET', null);
};

// ────────────────────────────────────────────────────────────────────────────────
// PRIVATE METHODS

OnboardIQ.Client.prototype._executeV2OnlyRequest = (uri, method, params) => {
  if (this.env === 'v1') {
    throw new Error('Attempted to access a v2 only API endpoint');
  } else {
    return this._constructPromiseRequest(uri, method, params);
  }
};

OnboardIQ.Client.prototype._constructPromiseRequest = (uri, method, params) => {
  var Client = this;

  return new Promise((resolve, reject) => {
    Client._authenticatedRequest({
      uri: uri,
      method: method,
      body: params
    }, resolve, reject);
  });
};

OnboardIQ.Client.prototype._authenticatedRequest = (options, resolve, reject) => {
  request({
    uri: options.uri,
    method: options.method,
    json: _.extend({
      api_token: this.apiToken
    }, options.body)
  }, (err, res, body) => {
    _handleAPIResponse(err, res, body, resolve, reject);
  });
};

function _handleAPIResponse (err, res, body, resolve, reject) {
  var $body = {};

  if (res) {
    $body.statusCode = res.statusCode;
    $body.data = body;
  }

  return err ? reject(err) : resolve($body);
}
