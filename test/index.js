var test = require('tap').test;
var run = require('..');
var Stream = require('stream');

test('sync', function(t) {
  run(
    function () {
      return 1;
    },
    function (err, res) {
      t.error(err);
      t.equal(res, 1, 'only the callback');
    }
  );

  run(
    function (a, b) {
      return [a, b];
    },
    1,
    2,
    function (err, res) {
      t.error(err);
      t.same(res, [1, 2], 'with two arguments');
    }
  );

  var o = {
    sum: function (a, b) {
      return a + b;
    },
  };
  run(
    o,
    'sum',
    1,
    2,
    function (err, res) {
      t.error(err);
      t.equal(res, 3, 'with context');
    }
  );

  t.end();
});

test('async', function(t) {
  t.plan(2);
  var o = {
    sum: function (a, b, done) {
      process.nextTick(function () {
        done(null, a + b);
      });
    },
  };
  run(
    o,
    'sum',
    1,
    2,
    function (err, res) {
      t.error(err);
      t.equal(res, 3);
    }
  );
});

test('promise', function(t) {
  t.plan(3);
  var o = {
    sum: function (a, b) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(a + b);
        });
      });
    },
    del: function (a, b) {
      return new Promise(function (rs, rj) {
        process.nextTick(function () {
          rj([a, b]);
        });
      });
    },
  };
  run(
    o,
    'sum',
    1,
    2,
    function (err, res) {
      t.error(err);
      t.equal(res, 3, 'fulfilled');
    }
  );
  run(
    o,
    'del',
    1,
    2,
    function (err) {
      t.same(err, [1, 2]);
    }
  );
});

test('Readable', function(t) {
  t.plan(2);

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
    function (err) {
      t.error(err);
      t.same(res, [2, 1]);
    }
  );
});

test('Writable', function(t) {
  t.plan(2);

  var res = [];
  run(
    function (a, b) {
      var ws = Stream.Writable({ objectMode: true });
      ws._write = function (buf, _, next) {
        process.nextTick(function () {
          res.push(buf);
          next();
        });
      };
      process.nextTick(function () {
        ws.write(a);
        process.nextTick(function () {
          ws.end(b);
        });
      });
      return ws;
    },
    1,
    2,
    function (err) {
      t.error(err);
      t.same(res, [1, 2]);
    }
  );
});

test('Transform', function(t) {
  t.plan(2);

  var res = [];
  run(
    function (a, b) {
      var ts = Stream.Transform({ objectMode: true });
      ts._transform = function (buf, _, next) {
        process.nextTick(function () {
          next(null, buf << 1);
        });
      };
      var rs = Stream.Readable({ objectMode: true });
      var data = [a, b];
      rs._read = function () {
        if (data.length) {
          this.push(data.pop());
        } else {
          this.push(null);
        }
      };
      var ws = Stream.Writable({ objectMode: true });
      ws._write = function (buf, _, next) {
        process.nextTick(function () {
          res.push(buf);
          next();
        });
      };
      ts.pipe(ws);
      return rs.pipe(ts);
    },
    1,
    2,
    function (err) {
      t.error(err);
      t.same(res, [4, 2]);
    }
  );
});

