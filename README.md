# run-callback
Run async or sync callbacks, such as [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

The main ideas are borrowed from [orchestrator](https://github.com/orchestrator/orchestrator/blob/master/lib/runTask.js).

# API

## run(callback, done)

Run the callback with arguments after `callback`.

### callback

Type: `Function`

`callback` can be asynchronous if it does one of the following:

#### Return a promise

```javascript
var run = require('run-callback');

run(
  function (a, b, done) {
    return new Promise(function (rs) {
      rs(a + b);
    });
  },
  2, 1,
  function (err, sum) {
    console.log('Expected:', 3);
    console.log('Actual:', sum);
  }
);

```

#### Return a stream

```javascript
var run = require('run-callback');
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
  function (err) {
    console.log('Expected:', [2, 1]);
    console.log('Actual:', res);
  }
);

```

#### Accept one more argument than given

That extra argument should be a function.

```javascript
var run = require('run-callback');

run(
  function (a, b, done) {
    process.nextTick(function () {
      done(null, a + b, a - b);
    });
  },
  2, 1,
  function (err, sum, diff) {
    console.log('Expected:', 3, 1);
    console.log('Actual:', sum, diff);
  }
);

```

### done

Type: `Function`

Signature: `done(err, val1, val2,...)`

#### Synchronous
`done` will be called when `callback` finishes.

Errors thrown when executing `callback` will be passed to `done` as the first argument,
and the return value as the second.

```javascript
var run = require('run-callback');

run(
  function (a, b) {
    return a + b;
  },
  1, 2,
  function (err, res) {
    console.log('Expected:', 3);
    console.log('Actual:', res);
  }
);

```

#### Promisified
`done` will be called when the returned promise resolves.

Any rejected values will be passed as the first arugment,
and any fulfilled values as the second.

#### Streamified
`done` will be called when the returned stream ends (readable, transforms, duplex) or finishes (writable).

Errors will be passed as the only arugment.

#### Other

`done` will be called when `callback` invokes the last argument with a possible error object and more values.

`done` will be called with the same arguments.

