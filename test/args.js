var test = require('tap').test
var thunkify = require('..').thunkify
var Stream = require('./lib/stream')

test('async should receive an appended callback', function(t) {
  t.plan(6)
  thunkify(function (cb) {
    t.equal(arguments.length, 1)
    cb()
  })()
  thunkify(function (a, cb) {
    t.equal(arguments.length, 2)
    t.equal(a, 1)
    cb()
  })(1)
  thunkify(function (a, b, cb) {
    t.equal(arguments.length, 2)
    t.equal(a, 1)
    t.equal(typeof cb, 'undefined')
    b()
  })(1)
})

test('sync should not receive an appended callback', function(t) {
  t.plan(8)
  thunkify(function () {
    t.equal(arguments.length, 0)
  })()
  thunkify(function (a) {
    t.equal(arguments.length, 1)
    t.equal(a, 1)
  })(1)
  thunkify(function (a, b) {
    t.equal(arguments.length, 2)
    t.same([a, b], [1, 2])
  })(1, 2)
  thunkify(function (a) {
    t.equal(arguments.length, 2)
    t.equal(a, 1)
    t.equal(arguments[1], 2)
  })(1, 2)
})

test('promise should be tolerant', function(t) {
  t.plan(6)
  thunkify(function (cb) {
    t.equal(arguments.length, 1)
    t.equal(typeof cb, 'function')
    return Promise.resolve()
  })()
  thunkify(function (cb) {
    t.equal(arguments.length, 1)
    t.equal(cb, 1)
    return Promise.resolve()
  })(1)
  thunkify(function () {
    t.equal(arguments.length, 0)
    return Promise.resolve()
  })()
  thunkify(function () {
    t.equal(arguments.length, 1)
    return Promise.resolve()
  })(1)
})

test('stream should be tolerant', function(t) {
  t.plan(6)
  thunkify(function (cb) {
    t.equal(arguments.length, 1)
    t.equal(typeof cb, 'function')
    return createStream()
  })()
  thunkify(function (cb) {
    t.equal(arguments.length, 1)
    t.equal(cb, 1)
    return createStream()
  })(1)
  thunkify(function () {
    t.equal(arguments.length, 0)
    return createStream()
  })()
  thunkify(function () {
    t.equal(arguments.length, 1)
    return createStream()
  })(1)

  function createStream() {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable([])
    return rs.pipe(ws)
  }
})

