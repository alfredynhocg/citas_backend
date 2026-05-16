import { ref, onMounted } from 'vue'

export function useCountUp(target: number, duration = 1200) {
  const current = ref(0)

  onMounted(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      current.value = Math.floor(progress * target)
      if (progress < 1) requestAnimationFrame(step)
      else current.value = target
    }
    requestAnimationFrame(step)
  })

  return current
}
