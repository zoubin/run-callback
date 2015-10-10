var bind = require('./bindAsync')

module.exports = function (cb, done) {
  var args = Array.isArray(cb) ? cb : [cb]
  bind.apply(null, args)(done)
}

