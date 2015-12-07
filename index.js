var eos = require('end-of-stream')
var consume = require('stream-consume')

exports = module.exports = function (cb) {
  return thunkify(cb).apply(null, slice(arguments, 1))
}

exports.thunkify = thunkify

function thunkify(fn, ctx) {
  if (typeof fn === 'string') {
    fn = ctx[fn]
  }

  return function () {
    var args = slice(arguments)

    // For async callbacks,
    // the number of arguments provided should be at least one less than declared.
    var maybeAsync = fn.length > args.length

    return new Promise(function (resolve, reject) {
      function done(err) {
        if (err) {
          return reject(err)
        }
        resolve(normalizeResult(slice(arguments, 1)))
      }

      var r = fn.apply(ctx, maybeAsync ? args.concat(done) : args)

      if (isPromise(r)) {
        r.then(done.bind(null, null), done)
        return
      }

      if (isStream(r)) {
        eos(r, {
          error: true,
          readable: r.readable,
          writable: r.writable && !r.readable,
        }, function (err) {
          done(err)
        })
        consume(r)
        return
      }

      if (!maybeAsync) {
        done(null, r)
      }

    })
  }
}

function isPromise(o) {
  return o && typeof o.then === 'function'
}

function isStream(s) {
  return s && typeof s.pipe === 'function'
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

function normalizeResult(res) {
  var top
  while (res.length) {
    top = res.pop()
    if (typeof top !== 'undefined') {
      res.push(top)
      break
    }
  }
  return res
}

