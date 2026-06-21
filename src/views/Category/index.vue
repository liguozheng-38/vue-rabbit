<script setup>
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
import { useBanner } from './composables/useBanner'
import { useCategory } from './composables/useCategory'

const { bannerList, loading: bannerLoading } = useBanner()
const { categoryData, loading: categoryLoading } = useCategory()
</script>

<template>
  <div class="top-category">
    <div class="container m-top-20">
      <!-- 面包屑 -->
      <div class="bread-container">
        <el-skeleton :loading="categoryLoading" animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 200px" />
          </template>
          <template #default>
            <el-breadcrumb separator=">">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </template>
        </el-skeleton>
      </div>
      <!-- 轮播图 -->
      <div class="home-banner">
        <el-skeleton :loading="bannerLoading" animated>
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
      <!-- 分类列表渲染 -->
      <el-skeleton :loading="categoryLoading" animated>
        <template #template>
          <div class="sub-list">
            <h3>全部分类</h3>
            <ul class="skeleton-ul">
              <li v-for="i in 8" :key="i">
                <el-skeleton-item variant="image" style="width: 100px; height: 100px" />
                <el-skeleton-item variant="text" style="width: 80px; margin-top: 10px" />
              </li>
            </ul>
          </div>
        </template>
        <template #default>
          <div class="sub-list">
            <h3>全部分类</h3>
            <ul>
              <li v-for="i in categoryData.children" :key="i.id">
                <RouterLink :to="`/category/sub/${i.id}`">
                  <img :src="i.picture" />
                  <p>{{ i.name }}</p>
                </RouterLink>
              </li>
            </ul>
          </div>
          <div class="ref-goods" v-for="item in categoryData.children" :key="item.id">
            <div class="head">
              <h3>- {{ item.name }}-</h3>
            </div>
            <div class="body">
              <GoodsItem v-for="good in item.goods" :goods="good" :key="good.id" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <XtxBackTop />
  </div>
</template>

<style scoped lang="scss">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: space-around;
      padding: 0 40px 30px;
    }
  }

  .bread-container {
    padding: 25px 0;
  }
}

html.dark .top-category {
  h3 {
    color: #aaa;
  }

  .sub-list {
    background-color: #1e293b;

    li a {
      color: #e4e4e4;
    }
  }

  .ref-goods {
    background-color: #1e293b;

    .head h3 {
      color: #aaa;
    }
  }
}

.home-banner {
  width: 1240px;
  height: 500px;
  margin: 0 auto;
  // position: absolute;
  // left: 0;
  // top: 0;
  // z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>
