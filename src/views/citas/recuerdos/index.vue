<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Recuerdos</h1>
          <p class="text-sm text-default-500 mt-0.5">Los momentos que han vivido juntos.</p>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="recuerdos.length" @click="exportarPDF"
            class="inline-flex items-center gap-2 border border-default-200 text-default-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-default-50 transition-colors flex-shrink-0">
            <Icon icon="lucide:download" class="size-4" />
            PDF
          </button>
          <button @click="abrirModalRegistrar"
            class="inline-flex items-center gap-2 bg-rose-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-600 transition-colors flex-shrink-0">
            <Icon icon="lucide:plus" class="size-4" />
            Registrar cita
          </button>
        </div>
      </div>

      <div v-if="stats" class="grid grid-cols-3 gap-3">
        <div class="card p-4 text-center space-y-1">
          <p class="text-2xl font-extrabold text-rose-500">{{ stats.completadas }}</p>
          <p class="text-xs text-default-500">Completadas</p>
        </div>
        <div class="card p-4 text-center space-y-1">
          <p class="text-2xl font-extrabold text-default-700">{{ stats.total }}</p>
          <p class="text-xs text-default-500">Total citas</p>
        </div>
        <div class="card p-4 text-center space-y-1">
          <p class="text-2xl font-extrabold text-amber-500">{{ stats.porcentaje }}%</p>
          <p class="text-xs text-default-500">Progreso</p>
        </div>
      </div>

      <div v-if="stats" class="card p-4 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-default-700">Progreso del aventurero</span>
          <span class="text-default-400">{{ stats.completadas }} / {{ stats.total }}</span>
        </div>
        <div class="h-2.5 bg-default-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-700"
            :style="{ width: (stats.porcentaje || 0) + '%' }" />
        </div>
        <p class="text-[10px] text-default-400 text-right">
          {{ stats.porcentaje }}% del catálogo explorado
        </p>
      </div>

      <AppLoader v-if="loading" />

      <div v-else-if="recuerdos.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="r in recuerdos" :key="r.id"
          @click="verDetalle(r)"
          class="card overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 group">

          <div class="relative h-44 overflow-hidden bg-default-100">
            <img
              v-if="imagenUrl(r.cita_imagen)"
              :src="imagenUrl(r.cita_imagen)"
              :alt="r.cita"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="($event.target as HTMLImageElement).style.display='none'" />
            <div
              class="w-full h-full flex flex-col items-center justify-center gap-2"
              :class="categoryColor(r.cita_categoria)">
              <span class="text-5xl">{{ categoryEmoji(r.cita_categoria) }}</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div class="absolute bottom-2 left-2 right-2 flex items-end justify-between">
              <span v-if="r.cita_categoria"
                class="text-[10px] font-semibold bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-default-700">
                {{ r.cita_categoria }}
              </span>
              <div v-if="r.calificacion" class="flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <Icon icon="lucide:star" class="size-3 text-amber-400 fill-amber-400" />
                <span class="text-[10px] font-bold text-white">{{ r.calificacion }}/5</span>
              </div>
            </div>
          </div>

          <div class="p-4 space-y-2">
            <h3 class="font-bold text-default-900 leading-snug line-clamp-1">{{ r.cita }}</h3>
            <p v-if="r.anecdota" class="text-xs text-default-500 line-clamp-2 leading-relaxed">
              "{{ r.anecdota }}"
            </p>
            <p v-else class="text-xs text-default-300 italic">Sin anécdota guardada</p>
            <div class="flex items-center justify-between pt-1 border-t border-default-50">
              <span class="text-[10px] text-default-400 flex items-center gap-1">
                <Icon icon="lucide:calendar" class="size-3" />
                {{ formatFecha(r.fecha_completado) }}
              </span>
              <div class="flex gap-0.5">
                <Icon v-for="s in 5" :key="s" icon="lucide:star"
                  class="size-3"
                  :class="r.calificacion && s <= r.calificacion
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-default-200'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="card p-16 text-center space-y-4">
        <div class="size-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
          <Icon icon="lucide:camera" class="size-12 text-rose-300" />
        </div>
        <div>
          <p class="font-bold text-default-800 text-lg">Aún no hay recuerdos</p>
          <p class="text-sm text-default-400 mt-1">Completa una cita y guarda tu primer recuerdo juntos.</p>
        </div>
        <button @click="abrirModalRegistrar"
          class="inline-flex items-center gap-2 bg-rose-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-rose-600 transition-colors">
          <Icon icon="lucide:plus" class="size-4" />
          Registrar primera cita
        </button>
      </div>

    </div>

    <Teleport to="body">
      <div v-if="recuerdoDetalle"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="recuerdoDetalle = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

          <div class="relative h-52 bg-default-100">
            <img
              v-if="imagenUrl(recuerdoDetalle.cita_imagen)"
              :src="imagenUrl(recuerdoDetalle.cita_imagen)"
              class="w-full h-full object-cover"
              @error="($event.target as HTMLImageElement).style.display='none'" />
            <div class="w-full h-full flex items-center justify-center text-7xl"
              :class="categoryColor(recuerdoDetalle.cita_categoria)">
              {{ categoryEmoji(recuerdoDetalle.cita_categoria) }}
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button @click="recuerdoDetalle = null"
              class="absolute top-3 right-3 size-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors">
              <Icon icon="lucide:x" class="size-4" />
            </button>
            <div class="absolute bottom-3 left-4">
              <p v-if="recuerdoDetalle.cita_categoria"
                class="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-0.5">
                {{ recuerdoDetalle.cita_categoria }}
              </p>
              <h2 class="text-lg font-bold text-white leading-tight">{{ recuerdoDetalle.cita }}</h2>
            </div>
          </div>

          <div class="p-5 space-y-4">
            <p v-if="recuerdoDetalle.cita_descripcion"
              class="text-sm text-default-500 leading-relaxed">
              {{ recuerdoDetalle.cita_descripcion }}
            </p>

            <div class="flex items-center gap-2">
              <div class="flex gap-0.5">
                <Icon v-for="s in 5" :key="s" icon="lucide:star" class="size-5"
                  :class="recuerdoDetalle.calificacion && s <= recuerdoDetalle.calificacion
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-default-200'" />
              </div>
              <span v-if="recuerdoDetalle.calificacion" class="text-sm font-semibold text-default-700">
                {{ recuerdoDetalle.calificacion }}/5
              </span>
              <span v-else class="text-sm text-default-300 italic">Sin calificación</span>
            </div>

            <div v-if="recuerdoDetalle.anecdota" class="bg-rose-50 rounded-xl p-4 border-l-4 border-rose-300">
              <p class="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-1.5">
                <Icon icon="lucide:quote" class="size-3.5 inline mr-1" />Nuestra anécdota
              </p>
              <p class="text-sm text-default-700 leading-relaxed italic">
                "{{ recuerdoDetalle.anecdota }}"
              </p>
            </div>
            <div v-else class="bg-default-50 rounded-xl p-4 text-center">
              <p class="text-xs text-default-400 italic">No hay anécdota guardada para este recuerdo.</p>
            </div>

            <div class="flex items-center justify-between text-xs text-default-400 pt-1 border-t border-default-100">
              <span class="flex items-center gap-1.5">
                <Icon icon="lucide:calendar" class="size-3.5" />
                Completada el {{ formatFecha(recuerdoDetalle.fecha_completado) }}
              </span>
              <button @click="recuerdoDetalle = null"
                class="text-rose-500 font-medium hover:underline">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showModalRegistrar"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="showModalRegistrar = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-5 border-b border-default-100 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-default-900">Registrar cita completada</h3>
              <p class="text-xs text-default-400 mt-0.5">Guarda el recuerdo de una cita que ya realizaron</p>
            </div>
            <button @click="showModalRegistrar = false"
              class="size-8 rounded-full hover:bg-default-100 flex items-center justify-center transition-colors flex-shrink-0">
              <Icon icon="lucide:x" class="size-4 text-default-500" />
            </button>
          </div>
          <div class="p-5 space-y-4">

            <div>
              <label class="text-xs font-semibold text-default-600 mb-1.5 block">Cita realizada</label>
              <div v-if="loadingCitas" class="flex items-center gap-2 text-xs text-default-400 py-2">
                <Icon icon="lucide:loader-circle" class="size-4 animate-spin" />
                Cargando citas disponibles...
              </div>
              <select v-else v-model="formRegistrar.cita_id"
                class="w-full border border-default-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                <option value="" disabled>Selecciona una cita...</option>
                <option v-for="c in citasDisponibles" :key="c.id" :value="c.id">
                  {{ c.nombre }}{{ c.categoria_nombre ? ` · ${c.categoria_nombre}` : '' }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs font-semibold text-default-600 mb-1.5 block">¿Cómo la calificarías?</label>
              <div class="flex items-center gap-1">
                <button v-for="s in 5" :key="s" type="button"
                  @click="formRegistrar.calificacion = s"
                  class="transition-all hover:scale-125">
                  <Icon icon="lucide:star" class="size-8 transition-colors"
                    :class="formRegistrar.calificacion && s <= formRegistrar.calificacion
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-default-200 hover:text-amber-300'" />
                </button>
                <span v-if="formRegistrar.calificacion" class="ml-2 text-sm font-semibold text-default-600">
                  {{ ['', 'Mala', 'Regular', 'Buena', 'Muy buena', '¡Increíble!'][formRegistrar.calificacion] }}
                </span>
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold text-default-600 mb-1.5 block">
                Anécdota
                <span class="font-normal text-default-400">(opcional)</span>
              </label>
              <textarea v-model="formRegistrar.anecdota" rows="3"
                placeholder="¿Qué fue lo más especial de esta cita? ¿Algún momento gracioso o emotivo?"
                class="w-full border border-default-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none leading-relaxed" />
            </div>

            <p v-if="errorRegistrar" class="text-sm text-red-500 flex items-center gap-1.5">
              <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
              {{ errorRegistrar }}
            </p>

            <div class="flex gap-3 pt-1">
              <button @click="showModalRegistrar = false"
                class="flex-1 py-2.5 border border-default-200 rounded-xl text-sm text-default-600 hover:bg-default-50 transition-colors">
                Cancelar
              </button>
              <button @click="guardarRecuerdo" :disabled="loadingGuardar || !formRegistrar.cita_id"
                class="flex-1 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                <Icon v-if="loadingGuardar" icon="lucide:loader-circle" class="size-4 animate-spin" />
                {{ loadingGuardar ? 'Guardando...' : 'Guardar recuerdo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Vertical from '@/layouts/vertical.vue'
import AppLoader from '@/components/AppLoader.vue'
import { useAuthStore } from '@/stores/auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
const BASE = 'http://localhost:5000'
const auth = useAuthStore()

const loading            = ref(true)
const recuerdos          = ref<any[]>([])
const stats              = ref<any>(null)
const recuerdoDetalle    = ref<any>(null)
const showModalRegistrar = ref(false)
const loadingCitas       = ref(false)
const loadingGuardar     = ref(false)
const citasDisponibles   = ref<any[]>([])
const errorRegistrar     = ref('')
const formRegistrar      = ref({ cita_id: '' as string | number, calificacion: 0, anecdota: '' })

const CATEGORY_MAP: Record<string, { bg: string; emoji: string }> = {
  'Gastronomía':  { bg: 'bg-orange-50',  emoji: '🍽️' },
  'Naturaleza':   { bg: 'bg-green-50',   emoji: '🌿' },
  'Cultura':      { bg: 'bg-purple-50',  emoji: '🎭' },
  'Aventura':     { bg: 'bg-sky-50',     emoji: '🏔️' },
  'Romántico':    { bg: 'bg-rose-50',    emoji: '💕' },
  'Arte':         { bg: 'bg-yellow-50',  emoji: '🎨' },
  'Noche':        { bg: 'bg-indigo-50',  emoji: '🌙' },
}

function categoryColor(cat: string | null): string {
  return CATEGORY_MAP[cat ?? '']?.bg ?? 'bg-amber-50'
}

function categoryEmoji(cat: string | null): string {
  return CATEGORY_MAP[cat ?? '']?.emoji ?? '📍'
}

function imagenUrl(url: string | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return BASE + url
}

function formatFecha(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function cargarRecuerdos() {
  loading.value = true
  try {
    const res = await auth.authFetch(`${API}/progreso/mis-recuerdos`)
    if (res.ok) recuerdos.value = await res.json()
  } catch {}
  loading.value = false
}

async function cargarEstadisticas() {
  try {
    const res = await auth.authFetch(`${API}/progreso/estadisticas`)
    if (res.ok) stats.value = await res.json()
  } catch {}
}

async function cargarCitas() {
  loadingCitas.value = true
  try {
    const res = await auth.authFetch(`${API}/citas`)
    if (res.ok) {
      const data = await res.json()
      citasDisponibles.value = Array.isArray(data) ? data : (data.citas ?? [])
    }
  } catch {}
  loadingCitas.value = false
}

function verDetalle(r: any) {
  recuerdoDetalle.value = r
}

function abrirModalRegistrar() {
  formRegistrar.value = { cita_id: '', calificacion: 0, anecdota: '' }
  errorRegistrar.value = ''
  showModalRegistrar.value = true
  if (!citasDisponibles.value.length) cargarCitas()
}

async function guardarRecuerdo() {
  errorRegistrar.value = ''
  loadingGuardar.value = true
  try {
    const res = await auth.authFetch(`${API}/progreso/completar`, {
      method: 'POST',
      body: JSON.stringify({
        cita_id:     Number(formRegistrar.value.cita_id),
        tipo:        'individual',
        calificacion: formRegistrar.value.calificacion || null,
        anecdota:    formRegistrar.value.anecdota || null,
      }),
    })
    if (!res.ok) {
      const e = await res.json()
      errorRegistrar.value = e.message ?? 'Error al guardar'
      return
    }
    showModalRegistrar.value = false
    await Promise.all([cargarRecuerdos(), cargarEstadisticas()])
  } catch {
    errorRegistrar.value = 'Error de conexión'
  } finally {
    loadingGuardar.value = false
  }
}

function exportarPDF() {
  const filas = recuerdos.value.map((r, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-weight:600">${i + 1}. ${r.cita ?? '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${r.cita_categoria ?? '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${'★'.repeat(r.calificacion ?? 0)}${'☆'.repeat(5 - (r.calificacion ?? 0))}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${formatFecha(r.fecha_completado)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-style:italic;color:#64748b">${r.anecdota ? `"${r.anecdota}"` : '—'}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Mis Recuerdos — 100 Citas Románticas</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',Arial,sans-serif; }
    body { padding:40px; color:#1e293b; font-size:12px; }
    .header { border-bottom:3px solid #f43f5e; padding-bottom:16px; margin-bottom:24px; }
    h1 { font-size:20px; color:#f43f5e; }
    .sub { color:#94a3b8; font-size:11px; margin-top:4px; }
    .stats { display:flex; gap:16px; margin-bottom:24px; }
    .stat { background:#fdf2f4; border-radius:10px; padding:12px 20px; text-align:center; }
    .stat .val { font-size:24px; font-weight:700; color:#f43f5e; }
    .stat .lbl { font-size:10px; color:#94a3b8; margin-top:2px; }
    table { width:100%; border-collapse:collapse; }
    thead th { background:#fdf2f4; padding:8px 12px; text-align:left; font-size:10px; color:#f43f5e; text-transform:uppercase; letter-spacing:.05em; }
    tbody tr:hover { background:#fafafa; }
    .footer { margin-top:28px; text-align:center; font-size:10px; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:12px; }
  </style></head><body>
  <div class="header">
    <h1>Mis Recuerdos — 100 Citas Románticas en La Paz</h1>
    <p class="sub">Generado el ${new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="val">${stats.value?.completadas ?? 0}</div><div class="lbl">Completadas</div></div>
    <div class="stat"><div class="val">${stats.value?.total ?? 0}</div><div class="lbl">Total citas</div></div>
    <div class="stat"><div class="val">${stats.value?.porcentaje ?? 0}%</div><div class="lbl">Progreso</div></div>
  </div>
  <table>
    <thead><tr>
      <th>Cita</th><th style="text-align:center">Categoría</th>
      <th style="text-align:center">Calificación</th><th>Fecha</th><th>Anécdota</th>
    </tr></thead>
    <tbody>${filas}</tbody>
  </table>
  <div class="footer">100 Citas Románticas en La Paz — Tu historia de amor documentada</div>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 500)
}

onMounted(() => {
  cargarRecuerdos()
  cargarEstadisticas()
})
</script>
