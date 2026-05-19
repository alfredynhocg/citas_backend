<template>
  <Vertical>
  <div class="p-6 space-y-6">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-default-900">Bienvenido, {{ auth.user?.name?.split(' ')[0] }}</h1>
        <p class="text-sm text-default-500 mt-0.5">Aquí está el resumen de tu aventura romántica.</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-default-400 capitalize">{{ today }}</span>
        <button @click="exportarPDF"
          class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-default-200 hover:bg-default-50 transition-colors text-default-600">
          <Icon icon="lucide:download" class="size-3.5" />
          Exportar PDF
        </button>
      </div>
    </div>

    <!-- Stats cards -->
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

    <!-- Fila 2: donut + barras de categoría -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Donut de progreso -->
      <div class="card p-6 flex flex-col items-center justify-center text-center lg:col-span-1">
        <p class="text-sm font-semibold text-default-700 mb-4">Progreso General</p>
        <div v-if="!loading && resumen">
          <VueApexCharts type="donut" height="220" :options="donutOpts" :series="donutSeries" />
        </div>
        <div v-else class="size-44 rounded-full bg-default-100 animate-pulse mx-auto" />
        <div class="mt-4 w-full space-y-1">
          <div class="flex justify-between text-xs text-default-500">
            <span>{{ Math.round(pct) }}% completado</span>
            <span>{{ resumen?.pendientes ?? 0 }} restantes</span>
          </div>
          <div class="h-1.5 rounded-full bg-default-100 overflow-hidden">
            <div class="h-full bg-rose-500 rounded-full transition-all duration-1000"
              :style="{ width: pct + '%' }" />
          </div>
        </div>
        <p class="mt-3 text-xs text-default-400 italic">{{ motivationalMsg }}</p>
      </div>

      <!-- Barras de progreso por categoría (ApexCharts horizontal) -->
      <div class="card p-6 lg:col-span-2">
        <p class="text-sm font-semibold text-default-700 mb-4">Progreso por Categoría</p>
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 4" :key="i" class="space-y-1.5 animate-pulse">
            <div class="h-3 bg-default-100 rounded w-1/3" />
            <div class="h-2 bg-default-100 rounded" />
          </div>
        </div>
        <VueApexCharts v-else-if="progresoCategorias.length"
          type="bar" height="260"
          :options="barOpts" :series="barSeries" />
        <div v-else class="text-center py-6 text-default-400 text-sm">
          Sin categorías registradas aún.
        </div>
      </div>
    </div>

    <!-- Fila 3: línea de tiempo + actividad semanal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Área: citas completadas por mes -->
      <div class="card p-6">
        <p class="text-sm font-semibold text-default-700 mb-4">Actividad mensual</p>
        <VueApexCharts v-if="!loading && areaData.length"
          type="area" height="200"
          :options="areaOpts" :series="areaSeries" />
        <div v-else-if="loading" class="h-48 bg-default-50 rounded-xl animate-pulse" />
        <div v-else class="h-48 flex items-center justify-center text-default-400 text-sm">
          Sin actividad registrada aún.
        </div>
      </div>

      <!-- Radar de categorías -->
      <div class="card p-6">
        <p class="text-sm font-semibold text-default-700 mb-4">Cobertura por categoría</p>
        <VueApexCharts v-if="!loading && progresoCategorias.length"
          type="radar" height="200"
          :options="radarOpts" :series="radarSeries" />
        <div v-else-if="loading" class="h-48 bg-default-50 rounded-xl animate-pulse" />
        <div v-else class="h-48 flex items-center justify-center text-default-400 text-sm">
          Sin datos aún.
        </div>
      </div>
    </div>

    <!-- Últimas citas completadas -->
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
            <img v-if="cita.portada_url" :src="citaImgUrl(cita.portada_url)" :alt="cita.nombre"
              class="size-full object-cover" />
            <Icon v-else icon="lucide:heart" class="size-5 text-rose-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-default-800 truncate">{{ cita.nombre }}</p>
            <p class="text-xs text-default-400">{{ cita.categoria ?? 'Sin categoría' }} · {{ formatFecha(cita.fecha_completado) }}</p>
          </div>
          <div class="flex gap-0.5 flex-shrink-0">
            <Icon v-for="s in 5" :key="s" icon="lucide:star" class="size-3.5"
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
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'

const auth = useAuthStore()
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000'
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

function citaImgUrl(url: string | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return API_BASE + url
}

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

const motivationalMsg = computed(() => {
  const p = pct.value
  if (p === 0)  return 'Toda aventura comienza con el primer paso!'
  if (p < 25)   return 'Buen comienzo! La aventura apenas empieza'
  if (p < 50)   return 'Van por la mitad! Siguen construyendo su historia'
  if (p < 75)   return 'Increible progreso! La Paz los esta esperando'
  if (p < 100)  return 'Casi lo logran! El final esta cerca'
  return 'Lo lograron! 100 citas, 100 recuerdos'
})

const stats = computed(() => {
  const r = resumen.value
  return [
    { label: 'Citas completadas',   value: r?.total_completadas ?? 0, icon: 'lucide:heart',       bg: 'bg-rose-100',   color: 'text-rose-500',   badge: `${Math.round(pct.value)}%` },
    { label: 'Recuerdos guardados', value: r?.total_recuerdos ?? 0,   icon: 'lucide:camera',      bg: 'bg-violet-100', color: 'text-violet-500', badge: null },
    { label: 'Grupos / Parejas',    value: r?.total_parejas ?? 0,     icon: 'lucide:users-round', bg: 'bg-sky-100',    color: 'text-sky-500',    badge: null },
    { label: 'Citas pendientes',    value: r?.pendientes ?? 0,        icon: 'lucide:map-pin',     bg: 'bg-amber-100',  color: 'text-amber-500',  badge: null },
  ]
})

const progresoCategorias = computed(() => resumen.value?.progreso_categorias ?? [])

// ─── Donut ────────────────────────────────────────────────────────────────────
const donutSeries = computed(() => [
  resumen.value?.total_completadas ?? 0,
  resumen.value?.pendientes ?? 100,
])
const donutOpts = computed(() => ({
  chart: { type: 'donut', animations: { enabled: true } },
  labels: ['Completadas', 'Pendientes'],
  colors: ['#f43f5e', '#e2e8f0'],
  legend: { show: false },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v: number) => `${v} citas` } },
  plotOptions: { pie: { donut: { size: '68%' } } },
  stroke: { width: 0 },
}))

// ─── Barras horizontales por categoría ────────────────────────────────────────
const barSeries = computed(() => [{
  name: 'Completadas',
  data: progresoCategorias.value.map(c => c.completadas),
}, {
  name: 'Total',
  data: progresoCategorias.value.map(c => c.total - c.completadas),
}])

const barOpts = computed(() => ({
  chart: { type: 'bar', stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  colors: ['#f43f5e', '#e2e8f0'],
  xaxis: {
    categories: progresoCategorias.value.map(c =>
      c.nombre.length > 18 ? c.nombre.slice(0, 16) + '…' : c.nombre
    ),
    labels: { style: { fontSize: '11px' } },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  tooltip: {
    y: { formatter: (v: number, opts: any) => {
      const cat = progresoCategorias.value[opts.dataPointIndex]
      return opts.seriesIndex === 0
        ? `${v} completadas de ${cat.total}`
        : `${v} pendientes`
    }},
  },
  grid: { borderColor: '#f1f5f9' },
}))

// ─── Área: actividad mensual (últimas 6 citas agrupadas por mes) ──────────────
const areaData = computed(() => {
  const citas = resumen.value?.citas_recientes ?? []
  const meses: Record<string, number> = {}
  citas.forEach(c => {
    if (!c.fecha_completado) return
    const key = new Date(c.fecha_completado).toLocaleDateString('es-BO', { month: 'short', year: '2-digit' })
    meses[key] = (meses[key] ?? 0) + 1
  })
  return Object.entries(meses).map(([mes, count]) => ({ x: mes, y: count }))
})

const areaSeries = computed(() => [{ name: 'Citas', data: areaData.value }])
const areaOpts = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false } },
  colors: ['#f43f5e'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { type: 'category', labels: { style: { fontSize: '11px' } } },
  yaxis: { min: 0, tickAmount: 3, labels: { formatter: (v: number) => Math.round(v).toString() } },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { y: { formatter: (v: number) => `${v} cita${v !== 1 ? 's' : ''}` } },
}))

// ─── Radar por categoría ───────────────────────────────────────────────────────
const radarSeries = computed(() => [{
  name: 'Completadas %',
  data: progresoCategorias.value.map(c =>
    c.total > 0 ? Math.round((c.completadas / c.total) * 100) : 0
  ),
}])
const radarOpts = computed(() => ({
  chart: { type: 'radar', toolbar: { show: false } },
  colors: ['#f43f5e'],
  fill: { opacity: 0.2 },
  stroke: { width: 1.5 },
  markers: { size: 3 },
  xaxis: {
    categories: progresoCategorias.value.map(c =>
      c.nombre.length > 12 ? c.nombre.slice(0, 10) + '…' : c.nombre
    ),
  },
  yaxis: { show: false, min: 0, max: 100 },
  plotOptions: { radar: { polygons: { strokeColors: '#f1f5f9', connectorColors: '#f1f5f9' } } },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v: number) => `${v}%` } },
}))

// ─── PDF export ───────────────────────────────────────────────────────────────
function exportarPDF() {
  const r = resumen.value
  if (!r) return

  const cats = r.progreso_categorias.map(c =>
    `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${c.nombre}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${c.completadas}/${c.total}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${c.total > 0 ? Math.round((c.completadas/c.total)*100) : 0}%</td>
    </tr>`
  ).join('')

  const recientes = r.citas_recientes.map(c =>
    `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${c.nombre}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${c.categoria ?? '—'}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${'★'.repeat(c.calificacion ?? 0)}${'☆'.repeat(5-(c.calificacion ?? 0))}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${formatFecha(c.fecha_completado)}</td>
    </tr>`
  ).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Reporte — 100 Citas Románticas</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',Arial,sans-serif; }
    body { padding:40px; color:#1e293b; font-size:13px; }
    .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #f43f5e; padding-bottom:16px; margin-bottom:24px; }
    h1 { font-size:22px; color:#f43f5e; } h2 { font-size:14px; margin:20px 0 10px; color:#475569; }
    .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
    .stat { background:#fdf2f4; border-radius:10px; padding:14px; text-align:center; }
    .stat .val { font-size:28px; font-weight:700; color:#f43f5e; }
    .stat .lbl { font-size:11px; color:#94a3b8; margin-top:2px; }
    table { width:100%; border-collapse:collapse; margin-bottom:20px; }
    thead th { background:#fdf2f4; padding:8px 12px; text-align:left; font-size:11px; color:#f43f5e; text-transform:uppercase; letter-spacing:.05em; }
    .footer { margin-top:32px; text-align:center; font-size:11px; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:12px; }
  </style></head><body>
  <div class="header">
    <div><h1>100 Citas Románticas en La Paz</h1>
    <p style="color:#94a3b8;font-size:12px;margin-top:4px">Reporte generado el ${new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'long', year:'numeric' })}</p></div>
    <div style="text-align:right;font-size:12px;color:#475569">
      <p><b>${auth.user?.name ?? ''}</b></p>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="val">${r.total_completadas}</div><div class="lbl">Citas completadas</div></div>
    <div class="stat"><div class="val">${r.total_citas}</div><div class="lbl">Total citas</div></div>
    <div class="stat"><div class="val">${Math.round(pct.value)}%</div><div class="lbl">Progreso</div></div>
    <div class="stat"><div class="val">${r.pendientes}</div><div class="lbl">Pendientes</div></div>
  </div>
  <h2>Progreso por Categoría</h2>
  <table><thead><tr><th>Categoría</th><th style="text-align:center">Completadas</th><th style="text-align:center">Porcentaje</th></tr></thead>
  <tbody>${cats}</tbody></table>
  <h2>Últimas Citas Completadas</h2>
  <table><thead><tr><th>Cita</th><th>Categoría</th><th style="text-align:center">Calificación</th><th>Fecha</th></tr></thead>
  <tbody>${recientes}</tbody></table>
  <div class="footer">100 Citas Románticas en La Paz — Tu aventura romántica documentada</div>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 500)
}

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
