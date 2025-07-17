const { expect } = require('chai');
const MyPromise = require('../../dist/index.js');

describe('MyPromise', function() {
  describe('Basic Functionality', function() {
    it('should create a pending promise', function() {
      const promise = new MyPromise(() => {});
      expect(promise.state).to.equal('pending');
    });

    it('should resolve with a value', function(done) {
      const value = 'test';
      const promise = new MyPromise((resolve) => {
        resolve(value);
      });
      
      promise.then((result) => {
        expect(result).to.equal(value);
        done();
      });
    });

    it('should reject with a reason', function(done) {
      const error = new Error('Failed');
      const promise = new MyPromise((_, reject) => {
        reject(error);
      });
      
      promise.catch((reason) => {
        expect(reason).to.equal(error);
        done();
      });
    });
  });

  describe('Static Methods', function() {
    it('should resolve with Promise.resolve', function(done) {
      const value = 'resolved';
      MyPromise.resolve(value).then((result) => {
        expect(result).to.equal(value);
        done();
      });
    });

    it('should reject with Promise.reject', function(done) {
      const error = new Error('rejected');
      MyPromise.reject(error).catch((reason) => {
        expect(reason).to.equal(error);
        done();
      });
    });

    it('should handle Promise.all', function(done) {
      const p1 = MyPromise.resolve(1);
      const p2 = 2;
      const p3 = new MyPromise((resolve) => {
        setTimeout(resolve, 100, 3);
      });

      MyPromise.all([p1, p2, p3]).then((results) => {
        expect(results).to.deep.equal([1, 2, 3]);
        done();
      });
    });

    it('should handle Promise.race', function(done) {
      const p1 = new MyPromise((resolve) => {
        setTimeout(resolve, 500, 'one');
      });
      const p2 = new MyPromise((resolve) => {
        setTimeout(resolve, 100, 'two');
      });

      MyPromise.race([p1, p2]).then((value) => {
        expect(value).to.equal('two');
        done();
      });
    });
  });

  describe('Chaining', function() {
    it('should chain then calls', function(done) {
      new MyPromise((resolve) => resolve(1))
        .then((value) => value + 1)
        .then((value) => {
          expect(value).to.equal(2);
          done();
        });
    });

    it('should handle errors with catch', function(done) {
      const error = new Error('Test Error');
      new MyPromise((_, reject) => reject(error))
        .then(() => {})
        .catch((err) => {
          expect(err).to.equal(error);
          done();
        });
    });

    it('should call finally after then', function(done) {
      let finallyCalled = false;
      new MyPromise((resolve) => resolve(1))
        .then((value) => {
          expect(value).to.equal(1);
          return value + 1;
        })
        .finally(() => {
          finallyCalled = true;
        })
        .then((value) => {
          expect(value).to.equal(2);
          expect(finallyCalled).to.be.true;
          done();
        });
    });
  });
});
