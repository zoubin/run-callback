var test = require('tap').test
var Runner = require('..').Runner
var Stream = require('./lib/stream')

test('stream', function(t) {
  t.plan(2)

  var runner = Runner({ stream: false })
  var outputs = []
  var rs = Stream.Readable([1, 2])
  runner.thunkify(function () {
    setTimeout(function() {
      var ws = Stream.Writable(outputs)
      rs.pipe(ws)
    }, 0)
    return rs
  })()
  .then(function (res) {
    t.same(outputs, [])
    t.equal(res[0], rs)
  })
})

test('promise', function(t) {
  t.plan(1)

  var runner = Runner({ promise: false })
  var p = new Promise(function (resolve) {
    setTimeout(resolve, 0)
  })
  runner.thunkify(function () {
    return p
  })()
  .then(function (res) {
    t.equal(res[0], p)
  })
})

test('async', function(t) {
  t.plan(2)

  var runner = Runner({ async: false })
  runner.thunkify(function (cb) {
    t.notOk(cb)
    t.equal(arguments.length, 0)
  })()
})

