<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Categorías</h1>
          <p class="text-sm text-default-500 mt-0.5">Gestiona las categorías de citas románticas.</p>
        </div>
        <button @click="abrirModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600
                 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-rose-200
                 hover:shadow-md active:scale-[0.98] self-start sm:self-auto">
          <Icon icon="lucide:plus" class="size-4" />
          Nueva categoría
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="sm:col-span-1 card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:tag" class="size-6 text-rose-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ categorias.length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Total categorías</p>
          </div>
        </div>
      </div>

      <AppLoader v-if="loading" />

      <template v-else>
        <div v-if="categorias.length" class="card overflow-hidden">

          <div class="p-4 border-b border-default-100 flex items-center gap-3">
            <div class="relative flex-1 max-w-xs">
              <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-default-400 pointer-events-none" />
              <input v-model="busqueda" type="text" placeholder="Buscar categoría…"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-default-200
                       focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20
                       bg-default-50 placeholder-default-400 transition-all" />
            </div>
            <span class="text-xs text-default-400 ml-auto">{{ filtradas.length }} resultado{{ filtradas.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default-100 bg-default-50/60">
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider w-16">#</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Nombre</th>
                  <th class="text-right px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-default-100">
                <tr v-for="cat in filtradas" :key="cat.id"
                  class="hover:bg-default-50/60 transition-colors group">
                  <td class="px-6 py-4 text-default-400 font-medium text-xs">{{ cat.id }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <Icon icon="lucide:tag" class="size-4 text-rose-500" />
                      </div>
                      <span class="font-medium text-default-900">{{ cat.nombre }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="abrirModal(cat)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               text-default-600 hover:bg-default-100 transition-colors">
                        <Icon icon="lucide:pencil" class="size-3.5" />
                        Editar
                      </button>
                      <button @click="confirmarEliminar(cat)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               text-red-500 hover:bg-red-50 transition-colors">
                        <Icon icon="lucide:trash-2" class="size-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="sm:hidden divide-y divide-default-100">
            <div v-for="cat in filtradas" :key="cat.id"
              class="flex items-center gap-3 px-4 py-3.5">
              <div class="size-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="lucide:tag" class="size-4 text-rose-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-default-900 text-sm truncate">{{ cat.nombre }}</p>
                <p class="text-xs text-default-400">#{{ cat.id }}</p>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <button @click="abrirModal(cat)"
                  class="size-8 flex items-center justify-center rounded-lg text-default-500 hover:bg-default-100 transition-colors">
                  <Icon icon="lucide:pencil" class="size-4" />
                </button>
                <button @click="confirmarEliminar(cat)"
                  class="size-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                  <Icon icon="lucide:trash-2" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="filtradas.length === 0" class="py-12 text-center text-default-400">
            <Icon icon="lucide:search-x" class="size-8 mx-auto mb-2 text-default-200" />
            <p class="text-sm">Sin resultados para "<span class="font-medium">{{ busqueda }}</span>"</p>
          </div>
        </div>

        <div v-else class="card p-16 text-center">
          <div class="size-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:tag" class="size-8 text-rose-400" />
          </div>
          <p class="font-semibold text-default-700">No hay categorías aún</p>
          <p class="text-sm text-default-400 mt-1">Crea la primera para empezar a organizar las citas.</p>
          <button @click="abrirModal()"
            class="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500
                   hover:bg-rose-600 text-white text-sm font-semibold transition-all">
            <Icon icon="lucide:plus" class="size-4" />
            Nueva categoría
          </button>
        </div>
      </template>

      <div v-if="errorGlobal" class="card p-5 flex items-center gap-3 border border-red-200 bg-red-50 rounded-2xl">
        <Icon icon="lucide:alert-circle" class="size-5 text-red-400 flex-shrink-0" />
        <p class="text-sm text-red-600 flex-1">{{ errorGlobal }}</p>
        <button @click="fetchCategorias" class="text-sm text-red-500 hover:underline font-medium">Reintentar</button>
      </div>

    </div>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="modal.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal" />
          <div class="relative bg-white dark:bg-gray-900 w-full sm:max-w-md
                      rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 space-y-5">

            <div class="sm:hidden w-10 h-1 rounded-full bg-default-200 mx-auto -mt-1 mb-2" />

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl flex items-center justify-center"
                  :class="modal.editando ? 'bg-blue-100' : 'bg-rose-100'">
                  <Icon :icon="modal.editando ? 'lucide:pencil' : 'lucide:plus'" class="size-4"
                    :class="modal.editando ? 'text-blue-500' : 'text-rose-500'" />
                </div>
                <h2 class="text-base font-bold text-default-900">
                  {{ modal.editando ? 'Editar categoría' : 'Nueva categoría' }}
                </h2>
              </div>
              <button @click="cerrarModal"
                class="size-8 flex items-center justify-center rounded-xl text-default-400
                       hover:bg-default-100 hover:text-default-600 transition-colors">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form @submit.prevent="guardar" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-default-700 mb-1.5">
                  Nombre <span class="text-rose-400">*</span>
                </label>
                <input v-model="modal.nombre" type="text" class="form-input w-full"
                  placeholder="Ej: Miradores y paisajes" required autofocus />
              </div>

              <transition name="fade">
                <div v-if="modal.error"
                  class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
                  {{ modal.error }}
                </div>
              </transition>

              <div class="flex gap-3 pt-1">
                <button type="submit" :disabled="modal.loading"
                  class="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all
                         disabled:opacity-60 flex items-center justify-center gap-2"
                  :class="modal.editando ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'">
                  <Icon v-if="modal.loading" icon="lucide:loader-circle" class="size-4 animate-spin" />
                  {{ modal.loading ? 'Guardando…' : modal.editando ? 'Guardar cambios' : 'Crear categoría' }}
                </button>
                <button type="button" @click="cerrarModal"
                  class="px-5 py-2.5 rounded-xl text-sm font-semibold text-default-600
                         border border-default-200 hover:bg-default-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="eliminar.open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="eliminar.open = false" />
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div class="size-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
              <Icon icon="lucide:trash-2" class="size-6 text-red-500" />
            </div>
            <div>
              <h2 class="text-base font-bold text-default-900">¿Eliminar categoría?</h2>
              <p class="text-sm text-default-500 mt-1.5">
                Se eliminará <span class="font-semibold text-default-800">{{ eliminar.categoria?.nombre }}</span>.
                Esta acción no se puede deshacer.
              </p>
            </div>
            <transition name="fade">
              <div v-if="eliminar.error"
                class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
                <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
                {{ eliminar.error }}
              </div>
            </transition>
            <div class="flex gap-3">
              <button @click="eliminar.open = false"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-default-600
                       border border-default-200 hover:bg-default-50 transition-colors">
                Cancelar
              </button>
              <button @click="ejecutarEliminar" :disabled="eliminar.loading"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500
                       hover:bg-red-600 transition-colors disabled:opacity-60
                       flex items-center justify-center gap-2">
                <Icon v-if="eliminar.loading" icon="lucide:loader-circle" class="size-4 animate-spin" />
                {{ eliminar.loading ? 'Eliminando…' : 'Sí, eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import Vertical from '@/layouts/vertical.vue'
import AppLoader from '@/components/AppLoader.vue'

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

interface Categoria { id: number; nombre: string }

const loading     = ref(true)
const errorGlobal = ref('')
const categorias  = ref<Categoria[]>([])
const busqueda    = ref('')

const filtradas = computed(() =>
  busqueda.value.trim()
    ? categorias.value.filter(c => c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
    : categorias.value
)

const modal = reactive({
  open: false, editando: false,
  id: null as number | null,
  nombre: '', loading: false, error: '',
})

const eliminar = reactive({
  open: false,
  categoria: null as Categoria | null,
  loading: false, error: '',
})

async function fetchCategorias() {
  loading.value = true
  errorGlobal.value = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/categorias`)
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    categorias.value = data.categorias ?? []
  } catch {
    errorGlobal.value = 'No se pudieron cargar las categorías.'
  } finally {
    loading.value = false
  }
}

function abrirModal(cat?: Categoria) {
  Object.assign(modal, {
    open: true, editando: !!cat,
    id: cat?.id ?? null, nombre: cat?.nombre ?? '',
    loading: false, error: '',
  })
}
function cerrarModal() { modal.open = false }

async function guardar() {
  if (!modal.nombre.trim()) { modal.error = 'El nombre es obligatorio.'; return }
  modal.loading = true; modal.error = ''
  try {
    const url    = modal.editando ? `${API}/admin/citas/categorias/${modal.id}` : `${API}/admin/citas/categorias`
    const method = modal.editando ? 'PUT' : 'POST'
    const res    = await auth.authFetch(url, { method, body: JSON.stringify({ nombre: modal.nombre.trim() }) })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al guardar')
    await fetchCategorias()
    cerrarModal()
  } catch (e: unknown) {
    modal.error = e instanceof Error ? e.message : 'Error al guardar'
  } finally {
    modal.loading = false
  }
}

function confirmarEliminar(cat: Categoria) {
  Object.assign(eliminar, { open: true, categoria: cat, loading: false, error: '' })
}

async function ejecutarEliminar() {
  if (!eliminar.categoria) return
  eliminar.loading = true; eliminar.error = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/categorias/${eliminar.categoria.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al eliminar')
    await fetchCategorias()
    eliminar.open = false
  } catch (e: unknown) {
    eliminar.error = e instanceof Error ? e.message : 'Error al eliminar'
  } finally {
    eliminar.loading = false
  }
}

onMounted(async () => {
  await auth.fetchMe()
  await fetchCategorias()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
