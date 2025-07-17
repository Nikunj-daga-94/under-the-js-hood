# Custom Promise Implementation

A complete implementation of the Promise/A+ specification with additional ES6+ features, written in vanilla JavaScript.

## Features

- Full Promise/A+ specification compliance
- ES6+ Promise features including:
  - Constructor with executor
  - Chaining with `.then()`
  - Error handling with `.catch()`
  - Cleanup with `.finally()`
- Static methods:
  - `MyPromise.resolve()`
  - `MyPromise.reject()`
  - `MyPromise.all()`
  - `MyPromise.race()`
  - `MyPromise.allSettled()`
  - `MyPromise.any()`
- Unhandled rejection tracking
- Comprehensive error handling
- Memory leak prevention

## Installation

```bash
# Using npm
npm install @yourusername/custom-promise

# Or using yarn
yarn add @yourusername/custom-promise
```

## Usage

### Basic Usage

```javascript
const MyPromise = require('./MyPromise');

const promise = new MyPromise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise
  .then(result => {
    console.log(result); // "Success!"
    return 'Chained value';
  })
  .then(value => {
    console.log(value); // "Chained value"
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Operation completed');
  });
```

### Static Methods

#### MyPromise.all()

```javascript
const p1 = MyPromise.resolve(1);
const p2 = 2;
const p3 = new MyPromise((resolve) => {
  setTimeout(resolve, 1000, 3);
});

MyPromise.all([p1, p2, p3])
  .then(values => {
    console.log(values); // [1, 2, 3]
  });
```

#### MyPromise.race()

```javascript
const p1 = new Promise((resolve) => {
  setTimeout(resolve, 500, 'one');
});
const p2 = new Promise((resolve) => {
  setTimeout(resolve, 100, 'two');
});

MyPromise.race([p1, p2])
  .then(value => {
    console.log(value); // "two" (faster)
  });
```

#### MyPromise.allSettled()

```javascript
const p1 = MyPromise.resolve(1);
const p2 = MyPromise.reject('Error occurred');
const p3 = new Promise((resolve) => {
  setTimeout(resolve, 1000, 3);
});

MyPromise.allSettled([p1, p2, p3])
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'Error occurred' },
    //   { status: 'fulfilled', value: 3 }
    // ]
  });
```

#### MyPromise.any()

```javascript
const p1 = Promise.reject('Error 1');
const p2 = new Promise((resolve) => {
  setTimeout(resolve, 100, 'Success!');
});

MyPromise.any([p1, p2])
  .then(value => {
    console.log(value); // "Success!"
  })
  .catch(error => {
    console.error(error.errors); // ['Error 1']
  });
```

## Error Handling

The implementation includes comprehensive error handling:

- Type checking for input parameters
- Protection against circular references
- Unhandled rejection tracking
- Proper error propagation through the chain

```javascript
new MyPromise((resolve, reject) => {
  throw new Error('Something went wrong');
})
  .then(() => console.log('This will not run'))
  .catch(error => {
    console.error('Caught error:', error.message); // "Something went wrong"
  });
```

## Unhandled Rejections

Unhandled rejections are tracked and can be handled globally:

```javascript
MyPromise.onUnhandledRejection = (error, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', error);
  // Optionally report to error tracking service
};

new MyPromise((resolve, reject) => {
  reject(new Error('This will be caught by the global handler'));
});
```

## Testing

The implementation includes a test suite that verifies compliance with the Promise/A+ specification:

```bash
npm test
```

## Browser Support

The implementation works in all modern browsers and Node.js environments. For older browsers, you may need to include polyfills for:

- `Symbol.iterator`
- `Object.defineProperty` (for getters/setters)
- `queueMicrotask` (or use a polyfill)

## Performance

The implementation is optimized for performance with:

- Minimal memory usage
- Efficient callback handling
- Prevention of memory leaks
- Lazy initialization where possible

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Nikunj Daga - [Nikunj Daga](https://github.com/Nikunj-daga-94)

