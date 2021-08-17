<template>
  <div class="goods-list">
    <goods-list-item v-for='(item,index) in goods' :key='index' 
                    :goodsItem="item" 
                    class="item">
    </goods-list-item>

  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
  name:'GoodsList',
  props:{
    goods:{
      type:Array,
      default(){
        return []
      }
    }
  },
  components:{
    GoodsListItem
  }
}
</script>

<style scoped>
 .goods-list {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: space-around;
    /* justify-content: space-evenly; */
  }

  .goods-list .item {
    width: 48%;
  }
</style>