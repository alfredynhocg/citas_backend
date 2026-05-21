<template>
  <Vertical>
    <AppLoader v-if="loading" fullPage label="Cargando reporte..." />
    <div v-else class="p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-widest text-rose-500">Reporte 1</span>
          </div>
          <h1 class="text-2xl font-bold text-default-900">Análisis General del Sistema</h1>
          <p class="text-sm text-default-500 mt-0.5">Estadísticas globales de 100 Citas Románticas en La Paz</p>
        </div>
        <router-link to="/reportes/tendencias"
          class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors">
          Reporte 2 <Icon icon="lucide:arrow-right" class="size-3.5" />
        </router-link>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="m in metricas" :key="m.label" class="card p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div :class="m.bg" class="size-10 rounded-xl flex items-center justify-center">
              <Icon :icon="m.icon" :class="m.color" class="size-5" />
            </div>
            <span v-if="m.badge" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{{ m.badge }}</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ m.value }}</p>
            <p class="text-xs text-default-500 mt-0.5">{{ m.label }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-4">Citas completadas por categoría</p>
          <VueApexCharts v-if="data?.por_categoria?.length" type="donut" height="280"
            :options="donutOpts" :series="donutSeries" />
        </div>

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-4">Top 5 citas más populares</p>
          <VueApexCharts v-if="data?.top_citas?.length" type="bar" height="280"
            :options="barOpts" :series="barSeries" />
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-default-100">
          <p class="text-sm font-semibold text-default-700">Detalle — Citas más completadas</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-default-50 text-xs text-default-500 uppercase tracking-wide">
              <tr>
                <th class="px-6 py-3 text-left">#</th>
                <th class="px-6 py-3 text-left">Cita</th>
                <th class="px-6 py-3 text-left">Categoría</th>
                <th class="px-6 py-3 text-center">Completadas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default-100">
              <tr v-for="(c, i) in data?.top_citas" :key="i" class="hover:bg-default-50 transition-colors">
                <td class="px-6 py-3 text-default-400 font-mono">{{ i + 1 }}</td>
                <td class="px-6 py-3 font-medium text-default-900">{{ c.nombre }}</td>
                <td class="px-6 py-3 text-default-500">{{ c.categoria }}</td>
                <td class="px-6 py-3 text-center">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                    {{ c.total }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="size-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-400 flex items-center justify-center">
            <Icon icon="lucide:sparkles" class="size-4 text-white" />
          </div>
          <div>
            <p class="text-sm font-semibold text-default-900">Análisis automático — IA</p>
            <p class="text-xs text-default-400">Generado por Llama 3.2 · 100 Citas Románticas</p>
          </div>
        </div>

        <div v-if="data?.analisis_ia?.resumen" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl bg-violet-50 border border-violet-100 p-4">
            <p class="text-[10px] font-semibold text-violet-500 uppercase tracking-wide mb-1">Resumen</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.resumen }}</p>
          </div>
          <div class="rounded-xl bg-green-50 border border-green-100 p-4">
            <p class="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">Punto fuerte</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.punto_fuerte }}</p>
          </div>
          <div class="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p class="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1">Punto débil</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.punto_debil }}</p>
          </div>
          <div class="rounded-xl bg-rose-50 border border-rose-100 p-4">
            <p class="text-[10px] font-semibold text-rose-600 uppercase tracking-wide mb-1">Conclusión</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.conclusion }}</p>
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

const metricas = computed(() => {
  const m = data.value?.metricas
  if (!m) return []
  return [
    { label: 'Usuarios activos',      value: m.total_usuarios,    icon: 'lucide:users',         bg: 'bg-sky-100',    color: 'text-sky-500',    badge: null },
    { label: 'Citas completadas',     value: m.total_completadas, icon: 'lucide:heart',         bg: 'bg-rose-100',   color: 'text-rose-500',   badge: `${m.pct_global}%` },
    { label: 'Calificación promedio', value: `${m.cal_promedio}★`, icon: 'lucide:star',         bg: 'bg-amber-100',  color: 'text-amber-500',  badge: null },
    { label: 'Ingresos (Bs)',         value: m.ingresos_bs.toFixed(0), icon: 'lucide:banknote', bg: 'bg-green-100',  color: 'text-green-600',  badge: `${m.total_pagos} pagos` },
    { label: 'Grupos / parejas',      value: m.total_grupos,      icon: 'lucide:users-round',   bg: 'bg-violet-100', color: 'text-violet-500', badge: null },
    { label: 'Recuerdos guardados',   value: m.total_recuerdos,   icon: 'lucide:camera',        bg: 'bg-pink-100',   color: 'text-pink-500',   badge: null },
    { label: 'Citas disponibles',     value: m.total_citas,       icon: 'lucide:map-pin',       bg: 'bg-default-100',color: 'text-default-500',badge: null },
    { label: 'Pagos aprobados',       value: m.total_pagos,       icon: 'lucide:receipt',       bg: 'bg-teal-100',   color: 'text-teal-600',   badge: null },
  ]
})

const donutSeries = computed(() =>
  (data.value?.por_categoria ?? []).map((c: any) => c.completadas)
)
const donutOpts = computed(() => ({
  chart: { type: 'donut', animations: { enabled: true } },
  labels: (data.value?.por_categoria ?? []).map((c: any) => c.categoria),
  colors: ['#f43f5e','#8b5cf6','#06b6d4','#f59e0b','#10b981','#ec4899','#6366f1','#84cc16','#f97316','#14b8a6'],
  legend: { position: 'bottom', fontSize: '11px' },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { size: '60%' } } },
}))

const barSeries = computed(() => [{
  name: 'Veces completada',
  data: (data.value?.top_citas ?? []).map((c: any) => c.total),
}])
const barOpts = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, distributed: true } },
  colors: ['#f43f5e','#fb7185','#fda4af','#fecdd3','#fff1f2'],
  xaxis: {
    categories: (data.value?.top_citas ?? []).map((c: any) =>
      c.nombre.length > 22 ? c.nombre.slice(0, 20) + '…' : c.nombre
    ),
    labels: { style: { fontSize: '11px' } },
  },
  legend: { show: false },
  dataLabels: { enabled: true, style: { fontSize: '11px' } },
  grid: { borderColor: '#f1f5f9' },
}))

onMounted(async () => {
  try {
    const res = await auth.authFetch(`${API}/reportes/general`)
    if (res.ok) data.value = await res.json()
  } catch {}
  loading.value = false
})
</script>
