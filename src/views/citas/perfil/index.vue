<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-default-900">Mi Perfil</h1>
        <p class="text-sm text-default-500 mt-0.5">Tu información personal y estado de cuenta.</p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card p-6 space-y-5 animate-pulse">
          <div class="flex flex-col items-center gap-4">
            <div class="size-24 rounded-2xl bg-default-100" />
            <div class="space-y-2 w-full">
              <div class="h-4 bg-default-100 rounded w-3/4 mx-auto" />
              <div class="h-3 bg-default-100 rounded w-1/2 mx-auto" />
            </div>
          </div>
          <div class="space-y-3">
            <div class="h-12 bg-default-100 rounded-xl" />
            <div class="h-12 bg-default-100 rounded-xl" />
            <div class="h-12 bg-default-100 rounded-xl" />
          </div>
        </div>
        <div class="lg:col-span-2 card p-6 space-y-4 animate-pulse">
          <div class="h-4 bg-default-100 rounded w-1/4" />
          <div class="h-10 bg-default-100 rounded-xl" />
          <div class="h-10 bg-default-100 rounded-xl" />
          <div class="h-10 bg-default-100 rounded-xl" />
        </div>
      </div>

      <template v-else-if="perfil">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div class="space-y-4">

            <div class="card p-6 flex flex-col items-center text-center space-y-4">
              <div class="size-24 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-rose-200">
                {{ initials }}
              </div>
              <div>
                <p class="font-bold text-default-900 text-lg">{{ perfil.nombre }}</p>
                <p class="text-sm text-default-500 mt-0.5 break-all">{{ perfil.email }}</p>
                <div class="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <span class="text-xs px-2.5 py-1 rounded-full font-semibold"
                    :class="auth.user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-600'">
                    {{ auth.user?.role === 'admin' ? 'Administrador' : 'Pareja' }}
                  </span>
                  <span class="text-xs px-2.5 py-1 rounded-full font-semibold"
                    :class="perfil.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                    {{ perfil.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card p-4 space-y-2">
              <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-default-50 transition-colors">
                <div class="size-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:map-pin" class="size-4 text-rose-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-default-400 uppercase tracking-wider font-medium">Departamento</p>
                  <p class="text-sm font-semibold text-default-800 truncate">{{ perfil.departamento_actual }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-default-50 transition-colors">
                <div class="size-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:calendar" class="size-4 text-violet-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-default-400 uppercase tracking-wider font-medium">Miembro desde</p>
                  <p class="text-sm font-semibold text-default-800 truncate">{{ fechaRegistro }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-default-50 transition-colors">
                <div class="size-9 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:users-round" class="size-4 text-sky-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-default-400 uppercase tracking-wider font-medium">Grupos</p>
                  <p class="text-sm font-semibold text-default-800">{{ perfil.total_grupos }} grupo{{ perfil.total_grupos !== 1 ? 's' : '' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-default-50 transition-colors">
                <div class="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  :class="perfil.tiene_pareja ? 'bg-pink-100' : 'bg-default-100'">
                  <Icon icon="lucide:heart" class="size-4" :class="perfil.tiene_pareja ? 'text-pink-500' : 'text-default-400'" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-default-400 uppercase tracking-wider font-medium">Pareja</p>
                  <p class="text-sm font-semibold truncate"
                    :class="perfil.tiene_pareja ? 'text-default-800' : 'text-default-400'">
                    {{ perfil.tiene_pareja ? perfil.pareja?.nombre : 'Sin vincular' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-4">

            <div class="card p-6 space-y-5">
              <div class="flex items-center gap-2 mb-1">
                <Icon icon="lucide:user-pen" class="size-4 text-rose-400" />
                <p class="text-sm font-semibold text-default-700">Información personal</p>
              </div>

              <form @submit.prevent="save" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Nombre completo</label>
                  <input v-model="form.name" type="text" class="form-input w-full" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Correo electrónico</label>
                  <input :value="perfil.email" type="email" class="form-input w-full opacity-60 cursor-not-allowed" disabled />
                  <p class="text-xs text-default-400 mt-1">El email no se puede cambiar.</p>
                </div>

                <transition name="fade">
                  <div v-if="msg.text"
                    :class="msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
                    class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                    <Icon :icon="msg.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0" />
                    {{ msg.text }}
                  </div>
                </transition>

                <div class="flex gap-3 pt-1">
                  <button type="submit" :disabled="saving"
                    class="btn bg-rose-500 hover:bg-rose-600 text-white px-6 flex items-center gap-2 disabled:opacity-60">
                    <Icon v-if="saving" icon="lucide:loader-circle" class="size-4 animate-spin" />
                    {{ saving ? 'Guardando…' : 'Guardar cambios' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

            <div class="card p-6 space-y-4">
              <div class="flex items-center gap-2 mb-1">
                <Icon icon="lucide:lock-keyhole" class="size-4 text-rose-400" />
                <p class="text-sm font-semibold text-default-700">Cambiar contraseña</p>
              </div>

              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Contraseña actual</label>
                  <div class="relative">
                    <input v-model="form.password_actual" :type="showPass ? 'text' : 'password'"
                      class="form-input w-full pr-10" placeholder="Tu contraseña actual" />
                    <button type="button" tabindex="-1"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600"
                      @click="showPass = !showPass">
                      <Icon :icon="showPass ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Nueva contraseña</label>
                  <input v-model="form.password_nuevo" :type="showPass ? 'text' : 'password'"
                    class="form-input w-full" placeholder="Nueva contraseña" />
                </div>

                <transition name="fade">
                  <div v-if="passMsg.text"
                    :class="passMsg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
                    class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                    <Icon :icon="passMsg.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0" />
                    {{ passMsg.text }}
                  </div>
                </transition>

                <button type="submit" :disabled="savingPass"
                  class="btn bg-default-800 hover:bg-default-900 text-white px-6 flex items-center gap-2 disabled:opacity-60">
                  <Icon v-if="savingPass" icon="lucide:loader-circle" class="size-4 animate-spin" />
                  {{ savingPass ? 'Actualizando…' : 'Actualizar contraseña' }}
                </button>
              </form>
            </div>

          </div>
        </div>
      </template>

      <div v-else class="card p-12 text-center text-default-400">
        <Icon icon="lucide:alert-circle" class="size-10 mx-auto mb-3 text-red-300" />
        <p class="font-medium">No se pudo cargar el perfil</p>
        <button @click="fetchPerfil" class="mt-3 text-sm text-rose-500 hover:underline">Reintentar</button>
      </div>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

const loading     = ref(true)
const saving      = ref(false)
const savingPass  = ref(false)
const showPass    = ref(false)
const msg         = ref({ text: '', ok: false })
const passMsg     = ref({ text: '', ok: false })

interface Perfil {
  id: number
  nombre: string
  email: string
  departamento_actual: string
  fecha_registro: string | null
  activo: boolean
  tiene_pareja: boolean
  pareja: { id: number; nombre: string; email: string } | null
  grupos: { id: number; nombre: string; tipo: string }[]
  total_grupos: number
}

const perfil = ref<Perfil | null>(null)
const form = ref({ name: '', password_actual: '', password_nuevo: '' })

const initials = computed(() =>
  (perfil.value?.nombre ?? '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

const fechaRegistro = computed(() => {
  if (!perfil.value?.fecha_registro) return 'Desconocido'
  return new Date(perfil.value.fecha_registro).toLocaleDateString('es-BO', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
})

async function fetchPerfil() {
  loading.value = true
  try {
    const res = await fetch(`${API}/usuarios/perfil`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    })
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (!res.ok) throw new Error()
    perfil.value = await res.json()
    resetForm()
  } catch {
    perfil.value = null
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = { name: perfil.value?.nombre ?? '', password_actual: '', password_nuevo: '' }
  msg.value = { text: '', ok: false }
}

async function save() {
  saving.value = true
  msg.value = { text: '', ok: false }
  try {
    const res = await auth.authFetch(`${API}/usuarios/perfil`, {
      method: 'PUT',
      body: JSON.stringify({ nombre: form.value.name, departamento_actual: perfil.value?.departamento_actual }),
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Error al guardar')
    if (auth.user) auth.user.name = form.value.name
    await fetchPerfil()
    msg.value = { text: 'Nombre actualizado correctamente.', ok: true }
    setTimeout(() => (msg.value.text = ''), 3000)
  } catch (e: unknown) {
    msg.value = { text: e instanceof Error ? e.message : 'Error al guardar', ok: false }
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (!form.value.password_actual || !form.value.password_nuevo) {
    passMsg.value = { text: 'Completa ambos campos de contraseña.', ok: false }
    return
  }
  savingPass.value = true
  passMsg.value = { text: '', ok: false }
  try {
    const res = await auth.authFetch(`${API}/usuarios/cambiar-password`, {
      method: 'POST',
      body: JSON.stringify({
        password_actual: form.value.password_actual,
        password_nuevo: form.value.password_nuevo,
      }),
    })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Contraseña actual incorrecta')
    form.value.password_actual = ''
    form.value.password_nuevo  = ''
    passMsg.value = { text: 'Contraseña actualizada correctamente.', ok: true }
    setTimeout(() => (passMsg.value.text = ''), 3000)
  } catch (e: unknown) {
    passMsg.value = { text: e instanceof Error ? e.message : 'Error al actualizar', ok: false }
  } finally {
    savingPass.value = false
  }
}

onMounted(fetchPerfil)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
