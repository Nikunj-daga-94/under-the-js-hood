const MyPromise = require('../dist/index.js');
const { describe, it } = require('mocha');
const { expect } = require('chai');

// Promises/A+ Compliance Adapter
const adapter = {
  deferred() {
    let resolve, reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  },
  resolved: MyPromise.resolve,
  rejected: MyPromise.reject
};

// Export the adapter for promises-aplus-tests
module.exports = adapter;

// Run the tests if this file is executed directly
if (require.main === module) {
  const promisesAplusTests = require('promises-aplus-tests');
  
  describe('Promises/A+ Tests', function() {
    this.timeout(10000); // Increase timeout for tests
    
    it('should pass all Promises/A+ tests', function(done) {
      promisesAplusTests(adapter, { reporter: 'spec' }, function(err) {
        if (err) return done(err);
        done();
      });
    });
  });
}
