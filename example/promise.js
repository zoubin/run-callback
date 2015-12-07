var run = require('..')

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
