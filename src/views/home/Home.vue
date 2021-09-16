<template>
  <div id="home">
    <!-- 顶部导航 -->
    <nav-bar class="home-nav"><div slot="center">商品秀</div></nav-bar>
    <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        class="tabControl"
        v-show="isTabFixed"
      ></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probeType="3" 
            @scroll="contentScroll"
            :pullUpLoad="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import HomeSwiper from "../home/childComps/HomeSwiper.vue";
import RecommendView from "../home/childComps/RecommendView.vue";

import FeatureView from "../home/childComps/FeatureView.vue";
import TabControl from "../../components/content/tabControl/TabControl.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import BackTop from "../../components/content/backTop/BackTop.vue"

import { getHomeMultidata, getHomeGoods } from "../../network/home";
import {debounce} from "../../common/utils"

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      // 请求数据
      banners: [],
      recommends: [],
      goods: {
        // 默认把第一页的数据请求下来，直到下拉加载更多的时候才会把更多的数据请求下来
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // 1.保存y值
    this.saveY=this.$refs.scroll.getScrollY()
  },
  // 组件创建完后发送网络请求
  created() {
    // created只写业务请求，把逻辑部分写到methods里面

    // 1.请求轮播图多个数据
    this.getHomeMultidata();
    // 请求首页商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");   
  },
  mounted() {
    // 因为在created中拿不到$ref
    // 1.图片加载完成的事件监听
    // 30张图片，每加载一次调用一次，调用的太频繁，用防抖来优化
    const refresh=debounce(this.$refs.scroll.refresh,200)
    // 3.监听item中图片加载完成
    this.$bus.$on('itemImageLoad',()=>{
      refresh()
    })
  },
  methods: {
    // 事件监听相关的方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex=index;
      this.$refs.tabControl2.currentIndex=index;
    },
    // 返回顶部
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    
    contentScroll(position){
      // 判断BackTop是否显示
      this.isShowBackTop=(-position.y)>1000

      // 决定tabConttrol是否吸顶(position:fixed)
      this.isTabFixed=(-position.y)>this.tabOffsetTop 
    },
    loadMore(){
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType)
      // 刷新，重新计算滚动搞度
      // this.$refs.scroll.refresh()
    },
    swiperImageLoad(){
      this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关的方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // page为以后上拉加载更多铺垫
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        // 既然多了一组数据，给page+1
        this.goods[type].page +=1;
        
        // 刷新.完成了下拉加载更多
        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>

<style scoped>
#home {
  position: relative;
  /* padding-top: 44px; */
  height: 100vh;
  
}
.home-nav {
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
  background-color: var(--color-tint);
  color: #fff;
}
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tabControl{
  position: relative;
  z-index: 9;
}
/* 
.fixed{
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
} */
</style>
