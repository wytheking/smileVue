const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const FS = require('fs')

router.get('/insertAllCategorySub', async (ctx) => {
  FS.readFile('./data_json/category_sub.json', 'utf8', (err, data) => {
    if (err) console.log(err)
    data = JSON.parse(data)
    let saveCount = 0
    const CategorySub = mongoose.model('CategorySub')
    data.RECORDS.map((value, index) => {
      console.log(value)
      let newCategorySub = new CategorySub(value)
      newCategorySub.save().then(() => {
        saveCount++
        console.log('成功插入' + saveCount)
      }).catch(error => {
        console.log('插入失败:' + error)
      })
    })
  })
  ctx.body = '开始导入数据'
})

module.exports = router
