<script setup>
import { findNewAPI } from '@/apis/home'
import HomePanel from './HomePanel.vue'
import { ref, onMounted } from 'vue'

const newList = ref([])
const loading = ref(true)

const getNewList = async () => {
  loading.value = true
  const res = await findNewAPI()
  newList.value = res.result
  loading.value = false
}

onMounted(() => getNewList())
</script>

<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <template #main>
      <!-- 插槽模板的使用 -->
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="skeleton-list">
            <div v-for="i in 4" :key="i" class="skeleton-item">
              <el-skeleton-item variant="image" style="width: 306px; height: 306px" />
              <el-skeleton-item variant="text" style="width: 80%; margin-top: 12px" />
              <el-skeleton-item variant="text" style="width: 40%; margin-top: 8px" />
            </div>
          </div>
        </template>
        <template #default>
          <ul class="goods-list">
            <li v-for="item in newList" :key="item.id">
              <RouterLink :to="`/detail/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
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
  height: 406px;

  li {
    width: 306px;
    height: 406px;

    background: #f0f9f4;
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
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      color: $priceColor;
    }
  }
}

.skeleton-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
}

.skeleton-item {
  width: 306px;
  height: 406px;
  background: #f0f9f4;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
