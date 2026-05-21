<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Catálogo de Citas</h1>
          <p class="text-sm text-default-500 mt-0.5">100 experiencias románticas en La Paz para descubrir juntos.</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-default-500">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 font-semibold">
            <Icon icon="lucide:heart" class="size-3.5" />
            {{ citas.filter(c => c.completada).length }} completadas
          </span>
          <span class="text-default-300">/</span>
          <span class="font-medium text-default-600">{{ citas.length }} total</span>
        </div>
      </div>

      <div class="flex gap-2 flex-wrap">
        <button v-for="cat in categorias" :key="cat.id ?? 'todas'"
          @click="filtroCategoria = cat.id ?? null"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
            filtroCategoria === (cat.id ?? null)
              ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
              : 'bg-white dark:bg-gray-900 text-default-600 border-default-200 hover:border-rose-300 hover:text-rose-500'
          ]">
          {{ cat.nombre }}
        </button>
      </div>

      <div class="relative max-w-sm">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-default-400 pointer-events-none" />
        <input v-model="busqueda" type="text" placeholder="Buscar cita…"
          class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-default-200
                 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20
                 bg-default-50 placeholder-default-400 transition-all" />
      </div>

      <AppLoader v-if="loading" />

      <template v-else>
        <div v-if="filtradas.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="cita in filtradas" :key="cita.id"
            @click="abrirDetalle(cita)"
            class="card flex flex-col cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden">
            <div class="relative h-36 bg-gradient-to-br from-rose-100 to-pink-100 flex-shrink-0 overflow-hidden">
              <img v-if="cita.portada_url" :src="cita.portada_url"
                class="w-full h-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon icon="lucide:heart" class="size-10 text-rose-300" />
              </div>
              <div class="absolute top-2 right-2">
                <span v-if="cita.completada"
                  class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                  <Icon icon="lucide:check" class="size-2.5" /> Completada
                </span>
                <span v-else-if="cita.requiere_premium"
                  class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white">
                  <Icon icon="lucide:crown" class="size-2.5" /> Premium
                </span>
              </div>
              <div class="absolute bottom-2 left-2">
                <span class="text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full">
                  {{ cita.puntos }} pts
                </span>
              </div>
            </div>
            <div class="p-4 flex flex-col flex-1 gap-2">
              <p class="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">{{ cita.categoria_nombre ?? 'General' }}</p>
              <h3 class="text-sm font-semibold text-default-900 group-hover:text-rose-500 transition-colors leading-snug line-clamp-2">
                {{ cita.nombre }}
              </h3>
              <p class="text-xs text-default-500 line-clamp-2 flex-1">{{ cita.descripcion }}</p>
              <div class="flex items-center gap-1.5 pt-1 flex-wrap">
                <span v-if="cita.departamento_nombre"
                  class="flex items-center gap-1 text-[10px] text-default-500 bg-default-100 px-2 py-0.5 rounded-full">
                  <Icon icon="lucide:map-pin" class="size-2.5" /> {{ cita.departamento_nombre }}
                </span>
                <span v-if="cita.negocio_nombre"
                  class="flex items-center gap-1 text-[10px] text-default-500 bg-default-100 px-2 py-0.5 rounded-full">
                  <Icon icon="lucide:store" class="size-2.5" /> {{ cita.negocio_nombre }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card p-16 text-center">
          <Icon icon="lucide:search-x" class="size-10 mx-auto mb-3 text-default-200" />
          <p class="font-semibold text-default-600">Sin resultados</p>
          <p class="text-sm text-default-400 mt-1">Prueba con otra búsqueda o categoría.</p>
        </div>
      </template>

      <div v-if="errorGlobal" class="card p-5 flex items-center gap-3 border border-red-200 bg-red-50">
        <Icon icon="lucide:alert-circle" class="size-5 text-red-400 flex-shrink-0" />
        <p class="text-sm text-red-600 flex-1">{{ errorGlobal }}</p>
        <button @click="fetchCitas" class="text-sm text-red-500 hover:underline font-medium">Reintentar</button>
      </div>

    </div>

    <Teleport to="body">
      <transition name="slide">
        <div v-if="seleccionada" class="fixed inset-0 z-50 flex">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="seleccionada = null" />
          <div class="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col">

            <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-default-100 px-6 py-4 flex items-center justify-between z-10">
              <span class="text-xs font-bold text-default-400 uppercase tracking-wider">Detalle de cita</span>
              <button @click="seleccionada = null"
                class="size-8 flex items-center justify-center rounded-xl text-default-400 hover:bg-default-100 hover:text-default-600 transition-colors">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <div class="flex-1 space-y-5">
              <div class="relative h-48 bg-gradient-to-br from-rose-100 to-pink-200 overflow-hidden">
                <img v-if="seleccionada.portada_url" :src="seleccionada.portada_url"
                  class="w-full h-full object-cover"
                  @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon icon="lucide:heart" class="size-16 text-rose-300" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-4 left-5">
                  <span class="text-[10px] font-semibold text-white/80 uppercase tracking-wider">{{ seleccionada.categoria_nombre }}</span>
                  <p class="text-white font-bold text-lg leading-tight mt-0.5">{{ seleccionada.nombre }}</p>
                </div>
              </div>

              <div class="px-6 space-y-5">
                <p class="text-sm text-default-600 leading-relaxed">{{ seleccionada.descripcion }}</p>

                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-default-50 rounded-xl p-3 flex items-center gap-3">
                    <div class="size-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Icon icon="lucide:star" class="size-4 text-rose-500" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-default-900">{{ seleccionada.puntos }}</p>
                      <p class="text-[10px] text-default-400">Puntos</p>
                    </div>
                  </div>
                  <div class="bg-default-50 rounded-xl p-3 flex items-center gap-3">
                    <div class="size-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Icon icon="lucide:map-pin" class="size-4 text-violet-500" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-default-900 truncate">{{ seleccionada.departamento_nombre ?? '—' }}</p>
                      <p class="text-[10px] text-default-400">Departamento</p>
                    </div>
                  </div>
                </div>

                <div v-if="seleccionada.negocio_nombre || seleccionada.direccion"
                  class="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 space-y-2">
                  <p class="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <Icon icon="lucide:map-pin" class="size-3.5" /> Lugar
                  </p>
                  <p v-if="seleccionada.negocio_nombre" class="text-sm font-semibold text-default-800">{{ seleccionada.negocio_nombre }}</p>
                  <p v-if="seleccionada.direccion" class="text-xs text-default-500">{{ seleccionada.direccion }}</p>
                </div>

                <div v-if="seleccionada.completada" class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <Icon icon="lucide:check-circle" class="size-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-semibold text-green-700">¡Ya completaron esta cita!</p>
                    <p class="text-xs text-green-600 mt-0.5">Pueden calificarla si aún no lo hicieron.</p>
                  </div>
                </div>

                <div v-if="seleccionada.requiere_premium && !seleccionada.completada"
                  class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                  <Icon icon="lucide:crown" class="size-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-semibold text-amber-700">Cita Premium</p>
                    <p class="text-xs text-amber-600 mt-0.5">Activa tu suscripción para desbloquearla.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-default-100 p-4 space-y-2">
              <button v-if="!seleccionada.completada && !seleccionada.requiere_premium"
                @click="completar(seleccionada)" :disabled="loadingCompletar"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-rose-500 hover:bg-rose-600
                       text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                <Icon v-if="loadingCompletar" icon="lucide:loader-circle" class="size-4 animate-spin" />
                <Icon v-else icon="lucide:heart" class="size-4" />
                {{ loadingCompletar ? 'Guardando…' : 'Marcar como completada' }}
              </button>
              <button v-else-if="seleccionada.completada"
                disabled
                class="w-full py-3 rounded-xl font-semibold text-sm bg-green-100 text-green-600 flex items-center justify-center gap-2 cursor-not-allowed">
                <Icon icon="lucide:check-circle" class="size-4" />
                Ya completada
              </button>
              <transition name="fade">
                <div v-if="msgCompletar.text"
                  :class="msgCompletar.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'"
                  class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                  <Icon :icon="msgCompletar.ok ? 'lucide:check-circle' : 'lucide:alert-circle'" class="size-4 flex-shrink-0" />
                  {{ msgCompletar.text }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'
import AppLoader from '@/components/AppLoader.vue'

const auth = useAuthStore()
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

interface Cita {
  id: number; nombre: string; descripcion: string | null
  categoria_id: number | null; categoria_nombre: string | null
  departamento_id: number | null; departamento_nombre: string | null
  negocio_id: number | null; negocio_nombre: string | null
  direccion: string | null; puntos: number; portada_url: string | null
  requiere_premium: boolean; completada: boolean
}
interface Categoria { id: number | null; nombre: string }

const loading         = ref(true)
const errorGlobal     = ref('')
const citas           = ref<Cita[]>([])
const categorias      = ref<Categoria[]>([{ id: null, nombre: 'Todas' }])
const filtroCategoria = ref<number | null>(null)
const busqueda        = ref('')
const seleccionada    = ref<Cita | null>(null)
const loadingCompletar = ref(false)
const msgCompletar    = ref({ text: '', ok: false })

const filtradas = computed(() => {
  let lista = filtroCategoria.value !== null
    ? citas.value.filter(c => c.categoria_id === filtroCategoria.value)
    : citas.value
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      (c.descripcion ?? '').toLowerCase().includes(q)
    )
  }
  return lista
})

async function fetchCategorias() {
  try {
    const res = await fetch(`${API}/citas/categorias`)
    if (!res.ok) return
    const data = await res.json()
    categorias.value = [{ id: null, nombre: 'Todas' }, ...(data.categorias ?? [])]
  } catch {}
}

async function fetchCitas() {
  loading.value = true; errorGlobal.value = ''
  try {
    const res = await auth.authFetch(`${API}/citas`)
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    citas.value = (data.citas ?? []).map((c: Cita) => ({ ...c, completada: false }))
  } catch {
    errorGlobal.value = 'No se pudieron cargar las citas.'
  } finally {
    loading.value = false
  }
}

function abrirDetalle(cita: Cita) {
  seleccionada.value = cita
  msgCompletar.value = { text: '', ok: false }
}

async function completar(cita: Cita) {
  loadingCompletar.value = true
  msgCompletar.value = { text: '', ok: false }
  try {
    const res = await auth.authFetch(`${API}/citas/completar`, {
      method: 'POST',
      body: JSON.stringify({ cita_id: cita.id }),
    })
    const data = await res.json()
    if (!res.ok) {
      msgCompletar.value = { text: data.error ?? 'Error al completar', ok: false }
      return
    }
    cita.completada = true
    if (seleccionada.value?.id === cita.id) seleccionada.value = { ...cita }
    msgCompletar.value = { text: '¡Cita completada! +' + cita.puntos + ' puntos', ok: true }
    setTimeout(() => { msgCompletar.value.text = '' }, 3000)
  } catch {
    msgCompletar.value = { text: 'Error de conexión.', ok: false }
  } finally {
    loadingCompletar.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCategorias(), fetchCitas()])
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
