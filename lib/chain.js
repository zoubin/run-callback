var run = require('./run')

module.exports = function (things, done) {
  if (typeof done !== 'function') {
    done = function () {}
  }
  var last = []
  ;(function next(i, len) {
    if (i >= len) {
      last.unshift(null)
      return done.apply(null, last)
    }
    var thing = things[i]
    if (Array.isArray(thing)) {
      thing = thing.slice()
    } else {
      thing = [thing]
    }
    thing.push.apply(thing, last)
    run(thing, function (err) {
      if (err) {
        return done(err)
      }
      last = [].slice.call(arguments, 1)
      // do not try catch the next callback here
      process.nextTick(function () {
        next(++i, len)
      })
    })
  })(0, things.length)
}

