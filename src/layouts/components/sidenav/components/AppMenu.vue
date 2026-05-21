<template>
  <ul class="side-nav p-3 hs-accordion-group">
    <template v-for="(item, idx) in visibleItems" :key="item.key || idx">
      <li v-if="item.isTitle" class="menu-title">
        <span>{{ item.label }}</span>
      </li>
      <template v-else>
        <MenuItemWithChildren v-if="item.children" :item="item" :open-menu-key="openMenuKey" :set-open-menu-key="setOpenMenuKey" />
        <MenuItem v-else :item="item" :key="idx" />
      </template>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { menuItems } from './data'
import MenuItem from './MenuItem.vue'
import MenuItemWithChildren from './MenuItemWithChildren.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const openMenuKey = ref<string | null>(null)

const visibleItems = computed(() =>
  menuItems.filter(item => !item.requiresAdmin || auth.isAdmin)
)

const setOpenMenuKey = (key: string | null) => {
  openMenuKey.value = key
}
</script>
