const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.get('/', async (ctx) => {
  ctx.body = '设置操作用户的首页'
})

router.post('/register', async (ctx) => {
  console.log(ctx.request.body)
  const User = mongoose.model('User')
  let newUser = new User(ctx.request.body)

  await newUser.save().then(() => {
    ctx.body = {
      code: 200,
      msg: '注册成功！'
    }
  }).catch(err => {
    ctx.body = {
      code: 500,
      msg: err
    }
  })
})

module.exports = router
