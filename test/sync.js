var test = require('tape')
var run = require('..')

test('sync', function(t) {
  t.plan(1)
  run(
    function () {
      return 1
    },
    function (err, res) {
      t.equal(res, 1)
    }
  )
})

