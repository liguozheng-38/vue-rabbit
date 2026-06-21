// 封装banner轮播图相关的业务代码
import { ref, onMounted } from 'vue'
import { getBannerAPI } from '@/apis/home'
// import { useRoute } from "vue-router";

export function useBanner() {
  const bannerList = ref([])
  const loading = ref(true)
  const getBanner = async () => {
    loading.value = true
    // const route = useRoute();
    const res = await getBannerAPI({ distributionSite: 2 })
    // console.log(res);
    bannerList.value = res.result
    loading.value = false
  }
  onMounted(() => getBanner())
  return { bannerList, loading }
}
