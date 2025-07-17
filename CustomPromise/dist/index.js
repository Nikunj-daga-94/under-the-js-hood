/*!
 * @nikunjdaga/promiz v1.0.0
 * (c) 2025 Nikunj Daga
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * A custom Promise implementation that follows the Promises/A+ specification
 * with additional ES6+ Promise features.
 * 
 * Features Implemented:
 * - Promise construction with executor
 * - Chaining with .then()
 * - Error handling with .catch()
 * - Cleanup with .finally()
 * - Static methods: resolve, reject, all, race, allSettled, any
 * - Unhandled rejection tracking
 * - Full TypeScript-like JSDoc documentation
 */

/**
 * @typedef {Object} UnhandledRejection
 * @property {Error} reason - The rejection reason
 * @property {MyPromise} promise - The promise that was rejected
 */

/**
 * A custom Promise implementation that follows the Promises/A+ specification
 * with additional ES6+ features.
 * 
 * @class MyPromise
 * @implements {PromiseLike}
 */
class MyPromise {
  static states = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
  };

  // Track unhandled rejections
  static unhandledRejections = (() => new Set())();

  /**
   * Global handler for unhandled rejections
   * @type {Function}
   * @param {Error} error - The rejection reason
   * @param {MyPromise} promise - The rejected promise
   */
  static onUnhandledRejection = (error, promise) => {
    console.warn('Unhandled promise rejection:', error);
  };

  /**
   * Create a new MyPromise
   * @param {Function} executor - Function with resolve and reject parameters
   * @throws {TypeError} If executor is not a function
   */
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise resolver must be a function');
    }
    this.state = MyPromise.states.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = value => {
      if (this.state !== MyPromise.states.PENDING) return;

      // Handle thenable
      if (value && (typeof value === 'object' || typeof value === 'function')) {
        try {
          const then = value.then;
          if (typeof then === 'function') {
            then.call(value, val => resolve(val), err => reject(err));
            return;
          }
        } catch (e) {
          reject(e);
          return;
        }
      }
      this.state = MyPromise.states.FULFILLED;
      this.value = value;
      this.triggerCallbacks();
    };
    const reject = reason => {
      if (this.state !== MyPromise.states.PENDING) return;
      this.state = MyPromise.states.REJECTED;
      this.reason = reason;

      // Track unhandled rejections
      MyPromise.unhandledRejections.add(this);
      queueMicrotask(() => {
        if (MyPromise.unhandledRejections.has(this)) {
          MyPromise.onUnhandledRejection(reason, this);
          MyPromise.unhandledRejections.delete(this);
        }
      });
      this.triggerCallbacks();
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * Trigger all pending callbacks
   * @private
   */
  triggerCallbacks() {
    if (this.state === MyPromise.states.FULFILLED) {
      this.onFulfilledCallbacks.forEach(cb => cb());
    } else if (this.state === MyPromise.states.REJECTED) {
      this.onRejectedCallbacks.forEach(cb => cb());
    }
    // Clear callbacks to prevent memory leaks
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }

  /**
   * Appends fulfillment and rejection handlers to the promise
   * @param {Function} [onFulfilled] - Optional fulfillment handler
   * @param {Function} [onRejected] - Optional rejection handler
   * @returns {MyPromise} A new promise
   */
  then(onFulfilled, onRejected) {
    // Handle non-function callbacks
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };
    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const handleRejected = () => {
        queueMicrotask(() => {
          MyPromise.unhandledRejections.delete(this);
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === MyPromise.states.FULFILLED) {
        handleFulfilled();
      } else if (this.state === MyPromise.states.REJECTED) {
        handleRejected();
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
    return promise2;
  }

  /**
   * Appends a rejection handler to the promise
   * @param {Function} onRejected - Rejection handler
   * @returns {MyPromise} A new promise
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * Appends a handler that's called when the promise is settled
   * @param {Function} onFinally - Handler to call when settled
   * @returns {MyPromise} A new promise
   */
  finally(onFinally) {
    return this.then(value => MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : onFinally).then(() => value), reason => MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : onFinally).then(() => {
      throw reason;
    }));
  }

  /**
   * The Promise.resolve() method returns a Promise object that is resolved with a given value
   * @param {*} value - Value to resolve
   * @returns {MyPromise} A resolved promise
   */
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  /**
   * The Promise.reject() method returns a Promise object that is rejected with a given reason
   * @param {*} reason - Reason for rejection
   * @returns {MyPromise} A rejected promise
   */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected
   * @param {Iterable} iterable - An iterable object such as an Array
   * @returns {MyPromise} A new Promise
   */
  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Argument is not iterable'));
      }
      const promises = Array.from(iterable);
      const results = new Array(promises.length);
      let remaining = promises.length;
      if (remaining === 0) return resolve(results);
      const onFulfilled = index => value => {
        results[index] = value;
        if (--remaining === 0) {
          resolve(results);
        }
      };
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(onFulfilled(index), reject);
      });
    });
  }

  /**
   * Returns a promise that resolves or rejects as soon as one of the promises in the iterable
   * resolves or rejects, with the value or reason from that promise
   * @param {Iterable} iterable - An iterable object such as an Array
   * @returns {MyPromise} A new Promise
   */
  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Argument is not iterable'));
      }
      for (const promise of iterable) {
        MyPromise.resolve(promise).then(resolve, reject);
      }
    });
  }

  /**
   * Waits for all promises to settle (each may resolve or reject)
   * @param {Iterable} iterable - An iterable object such as an Array
   * @returns {MyPromise} A new Promise that resolves after all promises settle
   */
  static allSettled(iterable) {
    return new MyPromise((resolve, reject) => {
      if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Argument is not iterable'));
      }
      const promises = Array.from(iterable);
      const results = new Array(promises.length);
      let remaining = promises.length;
      if (remaining === 0) return resolve(results);
      const onSettled = index => status => value => {
        results[index] = {
          status,
          value
        };
        if (--remaining === 0) {
          resolve(results);
        }
      };
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(onSettled(index)('fulfilled'), reason => onSettled(index)('rejected')(reason));
      });
    });
  }

  /**
   * Takes an iterable of Promise objects and, as soon as one of the promises in the iterable
   * fulfills, returns a single promise that resolves with the value from that promise
   * @param {Iterable} iterable - An iterable object such as an Array
   * @returns {MyPromise} A new Promise
   */
  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Argument is not iterable'));
      }
      const promises = Array.from(iterable);
      const errors = new Array(promises.length);
      let errorCount = 0;
      if (promises.length === 0) {
        return reject(new AggregateError([], 'No Promise in MyPromise.any was resolved'));
      }
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(resolve, error => {
          errors[index] = error;
          if (++errorCount === promises.length) {
            reject(new AggregateError(errors, 'No Promise in MyPromise.any was resolved'));
          }
        });
      });
    });
  }

  /**
   * Returns a string representation of the promise
   * @returns {string} The string representation
   */
  toString() {
    return `[object MyPromise]`;
  }

  // Make it iterable
  [Symbol.toStringTag] = 'MyPromise';

  /**
   * Resolve a promise with a value, handling thenables
   * @private
   */
  resolvePromise(promise, x, resolve, reject) {
    // Prevent circular references
    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // Prevent multiple calls to resolve/reject
    let called = false;
    if (x && (typeof x === 'object' || typeof x === 'function')) {
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return;
            called = true;
            this.resolvePromise(promise, y, resolve, reject);
          }, r => {
            if (called) return;
            called = true;
            reject(r);
          });
        } else {
          resolve(x);
        }
      } catch (e) {
        if (!called) {
          called = true;
          reject(e);
        }
      }
    } else {
      resolve(x);
    }
  }
}

// Export as default for ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyPromise;
  module.exports.default = MyPromise;
} else if (typeof define === 'function' && define.amd) {
  define([], () => ({
    default: MyPromise,
    __esModule: true
  }));
} else if (typeof window !== 'undefined') {
  window.MyPromise = MyPromise;
}

exports["default"] = MyPromise;
