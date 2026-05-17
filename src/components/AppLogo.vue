<template>
  <!-- Logo completo -->
  <div v-if="!small" class="flex items-center gap-2 select-none">
    <!-- Corazón SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26">
      <path d="M14 24 C14 24 2 15 2 8 C2 4.1 5.1 1 9 1 C11.2 1 13.2 2.2 14 4 C14.8 2.2 16.8 1 19 1 C22.9 1 26 4.1 26 8 C26 15 14 24 14 24 Z"
        fill="#f43f5e"/>
    </svg>
    <!-- Texto -->
    <div class="flex flex-col leading-none">
      <span class="font-extrabold text-[17px] tracking-tight" :style="{ color: textColor }">100 Citas</span>
      <span class="font-semibold text-[9px] tracking-[0.2em] text-rose-500 mt-0.5">BOLIVIA</span>
    </div>
  </div>

  <!-- Solo corazón (sidebar colapsado) -->
  <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="13" fill="#f43f5e"/>
    <path d="M14 21 C14 21 6 15 6 10 C6 7.2 8.2 5 11 5 C12.5 5 13.8 5.8 14 7 C14.2 5.8 15.5 5 17 5 C19.8 5 22 7.2 22 10 C22 15 14 21 14 21 Z"
      fill="#ffffff"/>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  dark?: boolean
  small?: boolean
}>(), {
  dark: false,
  small: false,
})

const textColor = computed(() => props.dark ? '#ffffff' : '#334155')
</script>
