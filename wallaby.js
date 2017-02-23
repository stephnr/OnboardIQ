'use strict';

module.exports = function(wallaby) {
  return {
    files: [
      'index.js',
      { pattern: 'test/mockEndpoints.js', instrument: false },
      { pattern: 'test/mocks/**', instrument: false },
      { pattern: 'test/**/*.spec.js', ignore: true }
    ],

    tests: [
      'test/**/*.spec.js'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  };
};
