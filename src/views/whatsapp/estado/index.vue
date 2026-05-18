<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div>
        <h1 class="text-2xl font-bold text-default-900">Bot WhatsApp</h1>
        <p class="text-sm text-default-500 mt-0.5">Estado y control del servicio de chatbot.</p>
      </div>

      <div class="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div class="size-20 rounded-2xl flex items-center justify-center flex-shrink-0"
          :class="estadoColor.bg">
          <Icon :icon="estadoColor.icon" class="size-10" :class="[estadoColor.text, uiState === 'checking' || uiState === 'starting' || uiState === 'stopping' ? 'animate-spin' : '']" />
        </div>
        <div class="flex-1 text-center sm:text-left">
          <p class="text-xs text-default-400 uppercase tracking-wider mb-1">Estado del bot</p>
          <p class="text-2xl font-bold" :class="estadoColor.text">{{ estadoLabel }}</p>
          <p class="text-sm text-default-500 mt-1">{{ estadoDesc }}</p>
          <p v-if="processPid" class="text-xs text-default-400 mt-1">PID: {{ processPid }}</p>
        </div>
        <div class="flex gap-3 flex-shrink-0">
          <button v-if="uiState === 'stopped'" @click="iniciar"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all">
            <Icon icon="lucide:play" class="size-4" /> Iniciar
          </button>
          <button v-if="uiState === 'connected'" @click="desconectarWhatsApp"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-300 text-amber-600 hover:bg-amber-50 text-sm font-medium transition-colors">
            <Icon icon="lucide:link-2-off" class="size-4" /> Desvincular WA
          </button>
          <button v-if="uiState === 'connected' || uiState === 'qr' || uiState === 'connecting'" @click="detener"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
            <Icon icon="lucide:square" class="size-4" /> Detener
          </button>
          <button v-if="uiState === 'qr'" @click="cargarQr"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-default-200 text-default-600 hover:bg-default-50 text-sm font-medium transition-colors">
            <Icon icon="lucide:refresh-cw" class="size-4" /> Refrescar QR
          </button>
        </div>
      </div>

      <div v-if="uiState === 'qr'" class="card p-8 flex flex-col items-center gap-4">
        <div class="size-9 rounded-xl bg-amber-100 flex items-center justify-center">
          <Icon icon="lucide:qr-code" class="size-5 text-amber-600" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-default-900">Escanea el código QR</p>
          <p class="text-sm text-default-500 mt-1">Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo</p>
        </div>
        <div v-if="qrDataUrl" class="p-3 bg-white border border-default-200 rounded-2xl shadow-sm">
          <img :src="qrDataUrl" alt="QR WhatsApp" class="size-56" />
        </div>
        <div v-else class="size-56 bg-default-100 rounded-2xl flex items-center justify-center animate-pulse">
          <Icon icon="lucide:loader-circle" class="size-8 text-default-300 animate-spin" />
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="card p-5">
          <p class="text-xs text-default-400 mb-1">Proceso</p>
          <p class="text-sm font-semibold" :class="processPid ? 'text-green-600' : 'text-default-400'">
            {{ processPid ? 'Corriendo' : 'Detenido' }}
          </p>
        </div>
        <div class="card p-5">
          <p class="text-xs text-default-400 mb-1">WhatsApp</p>
          <p class="text-sm font-semibold" :class="uiState === 'connected' ? 'text-green-600' : 'text-default-400'">
            {{ uiState === 'connected' ? 'Conectado' : 'Desconectado' }}
          </p>
        </div>
        <div class="card p-5">
          <p class="text-xs text-default-400 mb-1">PID</p>
          <p class="text-sm font-semibold text-default-700">{{ processPid ?? '—' }}</p>
        </div>
      </div>

      <div class="card overflow-hidden">
        <button @click="toggleLogs"
          class="w-full flex items-center justify-between px-6 py-4 hover:bg-default-50 transition-colors">
          <div class="flex items-center gap-3">
            <Icon icon="lucide:terminal" class="size-4 text-default-500" />
            <span class="text-sm font-medium text-default-700">Logs del bot</span>
          </div>
          <Icon :icon="showLogs ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4 text-default-400" />
        </button>
        <div v-if="showLogs" class="border-t border-default-100">
          <pre class="p-4 text-xs text-default-600 font-mono bg-default-50 overflow-auto max-h-64 whitespace-pre-wrap">{{ logsContent || 'Sin logs disponibles.' }}</pre>
        </div>
      </div>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'

const auth = useAuthStore()
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
const BOT  = 'http://localhost:3001'

type UIState = 'checking' | 'stopped' | 'starting' | 'connecting' | 'qr' | 'connected' | 'stopping' | 'error'

const uiState    = ref<UIState>('checking')
const qrDataUrl  = ref<string | null>(null)
const processPid = ref<string | null>(null)
const showLogs   = ref(false)
const logsContent = ref('')

let pollTimer: ReturnType<typeof setInterval> | null = null

const estadoColor = computed(() => {
  const map: Record<UIState, { bg: string; text: string; icon: string }> = {
    checking:   { bg: 'bg-default-100', text: 'text-default-400', icon: 'lucide:loader-circle' },
    stopped:    { bg: 'bg-red-100',     text: 'text-red-500',     icon: 'lucide:circle-off' },
    starting:   { bg: 'bg-amber-100',   text: 'text-amber-500',   icon: 'lucide:loader-circle' },
    connecting: { bg: 'bg-blue-100',    text: 'text-blue-500',    icon: 'lucide:loader-circle' },
    qr:         { bg: 'bg-amber-100',   text: 'text-amber-600',   icon: 'lucide:qr-code' },
    connected:  { bg: 'bg-green-100',   text: 'text-green-600',   icon: 'lucide:check-circle-2' },
    stopping:   { bg: 'bg-amber-100',   text: 'text-amber-500',   icon: 'lucide:loader-circle' },
    error:      { bg: 'bg-red-100',     text: 'text-red-500',     icon: 'lucide:alert-circle' },
  }
  return map[uiState.value]
})

const estadoLabel = computed(() => {
  const map: Record<UIState, string> = {
    checking: 'Verificando…', stopped: 'Detenido', starting: 'Iniciando…',
    connecting: 'Conectando…', qr: 'Esperando QR', connected: 'Conectado',
    stopping: 'Deteniendo…', error: 'Error',
  }
  return map[uiState.value]
})

const estadoDesc = computed(() => {
  const map: Record<UIState, string> = {
    checking:   'Consultando estado del proceso…',
    stopped:    'El bot no está corriendo. Presiona Iniciar para arrancarlo.',
    starting:   'Iniciando el proceso del bot, por favor espera…',
    connecting: 'El bot está corriendo y conectándose a WhatsApp…',
    qr:         'Escanea el código QR con tu WhatsApp para vincularlo.',
    connected:  'El bot está activo y procesando mensajes.',
    stopping:   'Deteniendo el proceso, por favor espera…',
    error:      'No se pudo comunicar con el servidor del bot.',
  }
  return map[uiState.value]
})

async function poll() {
  const cur = uiState.value
  if (cur === 'starting' || cur === 'stopping') return
  try {
    const resProceso = await auth.authFetch(`${API}/admin/citas/bot/process-status`)
    if (resProceso.ok) {
      const proc = await resProceso.json()
      processPid.value = proc.pid ?? null
    }

    let resWs: Response
    try {
      resWs = await fetch(`${BOT}/status`, { signal: AbortSignal.timeout(3000) })
    } catch {
      processPid.value = null
      qrDataUrl.value = null
      uiState.value = 'stopped'
      return
    }

    if (!resWs.ok) { uiState.value = 'connecting'; return }
    const ws = await resWs.json()
    if (ws.state === 'open') { uiState.value = 'connected'; qrDataUrl.value = null }
    else if (ws.hasQr) { if (cur !== 'qr') cargarQr(); uiState.value = 'qr' }
    else uiState.value = 'connecting'
  } catch { uiState.value = 'error' }
}

async function cargarQr() {
  try {
    const res = await fetch(`${BOT}/qr`)
    if (res.ok) { const d = await res.json(); qrDataUrl.value = d.qr }
  } catch {}
}

async function iniciar() {
  uiState.value = 'starting'
  try {
    await auth.authFetch(`${API}/admin/citas/bot/start`, { method: 'POST' })
    setTimeout(() => { uiState.value = 'connecting'; poll() }, 2000)
  } catch { uiState.value = 'stopped' }
}

async function detener() {
  uiState.value = 'stopping'
  try {
    await auth.authFetch(`${API}/admin/citas/bot/stop`, { method: 'POST' })
    qrDataUrl.value = null; uiState.value = 'stopped'
  } catch { uiState.value = 'connected' }
}

async function desconectarWhatsApp() {
  try {
    await fetch(`${BOT}/disconnect`, { method: 'POST' })
    qrDataUrl.value = null; uiState.value = 'connecting'
  } catch {}
}

async function toggleLogs() {
  showLogs.value = !showLogs.value
  if (showLogs.value) {
    try {
      const res = await auth.authFetch(`${API}/admin/citas/bot/logs`)
      if (res.ok) { const d = await res.json(); logsContent.value = d.logs }
    } catch {}
  }
}

onMounted(() => { poll(); pollTimer = setInterval(poll, 4000) })
onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
</script>
