var chain = require('..').chain

chain([
  [function (v, cb) {
    // 1
    console.log(v)
    process.nextTick(function () {
      cb(null, 1, 2)
    })
  }, 1],
  [function (a, b, c) {
    // [3, 1, 2]
    console.log([a, b, c])
    return Promise.resolve([b, c])
  }, 3],
  function (a) {
    // [1, 2]
    console.log(a)
    return [1, 2]
  },
  function (a, cb) {
    // [1, 2]
    console.log(a)
    cb(null, 1, 2)
  },
], function (err, a, b) {
  // [1, 2]
  console.log([a, b])
})

