import Toast from './Toast.vue'

const obj={}

obj.install=function(Vue){
  

  Vue.prototype.$toast=Toast
}

export default obj