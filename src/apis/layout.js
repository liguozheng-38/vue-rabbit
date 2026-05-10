import httpInstance from "@/utils/http";
// 获取分类列表
export function getCategoryAPI() {
  return httpInstance({
    url: "https://pcapi-xiaotuxian-front-devtest.itheima.net/home/category/head",
  });
}
