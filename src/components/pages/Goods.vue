<template>
  <div class="navbar-div">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="topimage-div">
      <img :src="goodsInfo.IMAGE1" width="100%"/>
    </div>
    <div class="goods-name">{{goodsInfo.NAME}}</div>
    <div class="goods-price">价格：¥ {{goodsInfo.PRESENT_PRICE | moneyFilter}} 元</div>
    <div>
      <van-tabs swipeable sticky>
        <van-tab title="商品详情">
          <div class="detail" v-html="goodsInfo.DETAIL">

          </div>
        </van-tab>
        <van-tab title="评价">
          正在制作中
        </van-tab>
      </van-tabs>
    </div>

    <div class="goods-bottom">
      <div>
        <van-button size="large" type="primary" @click="addGoodsToCart">加入购物车</van-button>
      </div>
      <div>
        <van-button size="large" type="danger">直接购买</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import url from '@/serviceAPI.config.js'
import { toMoney } from '@/filter/moneyFilter.js'
export default {
  name: 'Goods',
  data () {
    return {
      goodsId: '',
      goodsInfo: {} // 商品详细数据
    }
  },
  filters: {
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  created () {
    this.goodsId = this.$route.query.goodsId ? this.$route.query.goodsId : this.$route.params.goodsId
    this.getInfo()
  },
  methods: {
    /**
     * 返回
     */
    onClickLeft () {
      this.$router.go(-1)
    },
    /**
     * 获取商品信息
     */
    getInfo () {
      this.$http.post(
        url.getDetailGoodsInfo,
        {
          goodsId: this.goodsId
        })
        .then(res => {
          console.log(res)
          if (res.data.code === 200 && res.data.msg) {
            this.goodsInfo = res.data.msg
          } else {
            Toast('服务器错误，数据取得失败')
          }
        })
        .catch(err => {
          console.log(err)
          Toast('服务器错误，数据取得失败')
        })
    },
    addGoodsToCart () {
      // 取出购物车内的商品数据
      let cartInfo = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : []
      // 判断购物车内是否已经有这个商品
      // 如果没有返回undeifnd，如果有返回第一个查找到的数据
      let isHaveGoods = cartInfo.find(cart => cart.goodsId === this.goodsId)
      console.log(isHaveGoods)
      if (!isHaveGoods) {
        // 没有商品直接添加到数组中
        // 重新组成添加到购物车的信息
        let newGoodsInfo = {
          goodsId: this.goodsInfo.ID,
          Name: this.goodsInfo.NAME,
          price: this.goodsInfo.PRESENT_PRICE,
          image: this.goodsInfo.IMAGE1,
          count: 1
        }
        cartInfo.push(newGoodsInfo) // 添加到购物车
        localStorage.cartInfo = JSON.stringify(cartInfo) // 操作本地数据
        Toast.success('添加成功')
      } else {
        Toast.success('已有此商品')
      }
      this.$router.push({name: 'Cart'}) // 进行跳转
    }
  }
}
</script>

<style scoped>
  .detail{
    font-size:0px;
  }
  .goods-name{
    background-color: #fff;
    padding: 15px;
  }
  .goods-price{
    padding: 0 15px 10px 15px;
    background-color: #fff;
  }
  img {
    outline: none;
    display: block;
  }
  .goods-bottom{
    position: fixed;
    bottom:0px;
    left:0px;
    background-color: #FFF;
    width:100%;

    display: flex;
    flex-direction: row;
    flex-flow: nowrap;
  }
  .goods-bottom > div{
    flex:1;
    padding:5px;
  }
</style>
