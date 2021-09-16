<template>
  <swiper>
        <swiper-item v-for='(item,index) in banners' :key="index">
         <!-- 图片是一个链接，点进去就会跳转到 -->
          <a :href="item.link">
            <img :src="item.image" alt="" @load="imageLoad">
          </a>
        </swiper-item>
    </swiper>
</template>

<script>
import {Swiper,SwiperItem} from '../../../components/common/swiper/index'
export default {
  name:'HomeSwiper',
  props:{
    banners:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      // 4张图片只需要发射出去一次事件
      isLoad:false
    }
  },
  components:{
    Swiper,
    SwiperItem
  },
  methods: {
    // 监听轮播图是否加载完
    imageLoad(){
      // 只需要发射出一次事件
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad=true
      }
      
    } 
  },
}
</script>

<style>

</style>