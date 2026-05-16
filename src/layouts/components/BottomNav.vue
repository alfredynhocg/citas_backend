<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-gray-900 border-t border-default-200 safe-bottom">
    <div class="flex items-center justify-around h-16 px-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-all"
        :class="isActive(item.to)
          ? 'text-rose-500'
          : 'text-default-400 hover:text-default-600'"
      >
        <div class="relative">
          <Icon :icon="item.icon" class="size-5" />
          <span
            v-if="item.badge"
            class="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()

const navItems = [
  { to: '/dashboard/citas', icon: 'lucide:layout-dashboard', label: 'Inicio',    badge: null },
  { to: '/citas',           icon: 'lucide:heart',            label: 'Citas',     badge: null },
  { to: '/recuerdos',       icon: 'lucide:camera',           label: 'Recuerdos', badge: null },
  { to: '/perfil',          icon: 'lucide:circle-user',      label: 'Perfil',    badge: null },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
