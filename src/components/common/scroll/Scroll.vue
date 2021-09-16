<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name:'Scroll',
  props:{
    // 传过来的值决定滚动监听不监听
    probeType:{
      type:Number,
      default:0
    },
    pullUpLoad:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      scroll:null
    }
  },
  mounted() { 
    // 1.创建BScroll对象
    this.scroll=new BScroll(this.$refs.wrapper,{
      click:true,
      // 采用封装的思想，不会影响性能
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad
    })
    // 2.监听滚动的位置
    this.scroll.on('scroll',(position)=>{
      this.$emit('scroll',position)
    })
    
    // 3.监听scroll滚动到底部
    if(this.pullUpLoad){
     this.scroll.on('pullingUp',()=>{
      this.$emit('pullingUp')
      // console.log('上拉加载更多');
    })
    }
  },
  methods:{
    scrollTo(x,y,time=300){
      this.scroll&&this.scroll.scrollTo(x,y,time)
    },
    finishPullUp(){
      this.scroll&&this.scroll.finishPullUp()
    },
    refresh(){
    
      this.scroll&&this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll ? this.scroll.y :0
    }
  }
}
</script>

<style>

</style>