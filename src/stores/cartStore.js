import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, getNewCartListAPI, delCartAPI } from '@/apis/cart'

export const useCartStore = defineStore(
  'cart',
  () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    // 定义state
    const cartList = ref([])
    //定义action
    // 加入购物车
    const addCart = async goods => {
      const { skuId, count } = goods
      if (isLogin.value) {
        const res = await insertCartAPI({ skuId, count })
        await updateNewList()
        return res
      } else {
        const item = cartList.value.find(item => goods.skuId === item.skuId)
        if (item) {
          item.count++
        } else {
          // 已添加过 - count + 1
          // 没有添加过 - 直接push
          cartList.value.push(goods)
        }
        return { code: 200 }
      }
    }
    // 删除购物车
    const delCart = async skuId => {
      if (isLogin.value) {
        await delCartAPI([skuId])
        await updateNewList()
      } else {
        const index = cartList.value.findIndex(item => item.skuId === skuId)
        cartList.value.splice(index, 1)
      }
    }
    // 总数，总价统计
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))

    // 获取最新购物车列表action
    const updateNewList = async () => {
      const res = await getNewCartListAPI()
      cartList.value = res.result
    }

    // 清除购物车
    const clearCart = () => {
      cartList.value = []
    }

    // 单选框action
    const singleCheck = (skuId, selected) => {
      const item = cartList.value.find(item => item.skuId === skuId)
      item.selected = selected
    }

    // const isAll = computed(() => cartList.value.every((item) => item.selected === true));
    // 多选框action
    // 是否全选
    const isAll = computed(() => cartList.value.every(item => item.selected))
    const checkAll = selected => {
      cartList.value.forEach(item => (item.selected = selected))
    }
    // 3. 已选择数量
    const selectedCount = computed(() =>
      cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0)
    )
    // 4. 已选择商品价钱合计
    const selectedPrice = computed(() =>
      cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0)
    )
    return {
      cartList,
      addCart,
      delCart,
      allCount,
      allPrice,
      singleCheck,
      checkAll,
      isAll,
      selectedCount,
      selectedPrice,
      clearCart,
      updateNewList
    }
  },
  {
    persist: true
  }
)
