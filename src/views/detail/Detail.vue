<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detailInfo="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="params"
        :paramInfo="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :commentInfo="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
    <toast :message='message' :show="show"></toast>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import DetailBottomBar from './childComps/DetailBottomBar.vue';

import Scroll from "../../components/common/scroll/Scroll.vue";
import BackTop from '../../components/content/backTop/BackTop.vue';
import Toast from '../../components/common/toast/Toast.vue'

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "../../network/detail";
import { debounce } from '../../common/utils';



export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY:null,
      currentIndex:0,
      isShowBackTop:false,
      message:'',
      show:false
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Toast
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

      // 2.根据iid请求数据
    getDetail(this.iid).then((res) => {
        // 1.获取顶部的图片轮播数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages;

        // 2.获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4.获取商品详细信息
      this.detailInfo = data.detailInfo;
      
      // 5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    // 4.
    this.getThemeTopY=debounce(()=>{
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop||this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)
    },100)
  },
  mounted() {
    const refresh=debounce(this.$refs.scroll.refresh,200)
    // 3.监听item中图片加载完成
    this.$bus.$on('detailItemImgLoad',()=>{
      refresh()
    })
  },
  methods: {
    imageLoad() {
      // 计算高度
      this.$refs.scroll.refresh();
      // 在图片 加载完拿到正确的offsettop
      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
    },
    contentScroll(position){
      // 1.获取y值
      const positionY=-position.y

      let length=this.themeTopYs.length;
      // 2.和主题中的值进行对比
      for(let i=0;i< length-1;i++){
        
      // 用currentIndex!==i进行优化，
        if(this.currentIndex!==i&&(positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
          this.currentIndex=i;
          this.$refs.nav.currentIndex=this.currentIndex;
        }
        // if(this.currentIndex!==i&&(i<length-1 &&positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])||(i==length-1 &&positionY>=this.themeTopYs[i])){
        //   this.currentIndex=i;
        //   this.$refs.nav.currentIndex=this.currentIndex
        // }
      }
      // 3.是否显示回到顶部
      this.isShowBackTop=-position.y>1000
    },
    backTop(){
      this.$refs.scroll.scrollTo(0,0,300)
    },
    addToCart(){
      // 1.获取购物车展示的信息
      const product={};
      product.image=this.topImages[0];
      product.title=this.goods.title;
      product.desc=this.goods.desc;
      product.price=this.goods.realPrice;
      product.iid=this.iid;

      // 2.将商品添加到购物车中
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart',product)
      this.$store.dispatch('addCart',product).then(res=>{
        this.show=true;
        this.message=res;

        setTimeout(()=>{
          this.show=false;
          this.message=''
        },1500)
      })
    }
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 10;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>