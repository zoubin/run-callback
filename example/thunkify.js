var run = require('..')

var task = run.thunkify(function (a, b, next) {
  process.nextTick(function () {
    next(null, a + b, a - b)
  })
})

task(2, 1).then(function (res) {
  // `[3, 1]`
  console.log(res)
})
