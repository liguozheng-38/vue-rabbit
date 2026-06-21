<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchHotGoodsAPI } from '@/apis/detail'
import { useRoute } from 'vue-router'
// 设计props参数 适配不同的title和数据
const props = defineProps({
  hotType: {
    type: Number
  }
})
// 数值映射
const TYPEMAP = {
  1: '24小时热榜',
  2: '周热榜'
}
const title = computed(() => TYPEMAP[props.hotType])
const goodList = ref([])
const loading = ref(true)
const route = useRoute()
const getHotList = async () => {
  loading.value = true
  const res = await fetchHotGoodsAPI({
    id: route.params.id,
    type: props.hotType
  })
  goodList.value = res.result
  loading.value = false
}
onMounted(() => getHotList())
</script>

<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品区块 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="goods-item skeleton-item" v-for="i in 3" :key="i">
          <el-skeleton-item variant="image" style="width: 160px; height: 160px" />
          <el-skeleton-item variant="text" style="width: 80%; margin-top: 10px" />
          <el-skeleton-item variant="text" style="width: 60%; margin-top: 8px" />
          <el-skeleton-item variant="text" style="width: 40%; margin-top: 8px" />
        </div>
      </template>
      <template #default>
        <RouterLink to="/" class="goods-item" v-for="item in goodList" :key="item.id">
          <img :src="item.picture" alt="" />
          <p class="name ellipsis">{{ item.name }}</p>
          <p class="desc ellipsis">{{ item.desc }}</p>
          <p class="price">&yen;{{ item.price }}</p>
        </RouterLink>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.goods-hot {
  h3 {
    height: 70px;
    background: $helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .goods-item {
    display: block;
    padding: 20px 30px;
    text-align: center;
    background: #fff;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }
}

html.dark .goods-hot {
  .goods-item {
    background: #1e293b;

    .name {
      color: #e4e4e4;
    }

    .desc {
      color: #aaa;
    }
  }
}
</style>
