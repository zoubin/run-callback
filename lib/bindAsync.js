var eos = require('end-of-stream')
var consume = require('stream-consume')
var arrayify = require('arrayify-slice')
var once = require('once')

module.exports = function () {
  var args = arrayify(arguments)
  var ctx = null
  var fn
  if (typeof args[0] === 'object') {
    ctx = args.shift()
    fn = args.shift()
    if (typeof fn === 'string') {
      fn = ctx[fn]
    }
  } else {
    fn = args.shift()
  }
  return function (done) {
    done = done || function () {}
    done = once(done)
    var r
    try {
      r = fn.apply(ctx, args.concat(done))
    } catch (e) {
      if (done.called) {
        throw e
      }
      return done(e)
    }

    if (isPromise(r)) {
      r.then(function (res) {
        done(null, res)
      }, function (err) {
        done(err)
      })
    } else if (isStream(r)) {
      eos(
        r,
        {
          error: true,
          readable: r.readable,
          writable: r.writable && !r.readable,
        },
        function (err) {
          done(err)
        }
      )
      consume(r)
    } else if (fn.length < args.length + 1) {
      done(null, r)
    }
  }
}


function isPromise(o) {
  return o && typeof o.then === 'function'
}

function isStream(s) {
  return s && typeof s.pipe === 'function'
}

