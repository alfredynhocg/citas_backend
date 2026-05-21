<template>
  <Vertical>
    <AppLoader v-if="loading" fullPage label="Cargando reporte..." />
    <div v-else class="p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-widest text-green-600">Reporte 3</span>
          </div>
          <h1 class="text-2xl font-bold text-default-900">Predicción y Recomendación Inteligente</h1>
          <p class="text-sm text-default-500 mt-0.5">Proyecciones y oportunidades de mejora</p>
        </div>
        <router-link to="/reportes/tendencias"
          class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-default-100 text-default-700 hover:bg-default-200 transition-colors">
          <Icon icon="lucide:arrow-left" class="size-3.5" /> Reporte 2
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-5 flex flex-col gap-2">
          <div class="size-10 rounded-xl bg-green-100 flex items-center justify-center mb-1">
            <Icon icon="lucide:trending-up" class="size-5 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-default-900">{{ data?.proyeccion?.promedio_mensual ?? 0 }}</p>
          <p class="text-xs text-default-500">Promedio citas/mes</p>
        </div>
        <div class="card p-5 flex flex-col gap-2">
          <div class="size-10 rounded-xl bg-blue-100 flex items-center justify-center mb-1">
            <Icon icon="lucide:calendar-check" class="size-5 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-default-900">{{ data?.proyeccion?.ultimo_mes ?? 0 }}</p>
          <p class="text-xs text-default-500">Último mes registrado</p>
        </div>
        <div class="card p-5 flex flex-col gap-2">
          <div class="size-10 rounded-xl bg-violet-100 flex items-center justify-center mb-1">
            <Icon icon="lucide:crystal-ball" class="size-5 text-violet-600" />
          </div>
          <p class="text-2xl font-bold text-default-900">{{ data?.proyeccion?.proyeccion_3m ?? 0 }}</p>
          <p class="text-xs text-default-500">Proyección próximos 3 meses</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Historial de actividad</p>
          <p class="text-xs text-default-400 mb-4">Base para la proyección</p>
          <VueApexCharts v-if="data?.proyeccion?.historial?.length" type="line" height="220"
            :options="lineOpts" :series="lineSeries" />
          <div v-else class="h-32 flex items-center justify-center text-default-300 text-sm">Sin datos</div>
        </div>

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Categorías con baja adopción</p>
          <p class="text-xs text-default-400 mb-4">Menos del 30% de citas completadas</p>
          <VueApexCharts v-if="data?.categorias_baja_adopcion?.length" type="bar" height="220"
            :options="bajaOpts" :series="bajaSeries" />
          <div v-else class="h-32 flex items-center justify-center text-green-400 text-sm">
            <Icon icon="lucide:check-circle" class="size-5 mr-1" /> Todas las categorías superan el 30%
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-default-100 flex items-center gap-2">
            <Icon icon="lucide:moon" class="size-4 text-amber-500" />
            <p class="text-sm font-semibold text-default-700">Citas sin completar por nadie</p>
          </div>
          <div class="divide-y divide-default-100">
            <div v-for="c in data?.citas_sin_completar" :key="c.nombre"
              class="px-6 py-3 flex items-center justify-between hover:bg-default-50 transition-colors">
              <div>
                <p class="text-sm font-medium text-default-900">{{ c.nombre }}</p>
                <p class="text-xs text-default-400">{{ c.categoria }}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Sin completar</span>
            </div>
            <div v-if="!data?.citas_sin_completar?.length" class="px-6 py-8 text-center text-default-300 text-sm">
              <Icon icon="lucide:party-popper" class="size-6 mx-auto mb-1" />
              Todas las citas tienen al menos un registro
            </div>
          </div>
        </div>

        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-default-100 flex items-center gap-2">
            <Icon icon="lucide:user-x" class="size-4 text-rose-500" />
            <p class="text-sm font-semibold text-default-700">Usuarios sin actividad reciente</p>
          </div>
          <div class="divide-y divide-default-100">
            <div v-for="u in data?.usuarios_inactivos" :key="u.nombre"
              class="px-6 py-3 flex items-center justify-between hover:bg-default-50 transition-colors">
              <div>
                <p class="text-sm font-medium text-default-900">{{ u.nombre }}</p>
                <p class="text-xs text-default-400">Última actividad: {{ u.ultima_actividad }}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">{{ u.total }} citas</span>
            </div>
            <div v-if="!data?.usuarios_inactivos?.length" class="px-6 py-8 text-center text-default-300 text-sm">
              <Icon icon="lucide:check-circle" class="size-6 mx-auto mb-1" />
              Todos los usuarios estuvieron activos recientemente
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="size-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
            <Icon icon="lucide:sparkles" class="size-4 text-white" />
          </div>
          <div>
            <p class="text-sm font-semibold text-default-900">Análisis predictivo — IA</p>
            <p class="text-xs text-default-400">Generado por Llama 3.2 · Proyección 3 meses</p>
          </div>
        </div>

        <div v-if="data?.analisis_ia?.prediccion">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div class="rounded-xl bg-green-50 border border-green-100 p-4">
              <p class="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">Predicción</p>
              <p class="text-sm text-default-700">{{ data.analisis_ia.prediccion }}</p>
            </div>
            <div class="rounded-xl bg-rose-50 border border-rose-100 p-4">
              <p class="text-[10px] font-semibold text-rose-600 uppercase tracking-wide mb-1">Riesgo principal</p>
              <p class="text-sm text-default-700">{{ data.analisis_ia.riesgo_principal }}</p>
            </div>
          </div>
          <div class="rounded-xl bg-violet-50 border border-violet-100 p-4 mb-4">
            <p class="text-[10px] font-semibold text-violet-500 uppercase tracking-wide mb-2">Oportunidad</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.oportunidad }}</p>
          </div>
          <div v-if="data.analisis_ia.recomendaciones?.length" class="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p class="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-3">Recomendaciones de acción</p>
            <ul class="space-y-2">
              <li v-for="(r, i) in data.analisis_ia.recomendaciones" :key="i"
                class="flex items-start gap-2 text-sm text-default-700">
                <span class="size-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{{ i + 1 }}</span>
                {{ r }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-center py-4 text-default-400 text-sm">
          <Icon icon="lucide:bot" class="size-8 mx-auto mb-1 text-default-200" />
          No se pudo generar el análisis IA. Verifica que Ollama esté corriendo.
        </div>
      </div>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import VueApexCharts from 'vue3-apexcharts'
import Vertical from '@/layouts/vertical.vue'
import AppLoader from '@/components/AppLoader.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
const loading = ref(true)
const data = ref<any>(null)

const lineSeries = computed(() => [{
  name: 'Completadas',
  data: (data.value?.proyeccion?.historial ?? []).map((h: any) => h.total),
}])
const lineOpts = computed(() => ({
  chart: { type: 'line', toolbar: { show: false } },
  colors: ['#10b981'],
  stroke: { curve: 'smooth', width: 2.5 },
  markers: { size: 5, colors: ['#10b981'], strokeColors: '#fff', strokeWidth: 2 },
  xaxis: {
    categories: (data.value?.proyeccion?.historial ?? []).map((h: any) => h.mes),
    labels: { style: { fontSize: '11px' } },
  },
  dataLabels: { enabled: true, style: { fontSize: '10px' } },
  grid: { borderColor: '#f1f5f9' },
  annotations: {
    yaxis: [{
      y: data.value?.proyeccion?.promedio_mensual ?? 0,
      borderColor: '#6366f1',
      borderWidth: 1,
      strokeDashArray: 4,
      label: { text: 'Promedio', style: { color: '#6366f1', fontSize: '10px', background: '#ede9fe' } },
    }],
  },
}))

const bajaSeries = computed(() => [{
  name: '% Adopción',
  data: (data.value?.categorias_baja_adopcion ?? []).map((c: any) => c.pct),
}])
const bajaOpts = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  colors: ['#f59e0b'],
  xaxis: {
    categories: (data.value?.categorias_baja_adopcion ?? []).map((c: any) => c.categoria),
    max: 100,
    labels: { formatter: (v: number) => `${v}%`, style: { fontSize: '11px' } },
  },
  dataLabels: { enabled: true, formatter: (v: number) => `${v}%`, style: { fontSize: '11px' } },
  grid: { borderColor: '#f1f5f9' },
  annotations: {
    xaxis: [{ x: 30, borderColor: '#ef4444', strokeDashArray: 4, label: { text: '30% umbral', style: { color: '#ef4444', fontSize: '10px' } } }],
  },
}))

onMounted(async () => {
  try {
    const res = await auth.authFetch(`${API}/reportes/prediccion`)
    if (res.ok) data.value = await res.json()
  } catch {}
  loading.value = false
})
</script>
