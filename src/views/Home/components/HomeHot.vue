<script setup>
import HomePanel from './HomePanel.vue'
import { getHotAPI } from '@/apis/home'
import { ref, onMounted } from 'vue'

const hotList = ref([])
const loading = ref(true)

const getHotList = async () => {
  loading.value = true
  const res = await getHotAPI()
  // console.log(res)
  hotList.value = res.result
  loading.value = false
}
onMounted(() => getHotList())
</script>

<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <template #main>
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="skeleton-list">
            <div v-for="i in 4" :key="i" class="skeleton-item">
              <el-skeleton-item variant="image" style="width: 306px; height: 306px" />
              <el-skeleton-item variant="text" style="width: 80%; margin-top: 12px" />
              <el-skeleton-item variant="text" style="width: 60%; margin-top: 8px" />
            </div>
          </div>
        </template>
        <template #default>
          <ul class="goods-list">
            <li v-for="item in hotList" :key="item.id">
              <RouterLink :to="`/detail/${item.id}`">
                <img v-img-lazy="item.picture" alt="" />
                <!-- <img :src="item.picture" alt="" /> -->
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
        </template>
      </el-skeleton>
    </template>
  </HomePanel>
</template>

<style scoped lang="scss">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    transition: all 0.5s;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}

.skeleton-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
}

.skeleton-item {
  width: 306px;
  height: 406px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
