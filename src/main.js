// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// 按需引入vant组件
import { Button, Row, Col, Search, Swipe, SwipeItem, Lazyload, List, PullRefresh, NavBar, Field, Tab, Tabs, stepper, Tabbar, TabbarItem, cell } from 'vant'
// 使用vant组件
Vue.use(Button).use(Row).use(Col).use(Search).use(Swipe).use(SwipeItem).use(Lazyload).use(List).use(PullRefresh).use(Field).use(Tab).use(Tabs).use(NavBar).use(stepper).use(Tabbar).use(TabbarItem).use(cell)

Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
