<template>
  <svg v-if="small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-9 w-9 select-none" aria-label="100 Citas">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#f43f5e"/>
  </svg>

  <img
    v-else
    :src="logoSrc"
    alt="100 Citas Juntos"
    class="h-16 w-44 object-contain select-none"
  />
</template>

<script setup lang="ts">
import logoImg from '@/assets/images/logo.png'

withDefaults(defineProps<{
  dark?: boolean
  small?: boolean
}>(), {
  dark: false,
  small: false,
})

const logoSrc = logoImg
</script>
