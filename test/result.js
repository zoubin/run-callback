var test = require('tap').test
var thunkify = require('..').thunkify
var Stream = require('./lib/stream')

test('sync', function(t) {
  t.plan(4)

  thunkify(function (a) {
    return a
  })(1)
  .then(function (res) {
    t.same(res, [1])
  })

  thunkify(function () {
    return
  })()
  .then(function (res) {
    t.same(res, [])
  })

  thunkify(function () {
    return null
  })()
  .then(function (res) {
    t.same(res, [null])
  })

  thunkify(function () {})()
  .then(function (res) {
    t.same(res, [])
  })

})

test('async', function(t) {
  t.plan(5)

  thunkify(function (a, next) {
    next(null, a)
  })(1)
  .then(function (res) {
    t.same(res, [1])
  })

  thunkify(function (a, b, next) {
    next(null, a, b)
  })(1, 2)
  .then(function (res) {
    t.same(res, [1, 2])
  })

  thunkify(function (next) {
    next()
  })()
  .then(function (res) {
    t.same(res, [])
  })

  thunkify(function (next) {
    next(null, undefined)
  })()
  .then(function (res) {
    t.same(res, [])
  })

  thunkify(function (next) {
    next(null, undefined, null)
  })()
  .then(function (res) {
    t.same(res, [undefined, null])
  })

})

test('promise', function(t) {
  t.plan(5)

  thunkify(function () {
    return Promise.resolve(1)
  })()
  .then(function (res) {
    t.same(res, [1])
  })

  thunkify(function () {
    return Promise.resolve()
  })()
  .then(function (res) {
    t.same(res, [])
  })

  thunkify(function () {
    return Promise.resolve(undefined)
  })()
  .then(function (res) {
    t.same(res, [])
  })

  thunkify(function () {
    return Promise.resolve(null)
  })()
  .then(function (res) {
    t.same(res, [null])
  })

  thunkify(function () {
    return Promise.resolve([1, 2])
  })()
  .then(function (res) {
    t.same(res, [[1, 2]])
  })

})

test('stream', function(t) {
  t.plan(1)

  thunkify(function () {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable([])
    return rs.pipe(ws)
  })()
  .then(function (res) {
    t.same(res, [])
  })

})

