<template>
  <Vertical>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-default-900">Parejas</h1>
      <p class="text-sm text-default-500 mt-0.5">Gestiona las parejas registradas en la app.</p>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="card p-6 animate-pulse space-y-4">
        <div class="flex items-center gap-3">
          <div class="size-12 rounded-full bg-default-100" />
          <div class="space-y-2 flex-1">
            <div class="h-3 bg-default-100 rounded w-3/4" />
            <div class="h-2 bg-default-100 rounded w-1/2" />
          </div>
        </div>
        <div class="h-2 bg-default-100 rounded" />
        <div class="h-2 bg-default-100 rounded w-4/5" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="pareja in parejas" :key="pareja.id" class="card p-6 hover:shadow-lg transition-shadow space-y-4">
        <!-- Avatares -->
        <div class="flex items-center gap-3">
          <div class="flex -space-x-3">
            <div class="size-11 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-sm">
              {{ initials(pareja.userA) }}
            </div>
            <div class="size-11 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center text-violet-600 font-bold text-sm">
              {{ initials(pareja.userB) }}
            </div>
          </div>
          <div>
            <p class="font-semibold text-default-900 text-sm">{{ pareja.name }}</p>
            <p class="text-xs text-default-400">Desde {{ pareja.since }}</p>
          </div>
          <Icon icon="lucide:heart" class="size-5 text-rose-400 ml-auto" />
        </div>

        <!-- Progreso -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-xs text-default-500">
            <span>Progreso</span>
            <span class="font-medium text-default-700">{{ pareja.completed }}/100</span>
          </div>
          <div class="h-2 rounded-full bg-default-100 overflow-hidden">
            <div class="h-full bg-rose-500 rounded-full transition-all duration-700"
              :style="{ width: pareja.completed + '%' }" />
          </div>
        </div>

        <!-- Stats inline -->
        <div class="flex gap-4 text-center pt-2 border-t border-default-100">
          <div class="flex-1">
            <p class="text-lg font-bold text-default-900">{{ pareja.completed }}</p>
            <p class="text-[10px] text-default-400 uppercase tracking-wide">Citas</p>
          </div>
          <div class="flex-1">
            <p class="text-lg font-bold text-default-900">{{ pareja.memories }}</p>
            <p class="text-[10px] text-default-400 uppercase tracking-wide">Recuerdos</p>
          </div>
          <div class="flex-1">
            <p class="text-lg font-bold text-default-900">{{ pareja.rating }}<span class="text-amber-400">★</span></p>
            <p class="text-[10px] text-default-400 uppercase tracking-wide">Rating</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Vertical from '@/layouts/vertical.vue'

const loading = ref(true)
const parejas = ref<{ id:number; name:string; userA:string; userB:string; since:string; completed:number; memories:number; rating:number }[]>([])

onMounted(async () => {
  await new Promise(r => setTimeout(r, 700))
  parejas.value = [
    { id:1, name:'Los Amantes del Illimani', userA:'Carlos M.', userB:'Sofía R.', since:'Ene 2025', completed:23, memories:8, rating:4.8 },
    { id:2, name:'Aventureros Paceños', userA:'Diego L.', userB:'Valentina C.', since:'Mar 2025', completed:11, memories:3, rating:4.5 },
  ]
  loading.value = false
})

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>
