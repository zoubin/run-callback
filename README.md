# run-callback
[![version](https://img.shields.io/npm/v/run-callback.svg)](https://www.npmjs.org/package/run-callback)
[![status](https://travis-ci.org/zoubin/run-callback.svg?branch=master)](https://travis-ci.org/zoubin/run-callback)
[![coverage](https://img.shields.io/coveralls/zoubin/run-callback.svg)](https://coveralls.io/github/zoubin/run-callback)
[![dependencies](https://david-dm.org/zoubin/run-callback.svg)](https://david-dm.org/zoubin/run-callback)
[![devDependencies](https://david-dm.org/zoubin/run-callback/dev-status.svg)](https://david-dm.org/zoubin/run-callback#info=devDependencies)

Run async or sync callbacks, such as [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

## Usage

```javascript
var run = require('run-callback')
var thunkify = run.thunkify

```

### promise = run(callback, ...args)

Run `callback` with `args`,
and return a promise to fetch the results,
which is always an `Array`.

#### callback

Type: `Function`

`callback` can be made asynchronous if it does one of the following:

##### Return a promise

```javascript
run(function () {
  return new Promise(function (resolve) {
    process.nextTick(function () {
      resolve('done')
    })
  })
})
.then(function (res) {
  // 'done'
  console.log(res[0])
})

```

##### Return a stream

```javascript
var Readable = require('stream').Readable

var src = ['beep', '\n', 'boop']
run(function () {
  var stream = createStream(src)
  stream.pipe(process.stdout)
  return stream
})
.then(function () {
  console.log('\n')
  // `[]`
  console.log(src)
})

function createStream(source) {
  var rs = Readable()
  rs._read = function () {
    if (source.length) {
      this.push(source.pop())
    } else {
      this.push(null)
    }
  }
  return rs
}

```

##### Accept one more argument than declared

```javascript
run(function (a, b, next) {
  process.nextTick(function () {
    next(null, a + b, a - b)
  })
}, 2, 1)
.then(function (res) {
  // `[3, 1]`
  console.log(res)
})

```

### run.thunkify(fn)

Return a new function to run `fn` later with a list of arguments.

```javascript
var task = run.thunkify(function (a, b, next) {
  process.nextTick(function () {
    next(null, a + b, a - b)
  })
})

task(2, 1).then(function (res) {
  // `[3, 1]`
  console.log(res)
})

```

### Runner = run.Runner

`var runner = Runner(opts)`

Create a custom `Runner` instance to run callbacks.

#### opts

By default, callbacks returning a stream is thought to be in progress before the stream ends.
However, if `opts.stream` is `false`,
callbacks returning a stream wil be treated as synchronous.

If `opts.promise` is `false`,
callbacks returning a promise will be treated as synchronous.

If `opts.async` is `false`,
callbacks can only be made asynchronous
by returning a promise (when `opts.promise` is `true`),
or returning a stream (when `opts.stream` is `true`).

```javascript
var Stream = require('stream')
var Readable = Stream.Readable
var Writable = Stream.Writable

;(function handleStream() {
  var runner = require('..').Runner({ stream: true })

  var outputs = []
  var rs = createReadable([1, 2])

  return runner.thunkify(function () {
    setTimeout(function() {
      var ws = createWritable(outputs)
      rs.pipe(ws)
    }, 0)
    return rs
  })().then(function (res) {
    // []
    console.log(res)
  })
})()
.then(function doNotHandleStream() {
  var runner = require('..').Runner({ stream: false })

  var outputs = []
  var rs = createReadable([1, 2])

  runner.thunkify(function () {
    setTimeout(function() {
      var ws = createWritable(outputs)
      rs.pipe(ws)
    }, 0)
    return rs
  })().then(function (res) {
    // true
    console.log(res[0] === rs)
  })
})

function createReadable(input) {
  var stream = Readable({ objectMode: true })
  var i = 0
  stream._read = function () {
    if (i < input.length) {
      this.push(input[i++])
    } else {
      this.push(null)
    }
  }
  return stream
}

function createWritable(output) {
  var stream = Writable({ objectMode: true })
  var i = 0
  stream._write = function (data, _, next) {
    output.push(data)
    next()
  }
  return stream
}

```

