import { request } from "./request";

// 对首页请求到的数据进行封装

export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}

export function getHomeGoods(type,page){
  return request({
    url:'/home/data',
    // 类型
    params:{
      type,
      page
    }
  })
}