var run = require('..')
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
