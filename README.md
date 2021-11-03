⚠️WARNING: This module is no longer being maintained as the OnboardIQ API now deprecated ⚠️

# OnboardIQ [![GitHub version](https://badge.fury.io/gh/stephn-r%2Fonboardiq.svg)](https://badge.fury.io/gh/stephn-r%2Fonboardiq) [![npm version](https://badge.fury.io/js/onboardiq.svg)](https://badge.fury.io/js/onboardiq)
A node.js client for the OnboardIQ API

**This module is a third-party Client API and not supported by OnboardIQ**

## Table of Contents

* [Install](#install)
* [Getting Started](#getting-started)
* [Endpoints](#endpoints)
* [Callbacks](#callbacks)
* [Error Handling](#error-handling)
* [Support](#support)
* [Tests](#tests)
* [License](#license)

## Install

```sh
$ npm install onboardiq
```

## Getting Started

The module supports all OnboardIQ API v1 endpoints. For complete information about the api, head to the API Docs: [v1](https://onboardiq.readme.io/docs/applicants) or [v2](https://www.onboardiq.com/docs/apiv2/api/v2/applicants-GET.html)

## Endpoints

All endpoints return a JS Promise. See [Callbacks](#callbacks) for more details

```js
var OnboardIQ = require('onboardiq');
var Client = new OnboardIQ.Client(API_TOKEN, API_VERSION);

// Creates a new applicant
Client.addApplicant(params);

// Modifies an existing applicant
Client.updateApplicant(id, params);

// Lists all applicants
Client.listApplicants();

// Deletes an existing applicant
Client.deleteApplicant(id);

```

## Callbacks

All endpoints return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Below is a successful example on how to consume a Promise:

```js
Client.listApplicants().then(function(resp) {
  // do something with the resp
});
```

All endpoints return a response object. An example object is shown below. The return data is the information returned by the OnboardIQ API. Please refer to their docs on how to consume it >> [v1](https://onboardiq.readme.io/docs/applicants) or [v2](https://www.onboardiq.com/docs/apiv2/api/v2/applicants-GET.html)

```json
{
	"statusCode": 200,
	"data": {}
}
```

## Error Handling

If an error occurs with executing an API endpoint. Please use the `.catch` Promise method to handle it. Below is an example. The returned error is from OnboardIQ. Please refer to their docs on how to consume it >> [v1](https://onboardiq.readme.io/docs/applicants) or [v2](https://www.onboardiq.com/docs/apiv2/api/v2/applicants-GET.html).

**It is a good practice to have a catch method call on all executed Promises!**

```js
Client.listApplicants().then(function(resp) {
  // do something with the resp
}).catch(function(err) {
  // do something with the error
});
```

## Support

Please refer to the [Contributing.md](https://github.com/Stephn-R/OnboardIQ/blob/master/CONTRIBUTING.md) docs for more info

## Tests

Copy the ENV file and add your API confidentials for OnboardIQ

```sh
cp .env.example .env
```

Then run the tests

```sh
npm test
```

## License

See [License](https://github.com/Stephn-R/OnboardIQ/blob/master/LICENSE)
