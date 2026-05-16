<template>
  <div class="topbar-item hs-dropdown relative inline-flex">
    <button class="cursor-pointer bg-pink-100 rounded-full" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
      <div class="hs-dropdown-toggle rounded-full size-9.5 bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
        {{ initials }}
      </div>
    </button>
    <div class="hs-dropdown-menu min-w-48" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-with-icons">
      <div class="p-2">
        <h6 class="mb-2 text-default-500">Bienvenido</h6>
        <div class="flex gap-3">
          <div class="relative inline-block">
            <div class="rounded bg-primary/10 size-12 flex items-center justify-center text-primary font-bold text-lg">
              {{ initials }}
            </div>
            <span class="-top-1 -end-1 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h6 class="mb-1 text-sm font-semibold text-default-800">{{ auth.user?.name }}</h6>
            <p class="text-default-500 text-xs">{{ auth.user?.email }}</p>
            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5 inline-block"
              :class="{
                'bg-purple-100 text-purple-700': auth.user?.role === 'admin',
                'bg-pink-100 text-pink-700': auth.user?.role === 'couple',
                'bg-gray-100 text-gray-600': auth.user?.role === 'guest',
              }">
              {{ roleLabel }}
            </span>
          </div>
        </div>
      </div>
      <div class="border-t border-t-default-200 -mx-2 my-2"></div>
      <div class="flex flex-col gap-y-1">
        <RouterLink
          v-if="auth.isAdmin"
          class="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded"
          to="/users/list"
        >
          <Icon icon="lucide:users" class="size-4" />
          Usuarios
        </RouterLink>
        <div v-if="auth.isAdmin" class="border-t border-default-200 -mx-2 my-1"></div>
        <button
          class="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-red-500 hover:bg-red-50 rounded w-full text-left"
          @click="handleLogout"
        >
          <Icon icon="lucide:log-out" class="size-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
})

const roleLabel = computed(() => {
  const map: Record<string, string> = { admin: 'Admin', couple: 'Pareja', guest: 'Invitado' }
  return map[auth.user?.role ?? ''] ?? ''
})

function handleLogout() {
  auth.logout()
  router.push('/mordern-auth/login')
}
</script>
