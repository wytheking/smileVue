<template>
    <div>
      <div class="navbar-div">
        <van-nav-bar title="类别列表" />
      </div>
      <div>
        <van-row>
          <van-col span="6">
            <div id="leftNav">
              <ul>
                <li
                  @click="clickCategory(index, item.ID)"
                  :class="{categoryActive:categoryIndex==index}"
                  v-for="(item,index) in category"
                  :key="index"
                >
                  {{item.MALL_CATEGORY_NAME}}
                </li>
              </ul>
            </div>
          </van-col>
          <van-col span="18">
            <div class="tabCategorySub">
              <van-tabs v-model="active" @click="onClickCategorySub">
                <van-tab
                  v-for="(item, index) in categorySub"
                  :key="index"
                  :title="item.MALL_SUB_NAME"
                >

                </van-tab>
              </van-tabs>
            </div>
            <div id="list-div">
              <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  @load="onLoad"
                >
                  <div class="list-item"
                       v-for="(item,index) in goodList"
                       @click="goGoodsInfo(item.ID)"
                       :key="index">
                    <div class="list-item-img">
                      <img :src="item.IMAGE1"
                           width="100%"
                           :onerror="errorImg"
                      />
                    </div>
                    <div class="list-item-text">
                      <div>{{item.NAME}}</div>
                      <div class="">￥{{item.ORI_PRICE | moneyFilter}}</div>
                    </div>
                  </div>
                </van-list>
              </van-pull-refresh>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import { Toast } from 'vant'
import { toMoney } from '@/filter/moneyFilter.js'
export default {
  name: 'CategoryList',
  data () {
    return {
      errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
      category: [],
      categoryIndex: 0,
      categorySub: [],
      active: 0, // 激活标签的值
      loading: false, // 上拉加载使用
      finished: false, // 下拉加载是否没有数据了
      isRefresh: false, // 下拉加载
      page: 1, // 商品列表信息
      num: 10, // 每页显示数量
      categorySubId: '', // 小类id
      goodList: [] // 商品列表
    }
  },
  filters: {
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  created () {
    this.getCategory()
    setTimeout(() => {
      this.getCategorySubByCategoryId(this.category[0].ID)
    }, 500)
  },
  mounted () {
    let winHeight = document.documentElement.clientHeight
    document.getElementById('leftNav').style.height = winHeight - 46 + 'px'
    document.getElementById('list-div').style.height = winHeight - 90 + 'px'
  },
  methods: {
    onRefresh () {
      setTimeout(() => {
        this.page = 1
        this.isRefresh = false
        this.goodList = []
        this.onLoad()
      }, 500)
    },
    onLoad () {
      setTimeout(() => {
        this.categorySubId = this.categorySubId ? this.categorySubId : this.categorySub[0].ID
        this.getGoodList()
      }, 1000)
    },
    // 点击大类的方法
    clickCategory (index, categoryId) {
      this.categoryIndex = index
      this.page = 1
      this.finished = false
      this.goodList = []
      // 根据大分类id获取小分类
      this.getCategorySubByCategoryId(categoryId)
    },
    /** 获取大分类 **/
    getCategory () {
      this.$http.get(
        url.getCateGoryList,
        {}
      ).then(res => {
        console.log(res)
        if (res.data.code === 200 && res.data.msg) {
          this.category = res.data.msg
          this.categorySubId = res.data.msg[0].ID
        } else {
          Toast('服务器错误，数据取得失败')
        }
      }).catch(err => {
        console.log(err)
        Toast('服务器错误，数据取得失败')
      })
    },
    /** 根据大类ID读取小类类别列表 **/
    getCategorySubByCategoryId (categoryId) {
      this.$http.post(
        url.getCateGorySubList,
        {categoryId: categoryId}
      ).then(res => {
        console.log(res)
        if (res.data.code === 200 && res.data.msg) {
          this.categorySub = res.data.msg
          this.active = 0
          this.page = 0
          this.categorySubId = this.categorySub[0].ID
          this.goodList = []
          this.finished = false
          this.onLoad()
          // setTimeout(() => {
          // 获取小分类商品
          this.onClickCategorySub(0)
          // }, 50)
        } else {
          Toast('服务器错误，数据取得失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /** 根据小分类id获取商品列表 **/
    getGoodList () {
      this.$http.post(
        url.getGoodsListByCategorySubID,
        {
          categorySubId: this.categorySubId,
          page: this.page,
          num: this.num
        }
      ).then(res => {
        console.log(res)
        if (res.data.code === 200 && res.data.msg.length) {
          this.page++
          this.goodList = this.goodList.concat(res.data.msg)
        } else {
          this.finished = true
        }
        this.loading = false
        console.log(this.finished)
      }).catch(err => {
        console.log(err)
      })
    },
    /** 点击子类获取商品列表 **/
    onClickCategorySub (index, title) {
      console.log(index)
      this.categorySubId = this.categorySub[index].ID
      this.goodList = []
      this.finished = false
      this.page = 1
      this.onLoad()
    },
    /** 跳转商品详情页 **/
    goGoodsInfo (id) {
      this.$router.push(`/Goods?goodsId=${id}`)
      // this.$router.push({name: 'Goods', params: {goodsId: id}})
    }
  }
}
</script>

<style scoped>
  #leftNav {
    background: #f5f5f5;
  }
  #leftNav ul li {
    line-height: 2rem;
    border-bottom:1px solid #E4E7ED;
    padding:3px;
    font-size:0.8rem;
    text-align: center;
  }
  .categoryActive{
    background-color: #ffb612;
  }
  .list-item{
    text-align: center;
    line-height: 80px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
  }
  #list-div{
    overflow: scroll;
  }
  .list-item{
    display: flex;
    flex-direction: row;
    font-size:0.8rem;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    padding:5px;
    height: 90px;
    line-height: 90px;
  }
  #list-div{
    overflow: scroll;
  }
  .list-item-img{
    flex:8;
  }
  .list-item-text{
    flex:16;
    margin-top:10px;
    margin-left:10px;
    line-height: 1.5em;
    text-align: left;
  }
  .list-item-text div {
    display: inline-block;
  }
</style>
