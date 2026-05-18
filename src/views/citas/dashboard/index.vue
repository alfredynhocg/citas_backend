<template>
  <Vertical>
  <div class="p-6 space-y-6">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-default-900">Bienvenido, {{ auth.user?.name?.split(' ')[0] }} 👋</h1>
        <p class="text-sm text-default-500 mt-0.5">Aquí está el resumen de tu aventura romántica.</p>
      </div>
      <span class="text-xs text-default-400 capitalize">{{ today }}</span>
    </div>

    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="card p-5 animate-pulse space-y-3">
        <div class="size-10 rounded-xl bg-default-100" />
        <div class="h-7 bg-default-100 rounded w-1/2" />
        <div class="h-3 bg-default-100 rounded w-3/4" />
      </div>
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div :class="stat.bg" class="size-10 rounded-xl flex items-center justify-center">
            <Icon :icon="stat.icon" :class="stat.color" class="size-5" />
          </div>
          <span v-if="stat.badge" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
            {{ stat.badge }}
          </span>
        </div>
        <div>
          <p class="text-2xl font-bold text-default-900">{{ stat.value }}</p>
          <p class="text-xs text-default-500 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <div class="card p-6 flex flex-col items-center justify-center text-center lg:col-span-1">
        <p class="text-sm font-semibold text-default-700 mb-6">Progreso General</p>

        <div class="relative size-44">
          <svg class="size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
              class="text-default-100" stroke-width="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
              class="text-rose-500 transition-all duration-1000"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="`${progressArc} 251.2`" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-bold text-default-900">{{ resumen?.total_completadas ?? 0 }}</span>
            <span class="text-xs text-default-400">de {{ resumen?.total_citas ?? 100 }} citas</span>
          </div>
        </div>

        <div class="mt-6 w-full space-y-1">
          <div class="flex justify-between text-xs text-default-500">
            <span>{{ Math.round(pct) }}% completado</span>
            <span>{{ resumen?.pendientes ?? 0 }} restantes</span>
          </div>
          <div class="h-1.5 rounded-full bg-default-100 overflow-hidden">
            <div class="h-full bg-rose-500 rounded-full transition-all duration-1000"
              :style="{ width: pct + '%' }" />
          </div>
        </div>

        <p class="mt-4 text-xs text-default-400 italic">{{ motivationalMsg }}</p>
      </div>

      <div class="card p-6 lg:col-span-2">
        <p class="text-sm font-semibold text-default-700 mb-5">Progreso por Categoría</p>
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 4" :key="i" class="space-y-1.5 animate-pulse">
            <div class="h-3 bg-default-100 rounded w-1/3" />
            <div class="h-2 bg-default-100 rounded" />
          </div>
        </div>
        <div v-else class="space-y-3.5">
          <div v-for="cat in progresoCategorias" :key="cat.nombre" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-default-700">{{ cat.nombre }}</span>
              <span class="text-default-400">{{ cat.completadas }}/{{ cat.total }}</span>
            </div>
            <div class="h-2 rounded-full bg-default-100 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700 bg-rose-500"
                :style="{ width: cat.total > 0 ? (cat.completadas / cat.total * 100) + '%' : '0%' }" />
            </div>
          </div>
          <div v-if="!progresoCategorias.length" class="text-center py-6 text-default-400 text-sm">
            Sin categorías registradas aún.
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between mb-5">
        <p class="text-sm font-semibold text-default-700">Últimas citas completadas</p>
        <router-link to="/citas" class="text-xs text-rose-500 hover:underline font-medium">Ver todas</router-link>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex gap-4 animate-pulse">
          <div class="size-10 rounded-xl bg-default-100 flex-shrink-0" />
          <div class="flex-1 space-y-2 py-1">
            <div class="h-3 bg-default-100 rounded w-3/4" />
            <div class="h-2 bg-default-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="!resumen?.citas_recientes?.length" class="text-center py-10 text-default-400">
        <Icon icon="lucide:heart" class="size-10 mx-auto mb-2 text-rose-200" />
        <p class="text-sm">Aún no han completado ninguna cita.</p>
        <router-link to="/citas" class="text-xs text-rose-500 mt-1 block hover:underline">¡Empezar ahora!</router-link>
      </div>

      <div v-else class="space-y-3">
        <div v-for="cita in resumen.citas_recientes" :key="cita.id"
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-default-50 transition-colors">
          <div class="size-10 rounded-xl overflow-hidden flex-shrink-0 bg-rose-100 flex items-center justify-center">
            <img v-if="cita.portada_url" :src="API_BASE + cita.portada_url" :alt="cita.nombre"
              class="size-full object-cover" />
            <Icon v-else icon="lucide:heart" class="size-5 text-rose-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-default-800 truncate">{{ cita.nombre }}</p>
            <p class="text-xs text-default-400">{{ cita.categoria ?? 'Sin categoría' }} · {{ formatFecha(cita.fecha_completado) }}</p>
          </div>
          <div class="flex gap-0.5 flex-shrink-0">
            <Icon v-for="s in 5" :key="s"
              icon="lucide:star"
              class="size-3.5"
              :class="s <= (cita.calificacion ?? 0) ? 'text-amber-400' : 'text-default-200'" />
          </div>
        </div>
      </div>
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
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000'
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

const today = new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

interface CitaReciente {
  id: number; nombre: string; categoria: string | null
  calificacion: number | null; fecha_completado: string | null; portada_url: string | null
}
interface CatProgreso { id: number; nombre: string; total: number; completadas: number }
interface Resumen {
  total_completadas: number; total_recuerdos: number; total_parejas: number
  total_citas: number; pendientes: number
  citas_recientes: CitaReciente[]; progreso_categorias: CatProgreso[]
}

const loading = ref(true)
const resumen = ref<Resumen | null>(null)

const pct = computed(() => {
  if (!resumen.value || !resumen.value.total_citas) return 0
  return Math.min(100, (resumen.value.total_completadas / resumen.value.total_citas) * 100)
})
const progressArc = computed(() => (pct.value / 100) * 251.2)

const motivationalMsg = computed(() => {
  const p = pct.value
  if (p === 0)  return '¡Toda aventura comienza con el primer paso!'
  if (p < 25)   return '¡Buen comienzo! La aventura apenas empieza 🌱'
  if (p < 50)   return '¡Van por la mitad! Siguen construyendo su historia 💑'
  if (p < 75)   return '¡Increíble progreso! La Paz los está esperando 🏙️'
  if (p < 100)  return '¡Casi lo logran! El final está cerca ✨'
  return '¡Lo lograron! 100 citas, 100 recuerdos 🎉'
})

const stats = computed(() => {
  const r = resumen.value
  return [
    { label: 'Citas completadas',  value: r?.total_completadas ?? 0, icon: 'lucide:heart',       bg: 'bg-rose-100',   color: 'text-rose-500',   badge: `${Math.round(pct.value)}%` },
    { label: 'Recuerdos guardados', value: r?.total_recuerdos ?? 0,   icon: 'lucide:camera',      bg: 'bg-violet-100', color: 'text-violet-500', badge: null },
    { label: 'Parejas registradas', value: r?.total_parejas ?? 0,     icon: 'lucide:users-round', bg: 'bg-sky-100',    color: 'text-sky-500',    badge: null },
    { label: 'Citas pendientes',    value: r?.pendientes ?? 0,        icon: 'lucide:map-pin',     bg: 'bg-amber-100',  color: 'text-amber-500',  badge: null },
  ]
})

const progresoCategorias = computed(() => resumen.value?.progreso_categorias ?? [])

function formatFecha(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7)  return `Hace ${diff} días`
  return d.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  try {
    const res = await auth.authFetch(`${API}/dashboard/resumen`)
    if (res.ok) resumen.value = await res.json()
  } catch {}
  loading.value = false
})
</script>
