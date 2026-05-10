// 封装倒计时逻辑函数
import { computed, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
export const useCountDown = () => {
  // 1. 响应式的数据
  let timer = null;
  const time = ref(0);
  // 格式化时间 为 xx分xx秒
  const formatTime = computed(() => dayjs.unix(time.value).format("mm分ss秒"));
  // 2. 开启倒计时的函数
  const start = (currentTime = 1800) => {
    // 开始倒计时的逻辑
    // 核心逻辑的编写：每隔1s就减一
    time.value = currentTime;
    timer = setInterval(() => {
      time.value--;
      // 倒计时到 0 → 停止并清除定时器
      if (time.value <= 0) {
        time.value = 0;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  };
  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (timer) {
      // 停止定时器
      clearInterval(timer);
      // 清空变量 = 彻底销毁
      timer = null;
    }
  });
  return {
    formatTime,
    start,
  };
};
