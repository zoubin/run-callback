var test = require('tap').test
var run = require('..')
var thunkify = run.thunkify

test('aync callback can be called multiple times', function(t) {
  return thunkify(function (cb) {
    cb(null, 1)
    cb(1)
  })()
  .then(function (res) {
    t.same(res, [1])
  })
  .catch(function () {
    t.ok(false)
  })
  .then(function () {
    return thunkify(function (cb) {
      cb(1)
      cb(null, 1)
    })()
    .then(function () {
      t.ok(false)
    })
    .catch(function (err) {
      t.equal(err, 1)
    })
  })
})

test('context', function(t) {
  t.plan(2)

  var ctx = {
    fn: function () {
      return this
    },
  }

  run(ctx, function () {
    t.equal(this, ctx)
  })

  run(ctx, 'fn')
  .then(function (res) {
    t.equal(res[0], ctx)
  })

})

test('run', function(t) {
  return run(function (next) {
    t.equal(arguments.length, 1)
    next()
  })
})

test('recursive', function(t) {
  t.plan(2)

  var cb = thunkify(function (a, b, next) {
    t.same([a, b], [2, 1])
    next(null, a - b)
  }).bind(null, 2)

  thunkify(cb)(1).then(function (res) {
    t.same(res, [[1]])
  })
})

