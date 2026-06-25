<script setup>
import { getBannerAPI } from '@/apis/home'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const bannerList = ref([])
const loading = ref(true)

const getBanner = async () => {
  loading.value = true
  const route = useRoute()
  const res = await getBannerAPI({ distributionSite: route.params.distributionSite })
  bannerList.value = res.result
  loading.value = false
}

onMounted(() => getBanner())
</script>

<template>
  <div class="home-banner">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 1240px; height: 500px" />
      </template>
      <template #default>
        <el-carousel height="500px">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <img :src="item.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>
