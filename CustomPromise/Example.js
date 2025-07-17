// Example usage
const p = new MyPromise((resolve) => {
    setTimeout(() => resolve('Hello'), 1000);
  });
  
  p.then(console.log); // After 1s: "Hello"


  const p1 = new MyPromise((resolve) => {
    setTimeout(() => resolve('Resolved after 1s'), 1000);
  });
  
  p1.then(value => {
    console.log(value); // "Resolved after 1s"
    return 'Chained value';
  })
  .then(value => {
    console.log(value); // "Chained value"
    throw new Error('Something went wrong');
  })
  .catch(error => {
    console.error(error.message); // "Something went wrong"
    return 'Recovered from error';
  })
  .finally(() => {
    console.log('Cleanup');
  });