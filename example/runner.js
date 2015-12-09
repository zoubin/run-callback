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
