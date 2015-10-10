var test = require('tape')
var run = require('..')

test('fulfilled', function(t) {
  t.plan(1)
  run(
    [function (a, b) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs([a, b])
        })
      })
    }, 1, 2],
    function (err, res) {
      t.same(res, [1, 2], 'fulfilled')
    }
  )
})

test('rejected', function(t) {
  t.plan(1)
  run(
    [function (a, b) {
      return new Promise(function (rs, rj) {
        process.nextTick(function () {
          rj([a, b])
        })
      })
    }, 1, 2],
    function (err) {
      t.same(err, [1, 2], 'rejected')
    }
  )
})

