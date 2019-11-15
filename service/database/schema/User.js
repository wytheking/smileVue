const mongoose = require('mongoose') // 引入Mongoose
const Schema = mongoose.Schema // 声明Shame
let ObiectId = Schema.Types.ObjectId // 声明object类型,主键id
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10 // 密码加盐，10代表加盐强度

// 创建我们的用户Schema
const userSchema = new Schema({
  UserId: ObiectId,
  userName: {unique: true, type: String},
  password: String,
  createAt: {type: Date, default: Date.now()},
  lastLoginAt: {type: Date, default: Date.now()}
}, {
  collection: 'user' // 防止到映射到数据库后，表名变成users
})

// 每次存储数据是都要执行,密码加盐加密
userSchema.pre('save', function (next) {
  console.log(this)
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

// 发布模型
mongoose.model('User', userSchema)
