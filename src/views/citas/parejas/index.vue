<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div>
        <h1 class="text-2xl font-bold text-default-900">Mi Pareja</h1>
        <p class="text-sm text-default-500 mt-0.5">Vincula o gestiona tu pareja romántica.</p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6 animate-pulse space-y-4">
          <div class="flex items-center gap-4">
            <div class="size-16 rounded-2xl bg-default-100" />
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-default-100 rounded w-1/2" />
              <div class="h-3 bg-default-100 rounded w-1/3" />
            </div>
          </div>
          <div class="h-10 bg-default-100 rounded-xl" />
          <div class="h-10 bg-default-100 rounded-xl" />
        </div>
      </div>

      <template v-else>

        <!-- Estado: vinculados -->
        <div v-if="pareja" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="card p-6 space-y-5">
            <div class="flex items-center gap-4">
              <div class="flex -space-x-3">
                <div class="size-12 rounded-2xl bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-sm shadow-sm">
                  {{ initials(auth.user?.name ?? '') }}
                </div>
                <div class="size-12 rounded-2xl bg-violet-100 border-2 border-white flex items-center justify-center text-violet-600 font-bold text-sm shadow-sm">
                  {{ initials(pareja.nombre) }}
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-bold text-default-900">{{ pareja.nombre }}</p>
                <p class="text-sm text-default-400 truncate">{{ pareja.email }}</p>
              </div>
              <span class="ml-auto flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-600">
                <Icon icon="lucide:heart" class="size-3" />
                Vinculados
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-3 rounded-xl bg-default-50">
                <p class="text-xl font-bold text-default-900">{{ progreso.citas_completadas }}</p>
                <p class="text-[10px] text-default-400 uppercase tracking-wide mt-0.5">Citas</p>
              </div>
              <div class="text-center p-3 rounded-xl bg-default-50">
                <p class="text-xl font-bold text-default-900">{{ progreso.puntos_totales }}</p>
                <p class="text-[10px] text-default-400 uppercase tracking-wide mt-0.5">Puntos</p>
              </div>
              <div class="text-center p-3 rounded-xl bg-default-50">
                <p class="text-xl font-bold text-default-900">{{ progreso.racha_actual }}</p>
                <p class="text-[10px] text-default-400 uppercase tracking-wide mt-0.5">Racha</p>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs text-default-500">
                <span>Progreso de las 100 citas</span>
                <span class="font-semibold text-default-700">{{ progreso.citas_completadas }}/100</span>
              </div>
              <div class="h-2.5 rounded-full bg-default-100 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-700"
                  :style="{ width: Math.min(progreso.citas_completadas, 100) + '%' }" />
              </div>
            </div>

            <button @click="confirmarDesvincular = true"
              class="w-full py-2.5 rounded-xl text-sm font-semibold text-red-500
                     border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <Icon icon="lucide:heart-crack" class="size-4" />
              Desvincular pareja
            </button>
          </div>

          <div class="card p-6 flex flex-col items-center justify-center text-center space-y-3 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div class="size-14 rounded-2xl bg-rose-100 flex items-center justify-center">
              <Icon icon="lucide:heart" class="size-7 text-rose-500" />
            </div>
            <p class="font-semibold text-default-700">¡Están vinculados!</p>
            <p class="text-sm text-default-400 max-w-xs">
              Completen juntos las 100 citas románticas y creen recuerdos inolvidables.
            </p>
          </div>
        </div>

        <!-- Estado: sin pareja -->
        <div v-else class="space-y-6">

          <!-- Código generado tras crear pareja -->
          <transition name="fade">
            <div v-if="codigoGenerado" class="card p-6 space-y-4 border border-green-200 bg-green-50 dark:bg-green-950/20">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:check-circle" class="size-4 text-green-600" />
                </div>
                <div>
                  <p class="font-semibold text-green-800 text-sm">¡Invitación creada!</p>
                  <p class="text-xs text-green-600">Comparte este código con tu pareja para que se una.</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-white dark:bg-gray-900 border border-green-200 rounded-xl px-4 py-3 text-center">
                  <p class="text-2xl font-mono font-bold tracking-[0.3em] text-default-900">{{ codigoGenerado }}</p>
                </div>
                <button @click="copiarCodigo"
                  class="size-11 rounded-xl border border-green-200 bg-white dark:bg-gray-900 flex items-center justify-center
                         text-default-500 hover:text-green-600 hover:border-green-400 transition-colors flex-shrink-0">
                  <Icon :icon="copiado ? 'lucide:check' : 'lucide:copy'" class="size-4" />
                </button>
              </div>
              <p class="text-xs text-green-600 text-center">
                Tu pareja debe ingresar este código en la sección "Unirse con código".
              </p>
            </div>
          </transition>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Crear pareja -->
            <div class="card p-6 space-y-5">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:user-plus" class="size-4 text-rose-500" />
                </div>
                <div>
                  <p class="font-semibold text-default-800 text-sm">Crear e invitar pareja</p>
                  <p class="text-xs text-default-400">Registra a tu pareja con su email</p>
                </div>
              </div>

              <form @submit.prevent="crearPareja" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Nombre de la pareja <span class="text-rose-400">*</span>
                  </label>
                  <input v-model="formCrear.nombre_pareja" type="text" class="form-input w-full"
                    placeholder="Ej: Carlos y Sofía" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Email de tu pareja <span class="text-rose-400">*</span>
                  </label>
                  <input v-model="formCrear.email_pareja" type="email" class="form-input w-full"
                    placeholder="email@ejemplo.com" required />
                  <p class="text-xs text-default-400 mt-1">Tu pareja debe estar registrada en la app.</p>
                </div>

                <transition name="fade">
                  <div v-if="msgCrear.text"
                    :class="msgCrear.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
                    class="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm">
                    <Icon :icon="msgCrear.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0 mt-0.5" />
                    {{ msgCrear.text }}
                  </div>
                </transition>

                <button type="submit" :disabled="loadingCrear"
                  class="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                         bg-rose-500 hover:bg-rose-600 transition-all disabled:opacity-60
                         flex items-center justify-center gap-2">
                  <Icon v-if="loadingCrear" icon="lucide:loader-circle" class="size-4 animate-spin" />
                  {{ loadingCrear ? 'Creando…' : 'Crear invitación' }}
                </button>
              </form>
            </div>

            <!-- Unirse con código -->
            <div class="card p-6 space-y-5">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:key-round" class="size-4 text-violet-500" />
                </div>
                <div>
                  <p class="font-semibold text-default-800 text-sm">Unirse con código</p>
                  <p class="text-xs text-default-400">Ingresa el código que te compartió tu pareja</p>
                </div>
              </div>

              <form @submit.prevent="unirPareja" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Código de invitación <span class="text-rose-400">*</span>
                  </label>
                  <input v-model="formUnir.codigo" type="text" class="form-input w-full font-mono tracking-widest uppercase"
                    placeholder="ABCD1234" maxlength="8" required
                    @input="formUnir.codigo = formUnir.codigo.toUpperCase()" />
                  <p class="text-xs text-default-400 mt-1">El código tiene 8 caracteres.</p>
                </div>

                <transition name="fade">
                  <div v-if="msgUnir.text"
                    :class="msgUnir.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
                    class="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm">
                    <Icon :icon="msgUnir.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0 mt-0.5" />
                    {{ msgUnir.text }}
                  </div>
                </transition>

                <button type="submit" :disabled="loadingUnir"
                  class="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                         bg-violet-500 hover:bg-violet-600 transition-all disabled:opacity-60
                         flex items-center justify-center gap-2">
                  <Icon v-if="loadingUnir" icon="lucide:loader-circle" class="size-4 animate-spin" />
                  {{ loadingUnir ? 'Uniéndose…' : 'Unirse a la pareja' }}
                </button>
              </form>
            </div>

          </div>
        </div>

      </template>

      <Teleport to="body">
        <transition name="modal">
          <div v-if="confirmarDesvincular" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="confirmarDesvincular = false" />
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
              <div class="size-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
                <Icon icon="lucide:heart-crack" class="size-6 text-red-500" />
              </div>
              <div>
                <h2 class="text-base font-bold text-default-900">¿Desvincular pareja?</h2>
                <p class="text-sm text-default-500 mt-1.5">
                  Se desvinculará a <span class="font-semibold text-default-800">{{ pareja?.nombre }}</span>.
                  El progreso se conservará.
                </p>
              </div>
              <transition name="fade">
                <div v-if="msgDesvincular"
                  class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
                  <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />{{ msgDesvincular }}
                </div>
              </transition>
              <div class="flex gap-3">
                <button @click="confirmarDesvincular = false"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-default-600
                         border border-default-200 hover:bg-default-50 transition-colors">
                  Cancelar
                </button>
                <button @click="desvincular" :disabled="loadingDesvincular"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500
                         hover:bg-red-600 transition-colors disabled:opacity-60
                         flex items-center justify-center gap-2">
                  <Icon v-if="loadingDesvincular" icon="lucide:loader-circle" class="size-4 animate-spin" />
                  {{ loadingDesvincular ? 'Desvinculando…' : 'Sí, desvincular' }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'

const auth = useAuthStore()
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

interface Pareja  { id: number; nombre: string; email: string }
interface Progreso { citas_completadas: number; puntos_totales: number; racha_actual: number }

const loading              = ref(true)
const pareja               = ref<Pareja | null>(null)
const progreso             = ref<Progreso>({ citas_completadas: 0, puntos_totales: 0, racha_actual: 0 })
const confirmarDesvincular = ref(false)
const loadingDesvincular   = ref(false)
const msgDesvincular       = ref('')

const loadingCrear  = ref(false)
const msgCrear      = ref({ text: '', ok: false })
const formCrear     = ref({ nombre_pareja: '', email_pareja: '' })
const codigoGenerado = ref('')
const copiado       = ref(false)

const loadingUnir = ref(false)
const msgUnir     = ref({ text: '', ok: false })
const formUnir    = ref({ codigo: '' })

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

async function fetchPareja() {
  loading.value = true
  try {
    const res = await auth.authFetch(`${API}/usuarios/mi-pareja`)
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (res.status === 404) { pareja.value = null; return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    pareja.value   = data.pareja
    progreso.value = data.progreso_pareja
  } catch {
    pareja.value = null
  } finally {
    loading.value = false
  }
}

async function crearPareja() {
  loadingCrear.value = true
  msgCrear.value = { text: '', ok: false }
  codigoGenerado.value = ''
  try {
    const res = await auth.authFetch(`${API}/usuarios/crear-pareja`, {
      method: 'POST',
      body: JSON.stringify({
        nombre_pareja: formCrear.value.nombre_pareja.trim(),
        email_pareja:  formCrear.value.email_pareja.trim(),
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      msgCrear.value = { text: data.error ?? 'Error al crear la invitación', ok: false }
      return
    }
    codigoGenerado.value = data.codigo
    formCrear.value = { nombre_pareja: '', email_pareja: '' }
    msgCrear.value = { text: '', ok: false }
  } catch {
    msgCrear.value = { text: 'Error de conexión. Intenta de nuevo.', ok: false }
  } finally {
    loadingCrear.value = false
  }
}

async function unirPareja() {
  loadingUnir.value = true
  msgUnir.value = { text: '', ok: false }
  try {
    const res = await auth.authFetch(`${API}/usuarios/unir-pareja`, {
      method: 'POST',
      body: JSON.stringify({ codigo_invitacion: formUnir.value.codigo.trim() }),
    })
    const data = await res.json()
    if (!res.ok) {
      msgUnir.value = { text: data.error ?? 'Código inválido o expirado', ok: false }
      return
    }
    msgUnir.value = { text: '¡Te uniste a la pareja!', ok: true }
    formUnir.value = { codigo: '' }
    setTimeout(() => fetchPareja(), 800)
  } catch {
    msgUnir.value = { text: 'Error de conexión. Intenta de nuevo.', ok: false }
  } finally {
    loadingUnir.value = false
  }
}

async function desvincular() {
  loadingDesvincular.value = true
  msgDesvincular.value = ''
  try {
    const res = await auth.authFetch(`${API}/usuarios/desvincular-pareja`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { msgDesvincular.value = data.error ?? 'Error al desvincular'; return }
    confirmarDesvincular.value = false
    codigoGenerado.value = ''
    await fetchPareja()
  } catch {
    msgDesvincular.value = 'Error de conexión.'
  } finally {
    loadingDesvincular.value = false
  }
}

async function copiarCodigo() {
  await navigator.clipboard.writeText(codigoGenerado.value)
  copiado.value = true
  setTimeout(() => (copiado.value = false), 2000)
}

onMounted(fetchPareja)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
