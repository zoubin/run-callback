var run = require('..');
var Stream = require('stream');

var res = [];
run(
  function (a, b) {
    var rs = Stream.Readable({ objectMode: true });
    var data = [a, b];
    rs._read = function () {
      if (data.length) {
        this.push(data.pop());
      } else {
        this.push(null);
      }
    };
    process.nextTick(function () {
      rs.on('data', function (d) {
        res.push(d);
      });
    });
    return rs;
  },
  1,
  2,
  function () {
    console.log('Expected:', [2, 1]);
    console.log('Actual:', res);
  }
);
