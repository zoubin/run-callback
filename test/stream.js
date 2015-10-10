var test = require('tape')
var run = require('..')
var Stream = require('stream')

test('Readable', function(t) {
  t.plan(1)

  var res = []
  run(
    [function (a, b) {
      var rs = Stream.Readable({ objectMode: true })
      var data = [a, b]
      rs._read = function () {
        if (data.length) {
          this.push(data.pop())
        } else {
          this.push(null)
        }
      }
      process.nextTick(function () {
        rs.on('data', function (d) {
          res.push(d)
        })
      })
      return rs
    }, 1, 2],
    function () {
      t.same(res, [2, 1])
    }
  )
})

test('Writable', function(t) {
  t.plan(1)

  var res = []
  run(
    [function (a, b) {
      var ws = Stream.Writable({ objectMode: true })
      ws._write = function (buf, _, next) {
        process.nextTick(function () {
          res.push(buf)
          next()
        })
      }
      process.nextTick(function () {
        ws.write(a)
        process.nextTick(function () {
          ws.end(b)
        })
      })
      return ws
    }, 1, 2],
    function () {
      t.same(res, [1, 2])
    }
  )
})

test('Transform', function(t) {
  t.plan(1)

  var res = []
  run(
    [function (a, b) {
      var ts = Stream.Transform({ objectMode: true })
      ts._transform = function (buf, _, next) {
        process.nextTick(function () {
          next(null, buf << 1)
        })
      }
      var rs = Stream.Readable({ objectMode: true })
      var data = [a, b]
      rs._read = function () {
        if (data.length) {
          this.push(data.pop())
        } else {
          this.push(null)
        }
      }
      var ws = Stream.Writable({ objectMode: true })
      ws._write = function (buf, _, next) {
        process.nextTick(function () {
          res.push(buf)
          next()
        })
      }
      ts.pipe(ws)
      return rs.pipe(ts)
    }, 1, 2],
    function () {
      t.same(res, [4, 2])
    }
  )
})

