var test = require('tape')
var chain = require('..').chain

test('chain', function(t, done) {
  chain([
    [function (v, cb) {
      t.equal(v, 1)
      process.nextTick(function () {
        cb(null, 1, 2)
      })
    }, 1],
    [function (a, b, c) {
      t.same([a, b, c], [3, 1, 2])
      return Promise.resolve([b, c])
    }, 3],
    function (a) {
      t.same(a, [1, 2])
      return [1, 2]
    },
    function (a, cb) {
      t.same(a, [1, 2])
      cb(null, 1, 2)
    },
  ], function (err, a, b) {
    t.error(err)
    t.same([a, b], [1, 2])
    done()
  })
})

test('chain error', function(t) {
  t.task(function (done) {
    chain([
      function () {
        throw new Error('sync')
      },
    ], function (err) {
      t.ok(err instanceof Error)
      done()
    })
  })
  t.task(function (done) {
    chain([
      function (cb) {
        process.nextTick(function () {
          cb(new Error('async'))
        })
      },
    ], function (err) {
      t.ok(err instanceof Error)
      done()
    })
  })
  t.task(function (done) {
    chain([
      function () {
        return Promise.reject('promise')
      },
    ], function (err) {
      t.equal(err, 'promise')
      done()
    })
  })
})

