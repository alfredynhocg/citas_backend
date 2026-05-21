<template>
  <div
    class="flex flex-col items-center justify-center gap-6"
    :class="fullPage ? 'min-h-[60vh]' : 'py-16'"
  >
    <div class="relative flex items-center justify-center">
      <svg class="absolute animate-spin-slow" width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="url(#ring-gradient)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="180 160"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
            <stop offset="100%" stop-color="#fb7185" stop-opacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <div class="absolute w-24 h-24 rounded-full border-2 border-rose-200 animate-ping-slow" />

      <img
        :src="logoSrc"
        alt="Cargando..."
        class="relative w-16 h-16 object-contain select-none z-10"
      />
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-default-500 tracking-wide">{{ label }}</p>
      <div class="flex gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce-dot" style="animation-delay: 0ms" />
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce-dot" style="animation-delay: 150ms" />
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce-dot" style="animation-delay: 300ms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/images/logo.png'

withDefaults(defineProps<{
  fullPage?: boolean
  label?: string
}>(), {
  fullPage: false,
  label: 'Cargando',
})

const logoSrc = logoImg
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes ping-slow {
  0%, 100% { transform: scale(1);   opacity: 0.4; }
  50%       { transform: scale(1.15); opacity: 0; }
}
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1; }
}

.animate-spin-slow   { animation: spin-slow  2.4s linear infinite; }
.animate-ping-slow   { animation: ping-slow  1.8s ease-in-out infinite; }
.animate-bounce-dot  { animation: bounce-dot 1.2s ease-in-out infinite; }
</style>
