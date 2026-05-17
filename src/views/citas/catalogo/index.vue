<template>
  <Vertical>
  <div class="p-6 space-y-6">

    <div>
      <h1 class="text-2xl font-bold text-default-900">Catálogo de Citas</h1>
      <p class="text-sm text-default-500 mt-0.5">100 experiencias románticas en La Paz para descubrir juntos.</p>
    </div>

    <!-- Filtros por categoría -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="cat in categories" :key="cat.key"
        @click="activeCategory = cat.key"
        :class="[
          'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border',
          activeCategory === cat.key
            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
            : 'bg-white text-default-600 border-default-200 hover:border-rose-300 hover:text-rose-500'
        ]"
      >
        <span>{{ cat.icon }}</span>
        {{ cat.label }}
      </button>
    </div>

    <!-- Grid de citas — skeleton o cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

      <!-- Skeletons -->
      <template v-if="loading">
        <div v-for="i in 8" :key="i" class="card p-5 animate-pulse space-y-3">
          <div class="h-3 bg-default-100 rounded w-1/4" />
          <div class="h-4 bg-default-100 rounded w-3/4" />
          <div class="h-3 bg-default-100 rounded w-full" />
          <div class="h-3 bg-default-100 rounded w-5/6" />
          <div class="flex gap-2 mt-2">
            <div class="h-6 w-16 bg-default-100 rounded-full" />
            <div class="h-6 w-16 bg-default-100 rounded-full" />
          </div>
        </div>
      </template>

      <!-- Cards reales -->
      <div
        v-else
        v-for="cita in filtered" :key="cita.id"
        class="card p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        @click="openCita(cita)"
      >
        <div class="flex items-start justify-between">
          <span class="text-xs font-bold text-default-400">#{{ String(cita.order).padStart(2,'0') }}</span>
          <span :class="statusClass(cita.status)" class="text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {{ statusLabel(cita.status) }}
          </span>
        </div>
        <div class="text-3xl">{{ cita.icon }}</div>
        <div>
          <h3 class="text-sm font-semibold text-default-900 group-hover:text-rose-500 transition-colors leading-snug">
            {{ cita.title }}
          </h3>
          <p class="text-xs text-default-500 mt-1 line-clamp-2">{{ cita.description }}</p>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-auto pt-2">
          <span class="flex items-center gap-1 text-[10px] text-default-500 bg-default-100 px-2 py-0.5 rounded-full">
            <Icon icon="lucide:clock" class="size-3" /> {{ cita.duration }}
          </span>
          <span class="flex items-center gap-1 text-[10px] text-default-500 bg-default-100 px-2 py-0.5 rounded-full">
            <Icon icon="lucide:banknote" class="size-3" /> {{ cita.cost }}
          </span>
          <span :class="diffClass(cita.difficulty)" class="text-[10px] px-2 py-0.5 rounded-full">
            {{ cita.difficulty }}
          </span>
        </div>
      </div>
    </div>

    <!-- Drawer detalle de cita -->
    <transition name="slide">
      <div v-if="selected" class="fixed inset-y-0 right-0 z-50 flex">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="selected = null" />
        <div class="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col">
          <!-- Header drawer -->
          <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-default-200 px-6 py-4 flex items-center justify-between z-10">
            <span class="text-xs font-bold text-default-400">CITA #{{ String(selected.order).padStart(2,'0') }}</span>
            <button @click="selected = null" class="text-default-400 hover:text-default-700 transition-colors">
              <Icon icon="lucide:x" class="size-5" />
            </button>
          </div>
          <!-- Contenido -->
          <div class="p-6 flex-1 space-y-5">
            <div class="text-5xl">{{ selected.icon }}</div>
            <h2 class="text-xl font-bold text-default-900">{{ selected.title }}</h2>
            <p class="text-sm text-default-600 leading-relaxed">{{ selected.description }}</p>

            <div class="grid grid-cols-3 gap-3">
              <div class="bg-default-50 rounded-xl p-3 text-center">
                <Icon icon="lucide:clock" class="size-5 mx-auto mb-1 text-default-400" />
                <p class="text-xs font-semibold text-default-700">{{ selected.duration }}</p>
                <p class="text-[10px] text-default-400">Duración</p>
              </div>
              <div class="bg-default-50 rounded-xl p-3 text-center">
                <Icon icon="lucide:banknote" class="size-5 mx-auto mb-1 text-default-400" />
                <p class="text-xs font-semibold text-default-700">{{ selected.cost }}</p>
                <p class="text-[10px] text-default-400">Costo</p>
              </div>
              <div class="bg-default-50 rounded-xl p-3 text-center">
                <Icon icon="lucide:bar-chart-2" class="size-5 mx-auto mb-1 text-default-400" />
                <p class="text-xs font-semibold text-default-700">{{ selected.difficulty }}</p>
                <p class="text-[10px] text-default-400">Dificultad</p>
              </div>
            </div>

            <div class="bg-rose-50 rounded-xl p-4">
              <p class="text-xs font-semibold text-rose-700 flex items-center gap-1.5 mb-1">
                <Icon icon="lucide:map-pin" class="size-3.5" /> Ubicación sugerida
              </p>
              <p class="text-sm text-rose-800">{{ selected.location }}</p>
            </div>
          </div>

          <!-- Acción -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-default-200 p-4">
            <button
              @click="completar(selected)"
              :disabled="selected.status === 'completada'"
              class="w-full py-3 rounded-xl font-semibold text-sm transition-all
                     bg-rose-500 hover:bg-rose-600 text-white
                     disabled:bg-default-100 disabled:text-default-400 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
            >
              <Icon :icon="selected.status === 'completada' ? 'lucide:check-circle' : 'lucide:heart'" class="size-4" />
              {{ selected.status === 'completada' ? 'Ya completada ✓' : 'Marcar como completada' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useConfetti } from '@/composables/useConfetti'
import Vertical from '@/layouts/vertical.vue'

const { burst } = useConfetti()
const loading = ref(false)
const activeCategory = ref('todas')

interface Cita {
  id: number; order: number; title: string; description: string
  icon: string; duration: string; cost: string; difficulty: string
  location: string; category: string; status: 'pendiente' | 'en_progreso' | 'completada'
}

const selected = ref<Cita | null>(null)

const categories = [
  { key: 'todas',       label: 'Todas',       icon: '💫' },
  { key: 'gastronomia', label: 'Gastronomía', icon: '🍽️' },
  { key: 'naturaleza',  label: 'Naturaleza',  icon: '🌄' },
  { key: 'cultura',     label: 'Cultura',     icon: '🎭' },
  { key: 'noche',       label: 'Noche',       icon: '🌙' },
  { key: 'arte',        label: 'Arte',        icon: '🎨' },
]

const citas = ref<Cita[]>([
  { id:1, order:1, title:'Cena en el Mercado Lanza', description:'Descubran los sabores auténticos paceños en el mercado más emblemático.', icon:'🍽️', duration:'2h', cost:'Bajo', difficulty:'Fácil', location:'Mercado Lanza, centro de La Paz', category:'gastronomia', status:'completada' },
  { id:2, order:2, title:'Mirador Killi Killi', description:'Contemplen juntos la ciudad al atardecer desde este icónico mirador.', icon:'🌄', duration:'1.5h', cost:'Gratuito', difficulty:'Fácil', location:'Mirador Killi Killi, Villa Pabón', category:'naturaleza', status:'completada' },
  { id:3, order:3, title:'Museo Nacional de Arte', description:'Exploren siglos de arte boliviano en un edificio colonial del s. XVIII.', icon:'🎭', duration:'2h', cost:'Bajo', difficulty:'Fácil', location:'Calle Socabaya, Casco Viejo', category:'cultura', status:'pendiente' },
  { id:4, order:4, title:'Noche de peñas en La Paz', description:'Disfruten música y baile folclórico en una peña auténtica paceña.', icon:'🌙', duration:'3h', cost:'Medio', difficulty:'Fácil', location:'Peña Huari, Sagárnaga', category:'noche', status:'pendiente' },
  { id:5, order:5, title:'Taller de cerámica', description:'Creen juntos una pieza de barro que recuerde este momento.', icon:'🎨', duration:'2.5h', cost:'Medio', difficulty:'Medio', location:'Centro Cultural, Sopocachi', category:'arte', status:'pendiente' },
  { id:6, order:6, title:'Valle de la Luna', description:'Exploren las formaciones lunares a solo 15 min del centro.', icon:'🌋', duration:'3h', cost:'Bajo', difficulty:'Medio', location:'Valle de la Luna, Mallasa', category:'naturaleza', status:'pendiente' },
  { id:7, order:7, title:'Teleférico al atardecer', description:'Un paseo en teleférico con vistas panorámicas de la ciudad.', icon:'🚡', duration:'2h', cost:'Bajo', difficulty:'Fácil', location:'Estación Central, Sopocachi', category:'naturaleza', status:'pendiente' },
  { id:8, order:8, title:'Café colonial en Casco Viejo', description:'Un café con historia en los edificios coloniales del centro histórico.', icon:'☕', duration:'1h', cost:'Bajo', difficulty:'Fácil', location:'Plaza Murillo, Centro', category:'gastronomia', status:'pendiente' },
])

const filtered = computed(() =>
  activeCategory.value === 'todas'
    ? citas.value
    : citas.value.filter(c => c.category === activeCategory.value)
)

function openCita(cita: Cita) { selected.value = cita }

function completar(cita: Cita) {
  if (cita.status === 'completada') return
  cita.status = 'completada'
  // Confetti desde el centro de la pantalla
  burst(window.innerWidth / 2, window.innerHeight / 2)
  setTimeout(() => { selected.value = null }, 600)
}

function statusLabel(s: string) {
  return { pendiente: 'Pendiente', en_progreso: 'En progreso', completada: 'Completada' }[s] ?? s
}
function statusClass(s: string) {
  return {
    pendiente:   'bg-default-100 text-default-500',
    en_progreso: 'bg-blue-100 text-blue-600',
    completada:  'bg-green-100 text-green-600',
  }[s] ?? ''
}
function diffClass(d: string) {
  return {
    Fácil: 'bg-green-100 text-green-600',
    Medio: 'bg-amber-100 text-amber-600',
    Difícil: 'bg-red-100 text-red-600',
  }[d] ?? 'bg-default-100 text-default-500'
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
