var test = require('tap').test
var thunkify = require('..').thunkify
var Stream = require('./lib/stream')

test('sync', function(t) {
  t.plan(1)

  thunkify(function (a) {
    return a.slice()
  })(1)
  .catch(function (err) {
    t.ok(err instanceof Error)
  })

})

test('async', function(t) {
  t.plan(2)

  thunkify(function (a, next) {
    a.slice()
    next()
  })(1)
  .catch(function (err) {
    t.ok(err instanceof Error)
  })

  thunkify(function (a, next) {
    next('ERROR')
  })(1)
  .catch(function (err) {
    t.equal(err, 'ERROR')
  })

})

test('promise', function(t) {
  t.plan(2)

  thunkify(function (a) {
    a.slice()
    return Promise.reject('ERROR')
  })(1)
  .catch(function (err) {
    t.ok(err instanceof Error)
  })

  thunkify(function () {
    return Promise.reject('ERROR')
  })()
  .catch(function (err) {
    t.equal(err, 'ERROR')
  })

})

test('stream', function(t) {
  t.plan(1)

  thunkify(function () {
    var rs = Stream.Readable([1, 2])
    var ws = Stream.Writable([])
    process.nextTick(function () {
      ws.emit('error', 'ERROR')
    })
    return rs.pipe(ws)
  })()
  .catch(function (err) {
    t.equal(err, 'ERROR')
  })

})

