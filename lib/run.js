var arrayify = require('arrayify-slice');
var bindAsync = require('./bindAsync');

module.exports = function () {
  var args = arrayify(arguments);
  if (typeof args[args.length - 1] === 'function') {
    bindAsync.apply(null, args.slice(0, -1))(args[args.length - 1]);
  } else {
    bindAsync.apply(null, args)();
  }
};

