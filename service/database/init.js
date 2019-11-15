const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/simledb'
const glob = require('glob')
const { resolve } = require('path')

exports.connect = () => {
  // 链接数据库
  mongoose.set('useCreateIndex', true)
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })

  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    // 把所有连接放到这里

    // 增加数据库链接的事件监听
    mongoose.connection.on('disconnected', () => {
      console.log('***********数据库断开***********')
      if (maxConnectTimes < 3) {
        maxConnectTimes++
        // 进行重连
        mongoose.connect(db)
      } else {
        // eslint-disable-next-line
        reject()
        throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
      }
    })

    // 数据库出现错误的时候
    mongoose.connection.on('error', err => {
      console.log('***********数据库错误***********')
      if (maxConnectTimes < 3) {
        maxConnectTimes++
        mongoose.connect(db)
      } else {
        reject(err)
        throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
      }
    })

    // 链接打开的时候
    mongoose.connection.once('open', () => {
      console.log('MongoDB Connected Successfully!')
      resolve()
    })
  })
}

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
