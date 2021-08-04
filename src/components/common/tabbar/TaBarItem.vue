<template>
  <div class="tab-item" @click="itemClick">
    <div v-if="!isactive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name:'TabBarItem',
  props:{
    path:String,
    activeColor:{
      type:String,
      default:'red'
    }
  },
  data() {
    return {
      // isactive:true

    }
  },
  computed:{
    isactive(){
      return this.$route.path.indexOf(this.path)!== -1
    },
    activeStyle(){
      return this.isactive?{color:this.activeColor}:{}
    }
  },
  methods: {
    itemClick(){
      this.$router.replace(this.path)
    }
  },
}
</script>

<style>
.tab-item{
    flex: 1;
    height: 49px;
    text-align: center;
    font-size: 14px;
  }
  .tab-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>