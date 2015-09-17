var run = require('..');

run(
  function (a, b) {
    return new Promise(function (rs) {
      rs(a + b);
    });
  },
  2, 1,
  function (err, sum) {
    console.log('Expected:', 3);
    console.log('Actual:', sum);
  }
);

