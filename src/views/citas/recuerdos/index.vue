<template>
  <Vertical>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-default-900">Recuerdos</h1>
      <p class="text-sm text-default-500 mt-0.5">Los momentos que han guardado juntos.</p>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
      <div v-for="i in 6" :key="i" class="break-inside-avoid animate-pulse">
        <div class="bg-default-100 rounded-2xl" :style="{ height: (120 + i * 20) + 'px' }" />
      </div>
    </div>

    <!-- Masonry de recuerdos -->
    <div v-else-if="recuerdos.length" class="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
      <div
        v-for="r in recuerdos" :key="r.id"
        class="break-inside-avoid card overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
      >
        <div :class="r.bg" class="flex items-center justify-center text-6xl" :style="{ height: r.h + 'px' }">
          {{ r.emoji }}
        </div>
        <div class="p-4">
          <p class="text-sm font-semibold text-default-800">{{ r.cita }}</p>
          <p class="text-xs text-default-500 mt-1 line-clamp-2">{{ r.note }}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-[10px] text-default-400">{{ r.date }}</span>
            <div class="flex gap-0.5">
              <Icon v-for="s in 5" :key="s" icon="lucide:star" class="size-3"
                :class="s <= r.rating ? 'text-amber-400' : 'text-default-200'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card p-16 text-center text-default-400">
      <Icon icon="lucide:camera" class="size-12 mx-auto mb-3 text-default-200" />
      <p class="font-medium">Aún no hay recuerdos guardados</p>
      <p class="text-sm mt-1">Completa una cita para guardar tu primer recuerdo.</p>
      <router-link to="/citas" class="mt-4 inline-block text-sm text-rose-500 hover:underline font-medium">
        Ver catálogo de citas →
      </router-link>
    </div>
  </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Vertical from '@/layouts/vertical.vue'

const loading = ref(true)

const recuerdos = ref<{ id:number; cita:string; note:string; emoji:string; bg:string; date:string; rating:number; h:number }[]>([])

onMounted(async () => {
  await new Promise(r => setTimeout(r, 600))
  recuerdos.value = [
    { id:1, cita:'Cena en el Mercado Lanza', note:'¡La salteña que pedimos fue la mejor de nuestras vidas! Volvemos seguro.', emoji:'🍽️', bg:'bg-rose-50', date:'14 may 2026', rating:5, h:140 },
    { id:2, cita:'Mirador Killi Killi', note:'El atardecer con vista al Illimani nos dejó sin palabras. Momento mágico.', emoji:'🌄', bg:'bg-amber-50', date:'9 may 2026', rating:5, h:180 },
    { id:3, cita:'Teleférico línea roja', note:'Primera vez en teleférico para los dos. Reímos todo el camino.', emoji:'🚡', bg:'bg-sky-50', date:'3 may 2026', rating:4, h:140 },
    { id:4, cita:'Café colonial', note:'Un café tranquilo en el Casco Viejo, con vistas a la Plaza Murillo.', emoji:'☕', bg:'bg-orange-50', date:'28 abr 2026', rating:4, h:160 },
  ]
  loading.value = false
})
</script>

<style scoped>
.line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>
