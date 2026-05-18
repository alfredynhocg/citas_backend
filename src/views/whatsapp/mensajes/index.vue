<template>
  <Vertical>
    <div class="flex flex-col h-[calc(100vh-64px)]">

      <div class="flex items-center gap-4 px-5 py-4 border-b border-default-100 bg-white flex-shrink-0">
        <RouterLink to="/whatsapp/conversaciones"
          class="size-9 flex items-center justify-center rounded-xl text-default-500 hover:bg-default-100 transition-colors">
          <Icon icon="lucide:arrow-left" class="size-5" />
        </RouterLink>
        <div class="size-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:user" class="size-5 text-green-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-default-900 truncate">{{ nombre || phoneDisplay(phone) }}</p>
          <p class="text-xs text-default-400 truncate">{{ phoneDisplay(phone) }}</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            :class="esSoporte ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'">
            {{ esSoporte ? '🔴 Soporte humano' : '🤖 Bot activo' }}
          </span>
          <button v-if="esSoporte" @click="marcarAtendido" :disabled="atendiendo"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-semibold disabled:opacity-50 transition-colors">
            <Icon :icon="atendiendo ? 'lucide:loader-circle' : 'lucide:check'" class="size-3.5" :class="{ 'animate-spin': atendiendo }" />
            {{ atendiendo ? 'Procesando…' : 'Marcar atendido' }}
          </button>
        </div>
      </div>

      <div ref="mensajesContainer" class="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-default-50/40">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex animate-pulse" :class="i % 2 === 0 ? 'justify-end' : ''">
            <div class="h-10 rounded-2xl bg-default-200" :class="i % 2 === 0 ? 'w-48' : 'w-64'" />
          </div>
        </div>

        <template v-else>
          <div v-for="m in mensajes" :key="m.id"
            class="flex" :class="m.direccion === 'saliente' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm"
              :class="m.direccion === 'saliente'
                ? 'bg-green-500 text-white rounded-br-sm'
                : 'bg-white text-default-800 border border-default-100 rounded-bl-sm'">
              <div v-if="m.tipo === 'text' || m.tipo === 'interactive'">
                <p class="whitespace-pre-wrap break-words leading-relaxed">{{ m.contenido }}</p>
              </div>
              <div v-else-if="m.tipo === 'image'" class="flex items-center gap-2 text-xs opacity-80">
                <Icon icon="lucide:image" class="size-4" /><span>Imagen</span>
              </div>
              <div v-else-if="m.tipo === 'audio'" class="flex items-center gap-2 text-xs opacity-80">
                <Icon icon="lucide:mic" class="size-4" /><span>Audio</span>
              </div>
              <div v-else-if="m.tipo === 'document'" class="flex items-center gap-2 text-xs opacity-80">
                <Icon icon="lucide:file-text" class="size-4" /><span>Documento</span>
              </div>
              <div v-else-if="m.tipo === 'location'" class="flex items-center gap-2 text-xs opacity-80">
                <Icon icon="lucide:map-pin" class="size-4" /><span>Ubicación</span>
              </div>
              <div v-else class="flex items-center gap-2 text-xs opacity-80">
                <Icon icon="lucide:message-square" class="size-4" /><span>{{ tipoLabel(m.tipo) }}</span>
              </div>
              <p class="text-right mt-1 text-[10px] opacity-60">
                {{ m.created_at ? new Date(m.created_at).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) : '' }}
              </p>
            </div>
          </div>
          <div v-if="!mensajes.length" class="text-center text-default-400 py-12">
            <Icon icon="lucide:message-square-off" class="size-10 mx-auto mb-2 text-default-200" />
            <p class="text-sm">Sin mensajes aún</p>
          </div>
        </template>
      </div>

      <div v-if="archivoAdjunto" class="flex items-center gap-3 px-5 py-2 bg-amber-50 border-t border-amber-200">
        <Icon icon="lucide:paperclip" class="size-4 text-amber-600 flex-shrink-0" />
        <p class="text-xs text-amber-700 flex-1 truncate">{{ archivoAdjunto.name }}</p>
        <input v-if="tipoAdjunto === 'image'" v-model="captionAdjunto" placeholder="Caption (opcional)" class="form-input text-xs py-1 w-40" />
        <button @click="limpiarAdjunto" class="text-amber-600 hover:text-amber-800">
          <Icon icon="lucide:x" class="size-4" />
        </button>
      </div>

      <div class="px-5 py-4 border-t border-default-100 bg-white flex-shrink-0 flex gap-3 items-end">
        <label class="size-9 flex items-center justify-center rounded-xl border border-default-200 text-default-500 hover:bg-default-50 cursor-pointer flex-shrink-0 transition-colors">
          <Icon icon="lucide:paperclip" class="size-4" />
          <input type="file" accept="image/*,application/pdf" class="hidden" @change="onArchivoSeleccionado" />
        </label>
        <textarea v-model="textoNuevo" rows="1"
          placeholder="Escribe un mensaje… (Enter para enviar, Shift+Enter para salto de línea)"
          class="flex-1 form-input text-sm resize-none py-2"
          style="min-height:38px; max-height:120px; overflow-y:auto;"
          @keydown.enter.exact.prevent="enviar" />
        <button @click="enviar" :disabled="enviando"
          class="size-9 flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 transition-colors flex-shrink-0">
          <Icon :icon="enviando ? 'lucide:loader-circle' : 'lucide:send'" class="size-4" :class="{ 'animate-spin': enviando }" />
        </button>
      </div>

    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink, useRoute } from 'vue-router'
import Vertical from '@/layouts/vertical.vue'

const route = useRoute()
const BOT   = 'http://localhost:3001'

interface Mensaje { id: number; direccion: 'entrante' | 'saliente'; tipo: string; contenido: string | null; created_at: string }

const mensajes    = ref<Mensaje[]>([])
const loading     = ref(true)
const enviando    = ref(false)
const atendiendo  = ref(false)
const phoneParam  = decodeURIComponent(route.params.phone as string)
const phone       = ref(phoneParam)
const nombre      = ref('')
const estado      = ref('')
const textoNuevo  = ref('')
const archivoAdjunto = ref<File | null>(null)
const captionAdjunto = ref('')
const tipoAdjunto    = ref<'image' | 'document'>('image')
const mensajesContainer = ref<HTMLElement | null>(null)

const esSoporte = computed(() => estado.value === 'soporte')

import { computed } from 'vue'

async function cargar(silencioso = false) {
  if (!silencioso) loading.value = true
  try {
    const res = await fetch(`${BOT}/conversaciones/${encodeURIComponent(phoneParam)}/mensajes`)
    if (res.ok) {
      const d = await res.json()
      const antes = mensajes.value.length
      mensajes.value = d.data ?? []
      phone.value  = d.phone ?? ''
      nombre.value = d.nombre ?? ''
      estado.value = d.estado ?? ''
      if (!silencioso || d.data.length !== antes) await nextTick().then(scrollAlFinal)
    }
  } finally { if (!silencioso) loading.value = false }
}

function scrollAlFinal() {
  if (mensajesContainer.value) mensajesContainer.value.scrollTop = mensajesContainer.value.scrollHeight
}

async function marcarAtendido() {
  atendiendo.value = true
  try {
    await fetch(`${BOT}/conversaciones/${encodeURIComponent(phoneParam)}/atendido`, { method: 'POST' })
    estado.value = 'menu'
  } finally { atendiendo.value = false }
}

function onArchivoSeleccionado(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] ?? null
  archivoAdjunto.value = f
  if (f) tipoAdjunto.value = f.type === 'application/pdf' ? 'document' : 'image'
}
function limpiarAdjunto() { archivoAdjunto.value = null; captionAdjunto.value = '' }

async function enviar() {
  if (!phone.value) return
  enviando.value = true
  try {
    if (archivoAdjunto.value) {
      const fd = new FormData()
      fd.append('phones', phone.value)
      fd.append('tipo', tipoAdjunto.value)
      fd.append('archivo', archivoAdjunto.value, archivoAdjunto.value.name)
      if (captionAdjunto.value) fd.append('caption', captionAdjunto.value)
      await fetch(`${BOT}/enviar-media`, { method: 'POST', body: fd })
      limpiarAdjunto()
    } else {
      const texto = textoNuevo.value.trim()
      if (!texto) return
      await fetch(`${BOT}/enviar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.value, mensaje: texto }),
      })
      textoNuevo.value = ''
    }
    await cargar(true)
  } finally { enviando.value = false }
}

function phoneDisplay(p: string) { return p.split('@')[0] }
function tipoLabel(tipo: string) {
  const map: Record<string, string> = {
    text: 'Texto', interactive: 'Interactivo', image: 'Imagen',
    audio: 'Audio', video: 'Video', document: 'Documento', location: 'Ubicación',
  }
  return map[tipo] ?? tipo
}

let intervalo: ReturnType<typeof setInterval> | null = null
onMounted(() => { cargar(); intervalo = setInterval(() => cargar(true), 5000) })
onUnmounted(() => { if (intervalo) clearInterval(intervalo) })
</script>
