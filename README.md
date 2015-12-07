# run-callback
Run async or sync callbacks, such as [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

[![version](https://img.shields.io/npm/v/run-callback.svg)](https://www.npmjs.org/package/run-callback)
[![status](https://travis-ci.org/zoubin/run-callback.svg?branch=master)](https://travis-ci.org/zoubin/run-callback)
[![coverage](https://img.shields.io/coveralls/zoubin/run-callback.svg)](https://coveralls.io/github/zoubin/run-callback)
[![dependencies](https://david-dm.org/zoubin/run-callback.svg)](https://david-dm.org/zoubin/run-callback)
[![devDependencies](https://david-dm.org/zoubin/run-callback/dev-status.svg)](https://david-dm.org/zoubin/run-callback#info=devDependencies)

The main ideas are borrowed from [orchestrator](https://github.com/orchestrator/orchestrator/blob/master/lib/runTask.js).

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

##### Accept one more argument than given

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

### run.thunkify(fn, context)

Return a new function to run `fn` with arguments.

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

