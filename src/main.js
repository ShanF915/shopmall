import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Toast from './components/common/toast/index'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.$bus=new Vue()
// Vue.use(Toast)

// 解决300ms延迟
FastClick.attach(document.body)

// 使用懒加载的插件
Vue.use(VueLazyLoad)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
