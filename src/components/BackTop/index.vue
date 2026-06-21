<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const isAnimating = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > 400
}

const scrollToTop = () => {
  if (isAnimating.value) return
  isAnimating.value = true

  const duration = 500
  const startTime = performance.now()
  const startScroll = window.scrollY

  const animate = currentTime => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    window.scrollTo(0, startScroll * (1 - easeOutCubic))

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isAnimating.value = false
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="backtop">
    <button v-show="isVisible" @click="scrollToTop" class="back-top" aria-label="回到顶部">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="back-top-icon"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped lang="scss">
.back-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #27ba9b 0%, #1dc779 100%);
  border: none;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(39, 186, 155, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(39, 186, 155, 0.6);
  }

  &:active {
    transform: translateY(-2px);
  }
}

.back-top-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.back-top:hover .back-top-icon {
  transform: translateY(-2px);
}

.backtop-enter-active,
.backtop-leave-active {
  transition: all 0.3s ease;
}

.backtop-enter-from,
.backtop-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .back-top {
    right: 20px;
    bottom: 20px;
    width: 44px;
    height: 44px;
  }

  .back-top-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
