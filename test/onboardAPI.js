'use strict';

var OnboardIQ = require('../index');

var client = new OnboardIQ.Client('5MX5Mf_OEthuf-ecuku7xA', 'v1');

// client.addApplicant({
//   name: 'Jake',
//   email: 'jake@gmail.com',
//   phone_number: '5034834844',
//   any: 'other',
//   keys: 'that you might want'
// }).then(function(status, resp) {
//   console.log(resp);
// });

// client.listApplicants().then(function(resp) {
//   console.log(resp);
// });

client.updateApplicant('1676b7488094580c', {
  name: 'Stephen'
}).then(function(resp) {
  console.log(resp);
});
