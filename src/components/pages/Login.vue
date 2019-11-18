<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="goBack" />

    <div class="register-panel">
      <van-field
        v-model="username"
        label="用户名"
        clearable
        placeholder="请输入用户名"
        required
        :error-message="usernameErrorMsg"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        clearable
        placeholder="请输入密码"
        required
        :error-message="passwordErrorMsg"
      />
      <div class="register-button">
        <van-button type="primary" @click="LoginAction" :loading="openLoading" size="large">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import url from '@/serviceAPI.config.js'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      openLoading: false, // 是否开启用户的Loading
      usernameErrorMsg: '', // 当用户名出现错误的时候
      passwordErrorMsg: '' // 当密码出现错误的时候
    }
  },
  created () {
    if (localStorage.userInfo) {
      Toast.success('您已经登录过了！')
      this.$router.replace('/')
    }
  },
  methods: {
    /**
     * 返回
     */
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 注册并验证
     */
    LoginAction () {
      this.checkForm() && this.httpLoginUser()
    },
    /**
     * 验证输入框
     */
    checkForm () {
      let isOk = true
      if (this.username.length < 5) {
        this.usernameErrorMsg = '用户名不能小于5位'
        isOk = false
      } else {
        this.usernameErrorMsg = ''
      }
      if (this.password.length < 6) {
        this.passwordErrorMsg = '密码不能少于6位'
        isOk = false
      } else {
        this.passwordErrorMsg = ''
      }
      return isOk
    },
    /**
     * 注册
     */
    httpLoginUser () {
      this.openLoading = true
      this.$http.post(
        url.login,
        {
          userName: this.username,
          password: this.password
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.code === 200 && res.data.msg) {
            new Promise((resolve, reject) => {
              localStorage.userInfo = {userName: this.username}
              setTimeout(() => {
                resolve()
              }, 500)
            }).then(() => {
              Toast.success('登录成功')
              // setTimeout(() => {
              this.$router.push('/')
              // }, 2000)
            }).catch(err => {
              Toast.fail('登录状态保存失败')
              console.log(err)
            })
          } else {
            Toast.fail('登录失败！')
            this.openLoading = false
          }
        }).catch((err) => {
          console.log(err)
          Toast.fail('登录失败！')
          this.openLoading = false
        })
    }
  }
}
</script>

<style scoped>
  .login {
    height: 100vh;
    /*background: #fff;*/
  }
  .register-panel{
    width:96%;
    border-radius: 5px;
    margin:20px auto;
  }
  .register-button{
    padding:20px;
  }
</style>
