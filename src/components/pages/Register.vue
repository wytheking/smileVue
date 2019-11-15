<template>
  <div class="login">
    <van-nav-bar
      title="用户注册"
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
        <van-button type="primary" @click="registerAction" :loading="openLoading" size="large">马上注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import url from '@/serviceAPI.config.js'
export default {
  name: 'Register',
  data () {
    return {
      username: '',
      password: '',
      openLoading: false, // 是否开启用户的Loading
      usernameErrorMsg: '', // 当用户名出现错误的时候
      passwordErrorMsg: '' // 当密码出现错误的时候
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
    registerAction () {
      this.checkForm() && this.httpRegisterUser()
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
    httpRegisterUser () {
      this.openLoading = true
      this.$http.post(
        url.registerUser,
        {
          userName: this.username,
          password: this.password
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.code === 200) {
            Toast.success(`${res.data.msg}`)
            setTimeout(() => {
              this.$router.push('/')
            }, 2000)
          } else {
            Toast.fail('注册失败！')
            this.openLoading = false
          }
        }).catch((err) => {
          console.log(err)
          Toast.fail('注册失败！')
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
