<template>
  <div>
    <PageTitle
      title="Editar Usuario"
      :breadcrumb="[{ label: 'Admin' }, { label: 'Usuarios', to: '/users/list' }, { label: user?.name ?? '…' }]"
    />

    <div v-if="loading && !user" class="flex justify-center py-20">
      <Icon icon="lucide:loader-circle" class="size-10 animate-spin text-primary" />
    </div>

    <div v-else-if="!user" class="card p-8 text-center text-gray-500">
      <Icon icon="lucide:user-x" class="size-12 mx-auto mb-3 text-gray-300" />
      Usuario no encontrado.
      <router-link to="/users/list" class="text-primary ml-1">Volver al listado</router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Panel izquierdo: avatar + info básica -->
      <div class="card lg:col-span-1">
        <div class="card-body text-center space-y-4">
          <div
            class="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto"
          >
            {{ initials(user.name) }}
          </div>
          <div>
            <p class="font-semibold text-lg">{{ user.name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
          <div class="flex gap-2 justify-center">
            <span :class="roleBadge(user.role)" class="badge text-xs px-2.5 py-1 rounded-full font-medium">
              {{ roleLabel(user.role) }}
            </span>
            <span
              :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
              class="badge text-xs px-2.5 py-1 rounded-full"
            >
              {{ user.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <p class="text-xs text-gray-400">
            Registrado el {{ formatDate(user.created_at) }}
          </p>
          <router-link to="/users/list" class="btn btn-sm btn-outline-secondary w-full">
            <Icon icon="lucide:arrow-left" class="size-4 mr-1" /> Volver
          </router-link>
        </div>
      </div>

      <!-- Panel derecho: formulario -->
      <div class="card lg:col-span-2">
        <div class="card-header">
          <h5 class="card-title">Información del usuario</h5>
        </div>
        <div class="card-body">
          <form class="space-y-5" @submit.prevent="save">

            <!-- Nombre -->
            <div>
              <label class="form-label">Nombre completo</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>

            <!-- Email -->
            <div>
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-input" required />
            </div>

            <!-- Rol -->
            <div>
              <label class="form-label">Rol</label>
              <select v-model="form.role" class="form-select">
                <option value="admin">Admin</option>
                <option value="couple">Pareja</option>
                <option value="guest">Invitado</option>
              </select>
              <p class="form-text text-xs mt-1 text-gray-400">
                Admin: acceso completo · Pareja: usuario normal · Invitado: solo lectura
              </p>
            </div>

            <!-- Estado activo -->
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="form.is_active" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span class="form-label mb-0">Cuenta activa</span>
            </div>

            <!-- Nueva contraseña (opcional) -->
            <div>
              <label class="form-label">Nueva contraseña <span class="text-gray-400 font-normal">(opcional)</span></label>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
              />
            </div>

            <!-- Error -->
            <div v-if="saveError" class="alert alert-danger flex gap-2 items-center text-sm">
              <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
              {{ saveError }}
            </div>

            <!-- Éxito -->
            <div v-if="saved" class="alert alert-success flex gap-2 items-center text-sm">
              <Icon icon="lucide:check-circle" class="size-4 flex-shrink-0" />
              Cambios guardados correctamente.
            </div>

            <div class="flex gap-3">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <Icon v-if="loading" icon="lucide:loader-circle" class="size-4 animate-spin mr-1" />
                Guardar cambios
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                Restablecer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import PageTitle from '@/components/PageTitle.vue'
import { useUsers, type UserItem } from '@/composables/useUsers'

const route = useRoute()
const { loading, fetchUser, updateUser } = useUsers()

const user = ref<UserItem | null>(null)
const saveError = ref<string | null>(null)
const saved = ref(false)

const form = ref({
  name: '',
  email: '',
  role: 'couple' as string,
  is_active: true,
  password: '',
})

onMounted(async () => {
  const id = Number(route.params.id)
  user.value = await fetchUser(id)
  if (user.value) resetForm()
})

function resetForm() {
  if (!user.value) return
  form.value = {
    name: user.value.name,
    email: user.value.email,
    role: user.value.role,
    is_active: user.value.is_active,
    password: '',
  }
  saveError.value = null
  saved.value = false
}

async function save() {
  saveError.value = null
  saved.value = false
  const payload: Record<string, unknown> = {
    name: form.value.name,
    email: form.value.email,
    role: form.value.role,
    is_active: form.value.is_active,
  }
  if (form.value.password) payload.password = form.value.password

  const updated = await updateUser(Number(route.params.id), payload)
  if (updated) {
    user.value = updated
    form.value.password = ''
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } else {
    saveError.value = 'No se pudieron guardar los cambios'
  }
}

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
</script>
