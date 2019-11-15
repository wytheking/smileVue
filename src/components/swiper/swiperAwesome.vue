<template>
  <div >
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide class="text">
        <div class="centent">
          {{text}}
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'swiperAwesome',
  props: {
    text: {
      type: String,
      default: '这里是一大段文本......'
    }
  },
  data () {
    return {
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        mousewheel: true
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped>
  .swiper{
    height: 300px;
    overflow: hidden;
  }
  .text{
    font-size: 18px !important;
    text-align: left;
    padding:30px;
    height: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

  }
</style>
