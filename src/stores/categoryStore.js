import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoryAPI } from '@/apis/layout'

export const useCategoryStore = defineStore('category', () => {
  // 导航列表的数据管理
  // state 导航列表数据
  const categoryList = ref([])
  // 加载状态
  const loading = ref(true)
  // action 获取导航数据的方法
  const getCategory = async () => {
    loading.value = true
    const res = await getCategoryAPI()
    categoryList.value = res.result
    loading.value = false
  }
  return { categoryList, loading, getCategory }
})
