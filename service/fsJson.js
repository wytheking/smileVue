const fs = require('fs')

fs.readFile('./data_json/goods.json', 'utf8', function (err, data) {
  let newData = JSON.parse(data)
  let i = 0
  let pushData = []
  newData.RECORDS.map((value, index) => {
    if (value.IMAGE1 != null) {
      i++
      console.log(value.NAME)
      pushData.push(value)
    }
  })
  console.log(i)

  // 把数据写入新文件
  fs.writeFile('./data_json/newGoods.json', JSON.stringify(pushData), (err, data) => {
    if (err) console.log('文件写入失败！')
    else console.log('文件写入成功！')
  })
})
