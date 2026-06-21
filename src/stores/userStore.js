// 管理用户数据相关
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'
import httpInstance from '@/utils/http'

export const useUserStore = defineStore(
  'user',
  () => {
    const cartStore = useCartStore()
    // 1. 定义管理用户数据的state
    const userInfo = ref()
    // 2. 定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
      const res = await loginAPI({ account, password })
      userInfo.value = res.result

      // 直接将token设置到axios默认headers，确保后续请求能正确携带token
      httpInstance.defaults.headers.common.Authorization = `Bearer ${res.result.token}`

      // // 合并购物车
      // await mergeCartAPI(
      //   cartStore.cartList.map((item) => {
      //     return {
      //       skuId: item.skuId,
      //       selected: item.selected,
      //       count: item.count,
      //     };
      //   }),
      // );
      // cartStore.updateNewList();

      // 合并购物车优化
      const rawCartList = cartStore.cartList?.value ?? cartStore.cartList ?? []
      const cartList = Array.isArray(rawCartList) ? rawCartList : []

      const mergePayload = cartList.map(item => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      }))

      if (mergePayload.length > 0) {
        await mergeCartAPI(mergePayload)
      }
      await cartStore.updateNewList()
    }
    // 退出时清除用户信息
    const clearUserInfo = () => {
      userInfo.value = {}
      // 执行清除购物车的action
      cartStore.clearCart()
    }
    return { userInfo, getUserInfo, clearUserInfo }
  },
  {
    persist: true
  }
)
