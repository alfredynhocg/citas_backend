<template>
  <div class="p-6 space-y-6">

    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-default-900">Bienvenido, {{ auth.user?.name?.split(' ')[0] }} 👋</h1>
        <p class="text-sm text-default-500 mt-0.5">Aquí está el resumen de tu aventura romántica.</p>
      </div>
      <span class="text-xs text-default-400">{{ today }}</span>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

    <!-- Progreso circular + categorías -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Progreso circular -->
      <div class="card p-6 flex flex-col items-center justify-center text-center lg:col-span-1">
        <p class="text-sm font-semibold text-default-700 mb-6">Progreso General</p>

        <!-- SVG circular -->
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
            <span class="text-4xl font-bold text-default-900">{{ completedCount }}</span>
            <span class="text-xs text-default-400">de 100 citas</span>
          </div>
        </div>

        <div class="mt-6 w-full space-y-1">
          <div class="flex justify-between text-xs text-default-500">
            <span>{{ Math.round(pct) }}% completado</span>
            <span>{{ 100 - completedCount }} restantes</span>
          </div>
          <div class="h-1.5 rounded-full bg-default-100 overflow-hidden">
            <div class="h-full bg-rose-500 rounded-full transition-all duration-1000"
              :style="{ width: pct + '%' }" />
          </div>
        </div>

        <p class="mt-4 text-xs text-default-400 italic">{{ motivationalMsg }}</p>
      </div>

      <!-- Categorías -->
      <div class="card p-6 lg:col-span-2">
        <p class="text-sm font-semibold text-default-700 mb-5">Progreso por Categoría</p>
        <div class="space-y-3.5">
          <div v-for="cat in categoryProgress" :key="cat.name" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="text-base">{{ cat.icon }}</span>
                <span class="font-medium text-default-700">{{ cat.name }}</span>
              </div>
              <span class="text-default-400">{{ cat.done }}/{{ cat.total }}</span>
            </div>
            <div class="h-2 rounded-full bg-default-100 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700"
                :style="{ width: (cat.done / cat.total * 100) + '%', background: cat.color }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Últimas citas completadas -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-5">
        <p class="text-sm font-semibold text-default-700">Últimas citas completadas</p>
        <router-link to="/citas" class="text-xs text-rose-500 hover:underline font-medium">Ver todas</router-link>
      </div>

      <!-- Skeleton loader mientras carga -->
      <div v-if="loadingRecent" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex gap-4 animate-pulse">
          <div class="size-10 rounded-xl bg-default-100 flex-shrink-0" />
          <div class="flex-1 space-y-2 py-1">
            <div class="h-3 bg-default-100 rounded w-3/4" />
            <div class="h-2 bg-default-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="recentCitas.length === 0" class="text-center py-10 text-default-400">
        <Icon icon="lucide:heart" class="size-10 mx-auto mb-2 text-rose-200" />
        <p class="text-sm">Aún no han completado ninguna cita.</p>
        <router-link to="/citas" class="text-xs text-rose-500 mt-1 block hover:underline">¡Empezar ahora!</router-link>
      </div>

      <div v-else class="space-y-3">
        <div v-for="cita in recentCitas" :key="cita.id"
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-default-50 transition-colors">
          <div class="size-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-lg">
            {{ cita.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-default-800 truncate">{{ cita.title }}</p>
            <p class="text-xs text-default-400">{{ cita.date }}</p>
          </div>
          <div class="flex gap-0.5">
            <Icon v-for="s in 5" :key="s"
              icon="lucide:star"
              class="size-3.5"
              :class="s <= cita.rating ? 'text-amber-400' : 'text-default-200'" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useCountUp } from '@/composables/useCountUp'

const auth = useAuthStore()
const loadingRecent = ref(true)

const today = new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Datos mock — se reemplazarán con llamadas a la API
const completedCount = useCountUp(23, 1400)
const totalMemories  = useCountUp(8,  1200)
const totalPairs     = useCountUp(1,  800)

const pct = computed(() => (completedCount.value / 100) * 100)
const progressArc = computed(() => (pct.value / 100) * 251.2)

const motivationalMsg = computed(() => {
  const p = pct.value
  if (p === 0) return '¡Toda aventura comienza con el primer paso!'
  if (p < 25)  return '¡Buen comienzo! La aventura apenas empieza 🌱'
  if (p < 50)  return '¡Van por la mitad! Siguen construyendo su historia 💑'
  if (p < 75)  return '¡Increíble progreso! La Paz los está esperando 🏙️'
  if (p < 100) return '¡Casi lo logran! El final está cerca ✨'
  return '¡Lo lograron! 100 citas, 100 recuerdos 🎉'
})

const stats = computed(() => [
  { label: 'Citas completadas', value: completedCount.value, icon: 'lucide:heart', bg: 'bg-rose-100', color: 'text-rose-500', badge: `${Math.round(pct.value)}%` },
  { label: 'Recuerdos guardados', value: totalMemories.value, icon: 'lucide:camera', bg: 'bg-violet-100', color: 'text-violet-500', badge: null },
  { label: 'Parejas registradas', value: totalPairs.value, icon: 'lucide:users-round', bg: 'bg-sky-100', color: 'text-sky-500', badge: null },
  { label: 'Citas pendientes', value: 100 - completedCount.value, icon: 'lucide:map-pin', bg: 'bg-amber-100', color: 'text-amber-500', badge: null },
])

const categoryProgress = [
  { name: 'Gastronomía', icon: '🍽️', done: 8,  total: 20, color: '#f43f5e' },
  { name: 'Naturaleza',  icon: '🌄', done: 5,  total: 15, color: '#22c55e' },
  { name: 'Cultura',     icon: '🎭', done: 6,  total: 18, color: '#a855f7' },
  { name: 'Noche',       icon: '🌙', done: 2,  total: 12, color: '#3b82f6' },
  { name: 'Arte',        icon: '🎨', done: 2,  total: 10, color: '#f59e0b' },
]

const recentCitas = ref<{ id: number; title: string; icon: string; date: string; rating: number }[]>([])

onMounted(async () => {
  await new Promise(r => setTimeout(r, 800))
  recentCitas.value = [
    { id: 1, title: 'Cena en el Mercado Lanza', icon: '🍽️', date: 'Hace 2 días', rating: 5 },
    { id: 2, title: 'Mirador Killi Killi al atardecer', icon: '🌄', date: 'Hace 5 días', rating: 4 },
    { id: 3, title: 'Museo Nacional de Arte', icon: '🎭', date: 'Hace 1 semana', rating: 5 },
  ]
  loadingRecent.value = false
})
</script>
