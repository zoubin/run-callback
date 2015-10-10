var run = require('..')

run(
  [function (a, b) {
    return a + b
  },
  1, 2],
  function (err, res) {
    console.log('Expected:', 3)
    console.log('Actual:', res)
  }
)

