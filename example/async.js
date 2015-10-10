var run = require('..')

run(
  [function (a, b, done) {
    process.nextTick(function () {
      done(null, a + b, a - b)
    })
  },
  2, 1],
  function (err, sum, diff) {
    console.log('Expected:', 3, 1)
    console.log('Actual:', sum, diff)
  }
)

