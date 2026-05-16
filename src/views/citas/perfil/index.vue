<template>
  <div class="p-6 space-y-6 max-w-2xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-default-900">Mi Perfil</h1>
      <p class="text-sm text-default-500 mt-0.5">Actualiza tu información personal.</p>
    </div>

    <div class="card p-8 space-y-6">
      <!-- Avatar -->
      <div class="flex items-center gap-5">
        <div class="size-20 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 text-3xl font-bold">
          {{ initials }}
        </div>
        <div>
          <p class="font-bold text-default-900 text-lg">{{ auth.user?.name }}</p>
          <p class="text-sm text-default-500">{{ auth.user?.email }}</p>
          <span class="mt-1 inline-block text-xs px-2.5 py-0.5 rounded-full font-medium"
            :class="{
              'bg-purple-100 text-purple-700': auth.user?.role === 'admin',
              'bg-rose-100 text-rose-600': auth.user?.role === 'couple',
              'bg-gray-100 text-gray-500': auth.user?.role === 'guest',
            }">
            {{ roleLabel }}
          </span>
        </div>
      </div>

      <div class="border-t border-default-100" />

      <!-- Formulario -->
      <form class="space-y-5" @submit.prevent="save">
        <div>
          <label class="block text-sm font-medium text-default-700 mb-1.5">Nombre completo</label>
          <input v-model="form.name" type="text" class="form-input w-full" required />
        </div>

        <div class="border-t border-default-100 pt-5">
          <p class="text-sm font-semibold text-default-700 mb-4">Cambiar contraseña</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-default-700 mb-1.5">Nueva contraseña</label>
              <div class="relative">
                <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                  class="form-input w-full pr-10" placeholder="Mínimo 8 caracteres" />
                <button type="button" tabindex="-1"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600"
                  @click="showPass = !showPass">
                  <Icon :icon="showPass ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback -->
        <transition name="fade">
          <div v-if="msg.text" :class="msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
            class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
            <Icon :icon="msg.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0" />
            {{ msg.text }}
          </div>
        </transition>

        <div class="flex gap-3">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const saving = ref(false)
const showPass = ref(false)
const msg = ref({ text: '', ok: false })

const form = ref({ name: '', password: '' })

const initials = computed(() =>
  (auth.user?.name ?? '').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
)
const roleLabel = computed(() =>
  ({ admin: 'Administrador', couple: 'Pareja', guest: 'Invitado' }[auth.user?.role ?? ''] ?? '')
)

onMounted(() => resetForm())

function resetForm() {
  form.value = { name: auth.user?.name ?? '', password: '' }
  msg.value = { text: '', ok: false }
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

async function save() {
  saving.value = true
  msg.value = { text: '', ok: false }
  try {
    const payload: Record<string, string> = { name: form.value.name }
    if (form.value.password) payload.password = form.value.password

    const res = await fetch(`${API}/users/me/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error((await res.json()).message)
    const updated = await res.json()
    auth.user = updated
    form.value.password = ''
    msg.value = { text: 'Cambios guardados correctamente.', ok: true }
    setTimeout(() => (msg.value.text = ''), 3000)
  } catch (e: unknown) {
    msg.value = { text: e instanceof Error ? e.message : 'Error al guardar', ok: false }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
