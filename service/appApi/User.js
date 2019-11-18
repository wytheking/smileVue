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

router.post('/login', async (ctx) => {
  let loginUser = ctx.request.body
  console.log(loginUser)
  let userName = loginUser.userName
  let password = loginUser.password

  // 引入User的Model
  const User = mongoose.model('User')

  await User.findOne({userName: userName}).exec()
    .then(async res => {
      console.log(res)
      if (res) {
        // 当用户名存在时，开始对比密码
        let newUser = new User() // 因为是实例方法，要new出来才能用
        await newUser.comparePassword(password, res.password)
          .then((isMath) => {
            // 返回对比结果
            ctx.body = {
              code: 200,
              msg: isMath
            }
          }).catch(error => {
            // 出现异常，返回异常
            console.log(error)
            ctx.body = {
              code: 500,
              msg: error
            }
          })
      } else {
        ctx.body = {
          code: 200,
          msg: '用户名不存在'
        }
      }
    }).catch(error => {
      console.log(error)
      ctx.body = {
        code: 500,
        msg: error
      }
    })
})

module.exports = router
