<template>
  <aside id="app-menu" class="app-menu">
    <RouterLink to="/dashboard/citas" class="logo-box sticky top-0 flex min-h-topbar-height items-center justify-start px-6 backdrop-blur-xs">
      <div class="logo-light">
        <AppLogo class="logo-lg" />
        <AppLogo small class="logo-sm" />
      </div>
      <div class="logo-dark">
        <AppLogo dark class="logo-lg" />
        <AppLogo dark small class="logo-sm" />
      </div>
    </RouterLink>

    <div class="absolute top-0 end-5 flex h-topbar items-center justify">
      <button id="button-hover-toggle" class="" @click="toggleSidebar">
        <Icon icon="tabler:circle" class="iconify size-5" />
      </button>
    </div>

    <div class="relative min-h-0 flex-grow">
      <simplebar class="size-full" data-simplebar>
        <AppMenu />
      </simplebar>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useLayout } from '@/stores/layout'
import AppMenu from './components/AppMenu.vue'
import AppLogo from '@/components/AppLogo.vue'
import simplebar from 'simplebar-vue'
import { RouterLink } from 'vue-router'

const { layout, setSideNavSize } = useLayout()

const toggleSidebar = () => {
  setSideNavSize(layout.sidenav.size === 'hover-active' ? 'hover' : 'hover-active')
}
</script>
