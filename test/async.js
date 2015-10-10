var test = require('tape')
var run = require('..')

test('without arguments', function(t) {
  t.plan(1)
  run(
    function (cb) {
      process.nextTick(function () {
        t.ok(true)
        cb()
      })
    }
  )
})

test('with arguments', function(t) {
  t.plan(1)
  run(
    [
      function (a, b, cb) {
        process.nextTick(function () {
          t.same([a, b], [1, 2])
          cb()
        })
      },
      1,
      2,
    ]
  )
})

test('with `done`', function(t) {
  t.plan(1)
  run(
    [
      function (a, b, cb) {
        process.nextTick(function () {
          cb(null, a, b)
        })
      },
      1,
      2,
    ],
    function (err, a, b) {
      t.same([a, b], [1, 2])
    }
  )
})

test('with context', function(t) {
  t.plan(1)
  var o = {
    sum: function (a, b, cb) {
      process.nextTick(function () {
        cb(null, a + b)
      })
    },
  }
  run(
    [o, 'sum', 1, 2],
    function (err, res) {
      t.equal(res, 3)
    }
  )
})

