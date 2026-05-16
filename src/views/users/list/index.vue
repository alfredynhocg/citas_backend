<template>
  <div>
    <PageTitle title="Usuarios" :breadcrumb="[{ label: 'Admin' }, { label: 'Usuarios' }]" />

    <!-- Toolbar -->
    <div class="card mb-4">
      <div class="card-body flex flex-wrap gap-3 items-center justify-between">
        <div class="flex gap-3 flex-wrap">
          <!-- Buscador -->
          <div class="relative">
            <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              v-model="search"
              type="text"
              placeholder="Buscar nombre o email…"
              class="form-input pl-9 w-56"
            />
          </div>
          <!-- Filtro rol -->
          <select v-model="roleFilter" class="form-select w-40">
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="couple">Pareja</option>
            <option value="guest">Invitado</option>
          </select>
        </div>
        <span class="text-sm text-gray-500">{{ total }} usuario(s)</span>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-body p-0">
        <div v-if="loading" class="flex justify-center py-12">
          <Icon icon="lucide:loader-circle" class="size-8 animate-spin text-primary" />
        </div>

        <div v-else-if="error" class="p-6 text-red-500 flex gap-2 items-center">
          <Icon icon="lucide:alert-circle" class="size-5" />
          {{ error }}
        </div>

        <table v-else class="table w-full">
          <thead>
            <tr>
              <th class="w-10">#</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registrado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-400">No se encontraron usuarios</td>
            </tr>
            <tr v-for="u in filtered" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="text-gray-400 text-sm">{{ u.id }}</td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar avatar-sm avatar-soft-primary rounded-full flex items-center justify-center font-semibold text-sm size-9">
                    {{ initials(u.name) }}
                  </div>
                  <span class="font-medium">{{ u.name }}</span>
                </div>
              </td>
              <td class="text-sm">{{ u.email }}</td>
              <td>
                <span :class="roleBadge(u.role)" class="badge text-xs font-medium px-2 py-0.5 rounded-full">
                  {{ roleLabel(u.role) }}
                </span>
              </td>
              <td>
                <span
                  :class="u.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'"
                  class="badge text-xs px-2 py-0.5 rounded-full"
                >
                  {{ u.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-sm text-gray-500">{{ formatDate(u.created_at) }}</td>
              <td class="text-right">
                <div class="flex gap-2 justify-end">
                  <router-link
                    :to="{ name: 'UserDetail', params: { id: u.id } }"
                    class="btn btn-sm btn-outline-primary"
                    title="Editar"
                  >
                    <Icon icon="lucide:pencil" class="size-4" />
                  </router-link>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    title="Eliminar"
                    :disabled="u.id === authStore.user?.id"
                    @click="confirmDelete(u)"
                  >
                    <Icon icon="lucide:trash-2" class="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="pages > 1" class="card-footer flex items-center justify-between">
        <span class="text-sm text-gray-500">Página {{ page }} de {{ pages }}</span>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="page--">
            <Icon icon="lucide:chevron-left" class="size-4" />
          </button>
          <button class="btn btn-sm btn-outline-secondary" :disabled="page >= pages" @click="page++">
            <Icon icon="lucide:chevron-right" class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal confirm delete -->
    <div v-if="toDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="card w-full max-w-sm shadow-xl">
        <div class="card-body text-center space-y-4">
          <Icon icon="lucide:alert-triangle" class="size-12 text-red-500 mx-auto" />
          <p class="font-semibold text-lg">¿Eliminar usuario?</p>
          <p class="text-sm text-gray-500">
            Se eliminará a <strong>{{ toDelete.name }}</strong> de forma permanente.
          </p>
          <div class="flex gap-3 justify-center">
            <button class="btn btn-outline-secondary" @click="toDelete = null">Cancelar</button>
            <button class="btn btn-danger" :disabled="loading" @click="doDelete">
              <Icon v-if="loading" icon="lucide:loader-circle" class="size-4 animate-spin mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import PageTitle from '@/components/PageTitle.vue'
import { useUsers, type UserItem } from '@/composables/useUsers'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { loading, error, fetchUsers, deleteUser } = useUsers()

const search = ref('')
const roleFilter = ref('')
const page = ref(1)
const pages = ref(1)
const total = ref(0)
const items = ref<UserItem[]>([])
const toDelete = ref<UserItem | null>(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return items.value
  return items.value.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  )
})

async function load() {
  const data = await fetchUsers({ page: page.value, per_page: 20, role: roleFilter.value || undefined })
  items.value = data.items
  total.value = data.total
  pages.value = data.pages
}

watch([page, roleFilter], load)
onMounted(load)

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function roleLabel(role: string) {
  return { admin: 'Admin', couple: 'Pareja', guest: 'Invitado' }[role] ?? role
}

function roleBadge(role: string) {
  return {
    admin:  'bg-purple-100 text-purple-700',
    couple: 'bg-pink-100 text-pink-700',
    guest:  'bg-gray-100 text-gray-600',
  }[role] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function confirmDelete(u: UserItem) {
  toDelete.value = u
}

async function doDelete() {
  if (!toDelete.value) return
  const ok = await deleteUser(toDelete.value.id)
  if (ok) {
    toDelete.value = null
    await load()
  }
}
</script>
