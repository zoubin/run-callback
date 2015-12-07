var test = require('tap').test
var thunkify = require('..').thunkify
var Stream = require('./lib/stream')

test('readable', function(t) {
  t.plan(1)

  var outputs = []
  thunkify(function () {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable(outputs)
    rs.pipe(ws)
    return rs
  })()
  .then(function () {
    t.same(outputs, [1, 2])
  })

})

test('writable', function(t) {
  t.plan(1)

  var outputs = []
  thunkify(function () {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable(outputs)
    return rs.pipe(ws)
  })()
  .then(function () {
    t.same(outputs, [1, 2])
  })

})

test('transform', function(t) {
  t.plan(1)

  var outputs = []
  thunkify(function () {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable(outputs)
    var tr = Stream.Transform(function (data) { return data + 1 })
    rs.pipe(tr).pipe(ws)
    return tr
  })()
  .then(function () {
    t.same(outputs, [2, 3])
  })

})

test('duplex', function(t) {
  t.plan(1)

  var outputs = []
  var outputs2 = []
  thunkify(function () {
    var stream = Stream.Duplex(outputs2, [1, 2])
    var ws = Stream.Writable(outputs)
    stream.pipe(ws)
    stream.write(3)
    stream.end(4)
    return stream
  })()
  .then(function () {
    t.same(outputs, [1, 2, 3, 4])
  })

})

