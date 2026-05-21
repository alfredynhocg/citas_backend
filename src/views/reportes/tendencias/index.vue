<template>
  <Vertical>
    <AppLoader v-if="loading" fullPage label="Cargando reporte..." />
    <div v-else class="p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-widest text-violet-500">Reporte 2</span>
          </div>
          <h1 class="text-2xl font-bold text-default-900">Tendencias y Comportamiento</h1>
          <p class="text-sm text-default-500 mt-0.5">Evolución y patrones de uso en los últimos 6 meses</p>
        </div>
        <div class="flex items-center gap-2">
          <router-link to="/reportes/general"
            class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-default-100 text-default-700 hover:bg-default-200 transition-colors">
            <Icon icon="lucide:arrow-left" class="size-3.5" /> Reporte 1
          </router-link>
          <router-link to="/reportes/prediccion"
            class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors">
            Reporte 3 <Icon icon="lucide:arrow-right" class="size-3.5" />
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Actividad mensual — últimos 6 meses</p>
          <p class="text-xs text-default-400 mb-4">Citas completadas por mes</p>
          <VueApexCharts v-if="data?.actividad_mensual?.length" type="area" height="240"
            :options="areaOpts" :series="areaSeries" />
          <div v-else class="h-40 flex items-center justify-center text-default-300 text-sm">Sin datos suficientes</div>
        </div>

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Usuarios más activos</p>
          <p class="text-xs text-default-400 mb-4">Top 5 por citas completadas</p>
          <VueApexCharts v-if="data?.usuarios_activos?.length" type="bar" height="240"
            :options="usuariosOpts" :series="usuariosSeries" />
          <div v-else class="h-40 flex items-center justify-center text-default-300 text-sm">Sin datos</div>
        </div>

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Tendencia por categoría</p>
          <p class="text-xs text-default-400 mb-4">Últimos 30 días vs 30 días anteriores</p>
          <VueApexCharts v-if="tendenciaCats.length" type="bar" height="240"
            :options="tendenciaOpts" :series="tendenciaSeries" />
          <div v-else class="h-40 flex items-center justify-center text-default-300 text-sm">Sin datos</div>
        </div>

        <div class="card p-6">
          <p class="text-sm font-semibold text-default-700 mb-1">Calificación promedio por categoría</p>
          <p class="text-xs text-default-400 mb-4">Sobre 5 estrellas</p>
          <VueApexCharts v-if="data?.calificacion_por_categoria?.length" type="radar" height="240"
            :options="radarOpts" :series="radarSeries" />
          <div v-else class="h-40 flex items-center justify-center text-default-300 text-sm">Sin datos</div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-default-100">
          <p class="text-sm font-semibold text-default-700">Detalle — Variación por categoría</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-default-50 text-xs text-default-500 uppercase tracking-wide">
              <tr>
                <th class="px-6 py-3 text-left">Categoría</th>
                <th class="px-6 py-3 text-center">Últimos 30d</th>
                <th class="px-6 py-3 text-center">30d anteriores</th>
                <th class="px-6 py-3 text-center">Variación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default-100">
              <tr v-for="t in data?.tendencia_categorias" :key="t.categoria" class="hover:bg-default-50 transition-colors">
                <td class="px-6 py-3 font-medium text-default-900">{{ t.categoria }}</td>
                <td class="px-6 py-3 text-center text-default-700">{{ t.recientes }}</td>
                <td class="px-6 py-3 text-center text-default-500">{{ t.anteriores }}</td>
                <td class="px-6 py-3 text-center">
                  <span :class="t.delta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Icon :icon="t.delta >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="size-3" />
                    {{ t.delta >= 0 ? '+' : '' }}{{ t.delta }} ({{ t.pct_cambio }}%)
                  </span>
                </td>
              </tr>
              <tr v-if="!data?.tendencia_categorias?.length">
                <td colspan="4" class="px-6 py-8 text-center text-default-300 text-sm">Sin datos disponibles</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="size-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-400 flex items-center justify-center">
            <Icon icon="lucide:sparkles" class="size-4 text-white" />
          </div>
          <div>
            <p class="text-sm font-semibold text-default-900">Análisis de tendencias — IA</p>
            <p class="text-xs text-default-400">Generado por Llama 3.2 · Últimos 6 meses</p>
          </div>
        </div>

        <div v-if="data?.analisis_ia?.tendencia_general" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl bg-violet-50 border border-violet-100 p-4">
            <p class="text-[10px] font-semibold text-violet-500 uppercase tracking-wide mb-1">Tendencia general</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.tendencia_general }}</p>
          </div>
          <div class="rounded-xl bg-green-50 border border-green-100 p-4">
            <p class="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">Categoría en auge</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.categoria_en_auge }}</p>
          </div>
          <div class="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p class="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1">Alerta</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.alerta }}</p>
          </div>
          <div class="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
            <p class="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide mb-1">Recomendación</p>
            <p class="text-sm text-default-700">{{ data.analisis_ia.recomendacion }}</p>
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

const tendenciaCats = computed(() => data.value?.tendencia_categorias ?? [])

const areaSeries = computed(() => [{
  name: 'Citas completadas',
  data: (data.value?.actividad_mensual ?? []).map((m: any) => m.total),
}])
const areaOpts = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false } },
  colors: ['#8b5cf6'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: (data.value?.actividad_mensual ?? []).map((m: any) => m.mes),
    labels: { style: { fontSize: '11px' } },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { x: { show: true } },
}))

const usuariosSeries = computed(() => [{
  name: 'Completadas',
  data: (data.value?.usuarios_activos ?? []).map((u: any) => u.completadas),
}])
const usuariosOpts = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, distributed: true } },
  colors: ['#8b5cf6','#a78bfa','#c4b5fd','#7c3aed','#6d28d9'],
  xaxis: {
    categories: (data.value?.usuarios_activos ?? []).map((u: any) =>
      u.nombre.length > 14 ? u.nombre.slice(0, 12) + '…' : u.nombre
    ),
    labels: { style: { fontSize: '10px' } },
  },
  legend: { show: false },
  dataLabels: { enabled: true, style: { fontSize: '11px' } },
  grid: { borderColor: '#f1f5f9' },
}))

const tendenciaSeries = computed(() => [
  { name: 'Últimos 30d', data: tendenciaCats.value.map((t: any) => t.recientes) },
  { name: '30d anteriores', data: tendenciaCats.value.map((t: any) => t.anteriores) },
])
const tendenciaOpts = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%' } },
  colors: ['#8b5cf6','#e2e8f0'],
  xaxis: {
    categories: tendenciaCats.value.map((t: any) =>
      t.categoria.length > 10 ? t.categoria.slice(0, 9) + '…' : t.categoria
    ),
    labels: { style: { fontSize: '10px' } },
  },
  legend: { position: 'top', fontSize: '11px' },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
}))

const radarSeries = computed(() => [{
  name: 'Calificación',
  data: (data.value?.calificacion_por_categoria ?? []).map((c: any) => c.promedio),
}])
const radarOpts = computed(() => ({
  chart: { type: 'radar', toolbar: { show: false } },
  colors: ['#8b5cf6'],
  xaxis: {
    categories: (data.value?.calificacion_por_categoria ?? []).map((c: any) => c.categoria),
  },
  yaxis: { min: 0, max: 5, tickAmount: 5 },
  fill: { opacity: 0.2 },
  stroke: { width: 2 },
  markers: { size: 4 },
}))

onMounted(async () => {
  try {
    const res = await auth.authFetch(`${API}/reportes/tendencias`)
    if (res.ok) data.value = await res.json()
  } catch {}
  loading.value = false
})
</script>
