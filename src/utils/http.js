import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/userStore'
import router from '@/router/index'

// 创建axios实例
const httpInstance = axios.create({
  // baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  baseURL: '/api',
  timeout: 50000
})

// axios请求拦截器
httpInstance.interceptors.request.use(
  config => {
    // 1. 从pinia获取token数据
    const userStore = useUserStore()
    // 2. 按照后端的要求拼接token数据
    const token = userStore.userInfo?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  e => Promise.reject(e)
)

// axios响应式拦截器
httpInstance.interceptors.response.use(
  res => res.data,
  e => {
    const userStore = useUserStore()
    //     console.log("wwwwwwwww",e.response);
    // /统一错误提示
    // ElMessage({ type:"error"，message:e.response?.data?.message });
    // if (e.response.status ===401){

    // 1. 网络错误（无响应）
    if (!e.response) {
      if (e.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请稍后重试')
      } else {
        ElMessage.error('网络异常，请检查网络连接')
      }
      return Promise.reject(e)
    }

    const { status, data } = e.response

    // 2. 401 未授权
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      userStore.clearUserInfo()
      router.push('/login')
      return Promise.reject(e)
    }

    // 3. 403 禁止访问
    if (status === 403) {
      ElMessage.error('您没有权限访问此资源')
      return Promise.reject(e)
    }

    // 4. 500 服务器错误
    if (status >= 500) {
      ElMessage.error('服务器内部错误，请稍后重试')
      return Promise.reject(e)
    }

    // 5. 其他错误使用后端返回的消息
    ElMessage.error(data?.message || '请求失败')
    return Promise.reject(e)
  }
)

export default httpInstance
