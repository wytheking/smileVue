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

/** 获取商品详情信息接口 **/
router.post('/getDetailGoodsInfo', async (ctx) => {
  try {
    let goodsId = ctx.request.body.goodsId
    const Goods = mongoose.model('Goods')
    let res = await Goods.findOne({ID: goodsId}).exec()
    ctx.body = {
      code: 200,
      msg: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: err
    }
  }
})

/** 获取商品大分类 **/
router.get('/getCategoryList', async (ctx) => {
  try {
    const Category = mongoose.model('Category')
    let res = await Category.find().exec()
    ctx.body = {
      code: 200,
      msg: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: err
    }
  }
})

/** 获取商品小分类 **/
router.post('/getCategorySubList', async (ctx) => {
  try {
    let categoryId = ctx.request.body.categoryId
    const CategorySub = mongoose.model('CategorySub')
    let res = await CategorySub.find({MALL_CATEGORY_ID: categoryId}).exec()
    ctx.body = {
      code: 200,
      msg: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: err
    }
  }
})

/** 根据商品类别获取商品列表 **/
router.post('/getGoodsListByCategorySubID', async (ctx) => {
  try {
    let categorySubId = ctx.request.body.categorySubId // 小类别
    let page = ctx.request.body.page
    let num = ctx.request.body.num // 每页显示数量
    let start = (page - 1) * num
    const Goods = mongoose.model('Goods')
    let res = await Goods.find({SUB_ID: categorySubId}).skip(start).limit(num).exec()
    ctx.body = {
      code: 200,
      msg: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: err
    }
  }
})

module.exports = router
