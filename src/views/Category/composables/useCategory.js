// 封装分类数据业务相关代码
import { getCategoryAPI } from '@/apis/category'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref, onMounted } from 'vue'

export function useCategory() {
  const categoryData = ref({})
  const loading = ref(true)
  const route = useRoute()
  const getCategoryData = async (id = route.params.id) => {
    loading.value = true
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
    loading.value = false
  }
  onMounted(() => getCategoryData())
  // 路由守卫，方式二（阻止组件复用）
  // 目标:路由参数变化的时候 可以把分类数据接口重新发送
  onBeforeRouteUpdate(to => {
    // console.log(to)
    // 存在问题：使用最新的路由参数请求最新的分类数据
    getCategoryData(to.params.id)
  })
  return { categoryData, loading }
}
