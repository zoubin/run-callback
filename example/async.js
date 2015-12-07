var run = require('..')

run(function (a, b, next) {
  process.nextTick(function () {
    next(null, a + b, a - b)
  })
}, 2, 1)
.then(function (res) {
  // `[3, 1]`
  console.log(res)
})
