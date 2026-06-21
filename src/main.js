import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/common.scss'
import App from './App.vue'
import router from './router'
// 引入懒加载指令插件并且注册
import { lazyPlugin } from '@/directives/index'
// 引入全局组件插件
import { componentPlugin } from '@/components/index'
// 注册持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 按需引入需要的Element Plus图标
import { MoonNight, Sunny } from '@element-plus/icons-vue'
// 引入Element Plus暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)
// 按需注册图标组件
app.component('MoonNight', MoonNight)
app.component('Sunny', Sunny)
app.mount('#app')
