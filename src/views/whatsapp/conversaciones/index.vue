<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-5">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Conversaciones WhatsApp</h1>
          <p class="text-sm text-default-500 mt-0.5">{{ total }} conversaciones encontradas</p>
        </div>
        <button @click="showGestionar = !showGestionar"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-default-200 text-sm font-medium text-default-600 hover:bg-default-50 transition-colors self-start sm:self-auto">
          <Icon icon="lucide:tags" class="size-4" />
          Gestionar etiquetas
        </button>
      </div>

      <div v-if="showGestionar" class="card p-5 space-y-4">
        <h3 class="text-sm font-semibold text-default-800">Etiquetas</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <div v-for="e in etiquetas" :key="e.id" class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
            :style="{ backgroundColor: e.color }">
            <span>{{ e.nombre }}</span>
            <button @click="iniciarEdicion(e)" class="opacity-70 hover:opacity-100"><Icon icon="lucide:pencil" class="size-3" /></button>
            <button @click="eliminarEtiqueta(e.id, e.nombre)" class="opacity-70 hover:opacity-100"><Icon icon="lucide:x" class="size-3" /></button>
          </div>
        </div>
        <div v-if="editando" class="flex gap-2 items-end">
          <div class="flex-1">
            <label class="block text-xs text-default-500 mb-1">Nombre</label>
            <input v-model="editNombre" class="form-input w-full text-sm" />
          </div>
          <div>
            <label class="block text-xs text-default-500 mb-1">Color</label>
            <input v-model="editColor" type="color" class="h-9 w-12 rounded-lg border border-default-200 cursor-pointer" />
          </div>
          <button @click="guardarEdicion" class="px-3 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold">Guardar</button>
          <button @click="editando = null" class="px-3 py-2 rounded-xl border border-default-200 text-xs">Cancelar</button>
        </div>
        <div class="flex gap-2 items-end border-t border-default-100 pt-3">
          <div class="flex-1">
            <label class="block text-xs text-default-500 mb-1">Nueva etiqueta</label>
            <input v-model="nuevaNombre" placeholder="Ej: VIP" class="form-input w-full text-sm" />
          </div>
          <div>
            <label class="block text-xs text-default-500 mb-1">Color</label>
            <input v-model="nuevaColor" type="color" class="h-9 w-12 rounded-lg border border-default-200 cursor-pointer" />
          </div>
          <button @click="crearEtiqueta" :disabled="guardandoNueva"
            class="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold disabled:opacity-50">
            Crear
          </button>
        </div>
      </div>

      <div class="card p-4 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px]">
          <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-default-400 pointer-events-none" />
          <input v-model="query" @keyup.enter="buscar" type="text" placeholder="Buscar por teléfono o nombre…"
            class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-default-200 focus:outline-none focus:border-rose-400 bg-default-50 placeholder-default-400" />
        </div>
        <select v-model="estadoFiltro" @change="buscar"
          class="text-sm rounded-xl border border-default-200 bg-default-50 px-3 py-2 focus:outline-none">
          <option value="">Todos los estados</option>
          <option v-for="e in estados" :key="e.value" :value="e.value">{{ e.label }}</option>
        </select>
        <select v-model="etiquetaFiltro" @change="buscar"
          class="text-sm rounded-xl border border-default-200 bg-default-50 px-3 py-2 focus:outline-none">
          <option :value="null">Todas las etiquetas</option>
          <option v-for="e in etiquetas" :key="e.id" :value="e.id">{{ e.nombre }}</option>
        </select>
      </div>

      <div v-if="seleccionados.size > 0" class="card p-4 border border-rose-200 bg-rose-50/50 space-y-3">
        <p class="text-sm font-semibold text-rose-700">{{ seleccionados.size }} conversación(es) seleccionada(s)</p>
        <div class="flex gap-3 flex-wrap">
          <textarea v-model="mensajeEnvio" rows="2" placeholder="Escribe un mensaje para enviar…"
            class="flex-1 min-w-[200px] form-input text-sm resize-none" />
          <div class="flex flex-col gap-2">
            <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-default-200 bg-white hover:bg-default-50 text-xs font-medium text-default-600">
              <Icon icon="lucide:paperclip" class="size-3.5" />
              {{ archivoAdjunto ? archivoAdjunto.name : 'Adjuntar' }}
              <input type="file" accept="image/*,application/pdf" class="hidden" @change="onArchivoSeleccionado" />
            </label>
            <button v-if="archivoAdjunto" @click="limpiarAdjunto" class="text-xs text-red-500 hover:underline text-left">Quitar archivo</button>
          </div>
          <button @click="enviarASeleccionados" :disabled="enviando"
            class="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
            <Icon :icon="enviando ? 'lucide:loader-circle' : 'lucide:send'" class="size-4" :class="{ 'animate-spin': enviando }" />
            {{ enviando ? 'Enviando…' : 'Enviar' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="card overflow-hidden">
        <div class="divide-y divide-default-100">
          <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-5 py-4 animate-pulse">
            <div class="size-4 bg-default-100 rounded" />
            <div class="size-10 rounded-full bg-default-100" />
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-default-100 rounded w-1/3" />
              <div class="h-3 bg-default-100 rounded w-1/4" />
            </div>
            <div class="h-5 w-16 bg-default-100 rounded-full" />
          </div>
        </div>
      </div>

      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-default-100 bg-default-50/60">
                <th class="px-4 py-3">
                  <input type="checkbox" :checked="todosSeleccionados" @change="toggleTodos"
                    class="rounded border-default-300" />
                </th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Contacto</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Estado</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Etiquetas</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Actualizado</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default-100">
              <tr v-for="c in conversaciones" :key="c.id" class="hover:bg-default-50/60 transition-colors group">
                <td class="px-4 py-3">
                  <input type="checkbox" :checked="seleccionados.has(c.id)" @change="toggleSeleccion(c.id)"
                    class="rounded border-default-300" />
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="size-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon icon="lucide:user" class="size-4 text-green-600" />
                    </div>
                    <div>
                      <p class="font-semibold text-default-900 text-sm">{{ c.nombre ?? phoneDisplay(c.phone) }}</p>
                      <p class="text-xs text-default-400">{{ phoneDisplay(c.phone) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="badgeClass(c.estado)">{{ estadoLabel(c.estado) }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="e in c.etiquetas" :key="e.id"
                      class="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      :style="{ backgroundColor: e.color }">{{ e.nombre }}</span>
                    <button @click="togglePanel(c.id)"
                      class="px-2 py-0.5 rounded-full text-xs border border-dashed border-default-300 text-default-400 hover:border-rose-300 hover:text-rose-500 transition-colors">
                      <Icon icon="lucide:plus" class="size-3" />
                    </button>
                  </div>
                  <!-- Panel de etiquetas -->
                  <div v-if="expandedConvId === c.id" class="mt-2 p-2 bg-white border border-default-200 rounded-xl shadow-lg flex flex-wrap gap-1.5 z-10">
                    <button v-for="e in etiquetas" :key="e.id"
                      @click="toggleEtiquetaEnConv(c, e.id)"
                      class="px-2.5 py-1 rounded-full text-xs font-medium border-2 transition-all"
                      :class="tieneEtiqueta(c, e.id) ? 'text-white border-transparent' : 'bg-white border-default-200 text-default-600'"
                      :style="tieneEtiqueta(c, e.id) ? { backgroundColor: e.color, borderColor: e.color } : {}">
                      {{ e.nombre }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 text-xs text-default-400">
                  {{ c.updated_at ? new Date(c.updated_at).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }) : '—' }}
                </td>
                <td class="px-4 py-3 text-right">
                  <RouterLink :to="`/whatsapp/mensajes/${encodeURIComponent(c.phone)}`"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-default-600 hover:bg-default-100 transition-colors opacity-0 group-hover:opacity-100">
                    <Icon icon="lucide:message-square" class="size-3.5" /> Ver chat
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-5 py-3 border-t border-default-100">
          <p class="text-xs text-default-400">Mostrando {{ conversaciones.length }} de {{ total }}</p>
          <div class="flex gap-1">
            <button v-for="p in totalPages" :key="p" @click="cambiarPagina(p)"
              class="size-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors"
              :class="p === pageIndex ? 'bg-rose-500 text-white' : 'text-default-500 hover:bg-default-100'">
              {{ p }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'

const auth = useAuthStore()
const BOT  = 'http://localhost:3001'

interface Etiqueta { id: number; nombre: string; color: string }
interface Conversacion {
  id: number; phone: string; nombre: string | null; estado: string
  etiquetas: Etiqueta[]; updated_at: string | null
}

const conversaciones = ref<Conversacion[]>([])
const total          = ref(0)
const loading        = ref(true)
const enviando       = ref(false)
const etiquetas      = ref<Etiqueta[]>([])
const showGestionar  = ref(false)
const expandedConvId = ref<number | null>(null)
const guardandoNueva = ref(false)
const seleccionados  = reactive(new Set<number>())

const query        = ref('')
const estadoFiltro = ref('')
const etiquetaFiltro = ref<number | null>(null)
const pageIndex    = ref(1)
const pageSize     = 15

const mensajeEnvio   = ref('')
const archivoAdjunto = ref<File | null>(null)
const tipoAdjunto    = ref<'image' | 'document'>('image')

const nuevaNombre = ref('')
const nuevaColor  = ref('#6366f1')
const editando    = ref<Etiqueta | null>(null)
const editNombre  = ref('')
const editColor   = ref('')

const estados = [
  { value: 'soporte', label: '🔴 Soporte' },
  { value: 'menu', label: 'Menú' },
  { value: 'tramites_lista', label: 'Trámites' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'secretarias', label: 'Secretarías' },
  { value: 'audiencias_publicas', label: 'Audiencias' },
]

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const todosSeleccionados = computed(() =>
  conversaciones.value.length > 0 && conversaciones.value.every(c => seleccionados.has(c.id))
)

async function cargar() {
  loading.value = true
  seleccionados.clear()
  const params = new URLSearchParams({ pageIndex: String(pageIndex.value), pageSize: String(pageSize) })
  if (query.value)           params.set('query', query.value)
  if (estadoFiltro.value)    params.set('estado', estadoFiltro.value)
  if (etiquetaFiltro.value)  params.set('etiqueta_id', String(etiquetaFiltro.value))
  try {
    const res = await fetch(`${BOT}/conversaciones?${params}`)
    if (res.ok) { const d = await res.json(); conversaciones.value = d.data ?? []; total.value = d.total ?? 0 }
  } catch {} finally { loading.value = false }
}

async function cargarEtiquetas() {
  try {
    const res = await auth.authFetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'}/whatsapp/etiquetas`)
    if (res.ok) { const d = await res.json(); etiquetas.value = d.data ?? [] }
  } catch {}
}

function buscar() { pageIndex.value = 1; cargar() }
function cambiarPagina(p: number) { pageIndex.value = p; cargar() }

function toggleSeleccion(id: number) {
  if (seleccionados.has(id)) seleccionados.delete(id)
  else seleccionados.add(id)
}
function toggleTodos() {
  if (todosSeleccionados.value) seleccionados.clear()
  else conversaciones.value.forEach(c => seleccionados.add(c.id))
}

function phoneDisplay(phone: string) { return phone.split('@')[0] }
function togglePanel(id: number) { expandedConvId.value = expandedConvId.value === id ? null : id }
function tieneEtiqueta(c: Conversacion, id: number) { return c.etiquetas.some(e => e.id === id) }

async function toggleEtiquetaEnConv(c: Conversacion, etiqId: number) {
  const actualIds = c.etiquetas.map(e => e.id)
  const nuevosIds = actualIds.includes(etiqId) ? actualIds.filter(x => x !== etiqId) : [...actualIds, etiqId]
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
  const res = await auth.authFetch(`${API}/whatsapp/conversaciones/${encodeURIComponent(c.phone)}/etiquetas`, {
    method: 'POST', body: JSON.stringify({ etiqueta_ids: nuevosIds }),
  })
  if (res.ok) {
    const d = await res.json()
    conversaciones.value = conversaciones.value.map(x => x.id === c.id ? { ...x, etiquetas: d.etiquetas } : x)
  }
}

async function crearEtiqueta() {
  if (!nuevaNombre.value.trim()) return
  guardandoNueva.value = true
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
  const res = await auth.authFetch(`${API}/whatsapp/etiquetas`, {
    method: 'POST', body: JSON.stringify({ nombre: nuevaNombre.value.trim(), color: nuevaColor.value }),
  })
  if (res.ok) { const e = await res.json(); etiquetas.value.push(e); nuevaNombre.value = ''; nuevaColor.value = '#6366f1' }
  guardandoNueva.value = false
}

function iniciarEdicion(e: Etiqueta) { editando.value = e; editNombre.value = e.nombre; editColor.value = e.color }
async function guardarEdicion() {
  if (!editando.value || !editNombre.value.trim()) return
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
  const res = await auth.authFetch(`${API}/whatsapp/etiquetas/${editando.value.id}`, {
    method: 'PUT', body: JSON.stringify({ nombre: editNombre.value.trim(), color: editColor.value }),
  })
  if (res.ok) {
    const updated = await res.json()
    etiquetas.value = etiquetas.value.map(x => x.id === updated.id ? updated : x)
    conversaciones.value = conversaciones.value.map(c => ({ ...c, etiquetas: c.etiquetas.map(e => e.id === updated.id ? updated : e) }))
    editando.value = null
  }
}

async function eliminarEtiqueta(id: number, nombre: string) {
  if (!confirm(`¿Eliminar etiqueta "${nombre}"?`)) return
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
  const res = await auth.authFetch(`${API}/whatsapp/etiquetas/${id}`, { method: 'DELETE' })
  if (res.ok) {
    etiquetas.value = etiquetas.value.filter(e => e.id !== id)
    conversaciones.value = conversaciones.value.map(c => ({ ...c, etiquetas: c.etiquetas.filter(e => e.id !== id) }))
  }
}

function onArchivoSeleccionado(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] ?? null
  archivoAdjunto.value = f
  if (f) tipoAdjunto.value = f.type === 'application/pdf' ? 'document' : 'image'
}
function limpiarAdjunto() { archivoAdjunto.value = null }

async function enviarASeleccionados() {
  const phones = conversaciones.value.filter(c => seleccionados.has(c.id)).map(c => c.phone)
  enviando.value = true
  try {
    if (archivoAdjunto.value) {
      const fd = new FormData()
      phones.forEach(p => fd.append('phones', p))
      fd.append('tipo', tipoAdjunto.value)
      fd.append('archivo', archivoAdjunto.value, archivoAdjunto.value.name)
      await fetch(`${BOT}/enviar-media`, { method: 'POST', body: fd })
      limpiarAdjunto()
    } else if (mensajeEnvio.value.trim()) {
      const endpoint = phones.length === 1 ? `${BOT}/enviar` : `${BOT}/enviar-masivo`
      const body = phones.length === 1
        ? { phone: phones[0], mensaje: mensajeEnvio.value }
        : { phones, mensaje: mensajeEnvio.value }
      await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      mensajeEnvio.value = ''
    }
    seleccionados.clear()
  } finally { enviando.value = false }
}

function badgeClass(estado: string) {
  const map: Record<string, string> = {
    menu: 'bg-default-100 text-default-600',
    tramites_lista: 'bg-blue-100 text-blue-600',
    noticias: 'bg-violet-100 text-violet-600',
    eventos: 'bg-amber-100 text-amber-600',
    secretarias: 'bg-teal-100 text-teal-600',
    audiencias_publicas: 'bg-cyan-100 text-cyan-600',
    soporte: 'bg-red-100 text-red-600 font-semibold',
  }
  return map[estado] ?? 'bg-default-100 text-default-500'
}

function estadoLabel(estado: string) {
  const map: Record<string, string> = {
    menu: 'Menú', tramites_lista: 'Trámites', noticias: 'Noticias',
    eventos: 'Eventos', secretarias: 'Secretarías', audiencias_publicas: 'Audiencias', soporte: '🔴 Soporte',
  }
  return map[estado] ?? estado
}

onMounted(() => { cargar(); cargarEtiquetas() })
</script>
