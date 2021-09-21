import Vue from 'vue'
import Vuex from 'vuex'

import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

Vue.use(Vuex)

const state={
  // 用来记录添加到的商品信息[{},{},{}]
  cartList:[]
}
const store =new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store