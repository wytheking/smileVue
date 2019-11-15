const Koa = require('koa')
const app = new Koa()
// 引入connect
const {connect, initSchemas} = require('./database/init.js')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser') // 用来解析接受post数据
const Router = require('koa-router')
const cors = require('koa2-cors') // 设置跨域中间件

// 设置跨域中间件
app.use(cors())

// 用来解析接受post数据
app.use(bodyParser())

// 引入路由模块
let user = require('./appApi/User.js')
// 装载子路由
let router = new Router()
router.use('/user', user.routes())
// 加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods())

// 立即执行函数
;(async () => {
  await connect()
  initSchemas()
  // const User = mongoose.model('User')
  // let oneUser = new User({userName: 'wangyao', password: '123456'})
  //
  // oneUser.save().then(() => {
  //   console.log('插入成功')
  // })
  //
  // let users = await User.findOne({}).exec()
  //
  // console.log('------------------')
  // console.log(users)
  // console.log('------------------')
})()

app.use(async (ctx) => {
  ctx.body = '<h1>hello koa2</h1>'
})

app.listen(3000, () => {
  console.log('[Service] starting at port 3000')
})
