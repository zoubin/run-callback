var eos = require('end-of-stream')
var consume = require('stream-consume')

function Runner(opts) {
  if (!(this instanceof Runner)) {
    return new Runner(opts)
  }
  opts = opts || {}
  // should handle functions returning a stream
  this.stream = opts.stream !== false
  // should handle functions returning a promise
  this.promise = opts.promise !== false
  // should handle asynchronous functions accepting a callback
  this.async = opts.async !== false
}

Runner.prototype.thunkify = function(fn) {
  var self = this

  return function () {
    var ctx = this
    var args = slice(arguments)

    // For async functions,
    // the number of arguments provided should be at least one less than declared.
    var async = self.async && fn.length > args.length

    return new Promise(function (resolve, reject) {
      function done(err) {
        if (err) return reject(err)
        resolve(self.normalize(slice(arguments, 1)))
      }

      if (async) {
        args = args.concat(done)
      }

      var r = fn.apply(ctx, args)

      if (self.promise && isPromise(r)) {
        return r.then(done.bind(null, null), done)
      }

      if (self.stream && isStream(r)) {
        return self.eos(r, done)
      }

      if (!async) done(null, r)
    })
  }
}

Runner.prototype.eos = function(stream, done) {
  eos(stream, {
    error: true,
    readable: stream.readable,
    writable: stream.writable && !stream.readable,
  }, function (err) {
    done(err)
  })
  consume(stream)
}

Runner.prototype.normalize = function(res) {
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

function isPromise(o) {
  return o && typeof o.then === 'function'
}

function isStream(s) {
  return s && typeof s.pipe === 'function'
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

var runner = new Runner()
var thunkify = runner.thunkify.bind(runner)

exports = module.exports = function (ctx, cb) {
  if (typeof ctx === 'function') {
    return thunkify(ctx).apply(null, slice(arguments, 1))
  }
  if (typeof cb === 'string') {
    cb = ctx[cb]
  }
  return thunkify(cb).apply(ctx, slice(arguments, 2))
}

exports.thunkify = thunkify
exports.Runner = Runner

