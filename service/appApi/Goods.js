const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const FS = require('fs')

router.get('/insertAllGoodsInfo', async (ctx) => {
  FS.readFile('./data_json/newGoods.json', 'utf8', (err, data) => {
    if (err) console.log(err)
    data = JSON.parse(data)
    let saveCount = 0
    const Goods = mongoose.model('Goods')
    data.map((value, index) => {
      console.log(value)
      let newGoods = new Goods(value)
      newGoods.save().then(() => {
        saveCount++
        console.log('成功' + saveCount)
      }).catch(error => {
        console.log('失败：' + error)
      })
    })
  })
  ctx.body = '开始导入数据'
})

module.exports = router
