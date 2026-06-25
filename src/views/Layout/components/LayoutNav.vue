<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'

const userStore = useUserStore()
const router = useRouter()

// useDark 自动实现：localStorage 持久化 + <html> class 切换 + 系统偏好检测
const dark = useDark()

const confirm = () => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="userStore.userInfo?.token">
          <li>
            <a href="javascript:;"
              ><i class="iconfont icon-user"></i>{{ userStore.userInfo.account }}</a
            >
          </li>
          <li>
            <el-popconfirm
              @confirm="confirm"
              title="确认退出吗?"
              confirm-button-text="确认"
              cancel-button-text="取消"
            >
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          <li><a href="javascript:;" @click="$router.push('/member/order')">我的订单</a></li>
          <li><router-link to="/member">会员中心</router-link></li>
          <li><router-link to="#footer">关于我们</router-link></li>
          <li>
            暗黑模式
            <el-switch v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" />
          </li>
        </template>
        <template v-else>
          <li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
          <li><router-link to="#footer">帮助中心</router-link></li>
          <li><router-link to="#footer">关于我们</router-link></li>
          <li>
            <el-switch v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" />
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-topnav {
  background: #333;

  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;

    li {
      color: #cdcdcd;
      padding: 0 15px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      gap: 5px;

      a {
        color: #cdcdcd;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        pointer-events: auto;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $xtxColor;
        }
      }

      ~ li {
        border-left: 2px solid #666;
      }
    }
  }
}

.dark .app-topnav {
  background: #1a1a2e;
}

.dark .app-topnav li {
  color: #e4e4e4;
}

.dark .app-topnav li a {
  color: #e4e4e4;
}

.dark .app-topnav li ~ li {
  border-left-color: #333;
}
</style>
