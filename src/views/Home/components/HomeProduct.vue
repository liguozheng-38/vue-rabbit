<script setup>
import HomePanel from './HomePanel.vue'
import { ref, onMounted } from 'vue'
import { getGoodsAPI } from '@/apis/home'
import GoodsItem from './GoodsItem.vue'
// 获取数据列表
const goodsProduct = ref([])
const loading = ref(true)

const getGoodsProduct = async () => {
  loading.value = true
  const res = await getGoodsAPI()
  console.log(res)
  goodsProduct.value = res.result
  loading.value = false
}

onMounted(() => getGoodsProduct())
</script>

<template>
  <div class="home-product">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-wrapper">
          <HomePanel title="商品推荐">
            <template #main>
              <div class="box">
                <el-skeleton-item variant="image" style="width: 240px; height: 610px" />
                <div class="skeleton-goods">
                  <div v-for="i in 8" :key="i" class="skeleton-item">
                    <el-skeleton-item variant="image" style="width: 240px; height: 200px" />
                    <el-skeleton-item variant="text" style="width: 80%; margin-top: 12px" />
                    <el-skeleton-item variant="text" style="width: 50%; margin-top: 8px" />
                  </div>
                </div>
              </div>
            </template>
          </HomePanel>
        </div>
      </template>
      <template #default>
        <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
          <template #main>
            <div class="box">
              <RouterLink class="cover" to="/">
                <img v-img-lazy="cate.picture" />
                <strong class="label">
                  <span>{{ cate.name }}</span>
                  <span>{{ cate.saleInfo }}</span>
                </strong>
              </RouterLink>
              <ul class="goods-list">
                <li v-for="good in cate.goods" :key="good.id">
                  <GoodsItem :goods="good" />
                </li>
              </ul>
            </div>
          </template>
        </HomePanel>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.home-product {
  background: #fff;
  margin-top: 20px;

  .sub {
    margin-bottom: 2px;

    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;

      &:hover {
        background: $xtxColor;
        color: #fff;
      }

      &:last-child {
        margin-right: 80px;
      }
    }
  }

  .box {
    display: flex;

    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }

    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}

html.dark .home-product {
  background: #1e293b;
}
</style>
