<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Negocios</h1>
          <p class="text-sm text-default-500 mt-0.5">Gestiona los negocios asociados a las citas románticas.</p>
        </div>
        <button @click="abrirModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600
                 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-rose-200
                 hover:shadow-md active:scale-[0.98] self-start sm:self-auto">
          <Icon icon="lucide:plus" class="size-4" />
          Nuevo negocio
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:store" class="size-6 text-rose-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ negocios.length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Total negocios</p>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:check-circle" class="size-6 text-green-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ negocios.filter(n => n.activo).length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Activos</p>
          </div>
        </div>
      </div>

      <AppLoader v-if="loading" />

      <template v-else>
        <div v-if="negocios.length" class="card overflow-hidden">

          <div class="p-4 border-b border-default-100 flex flex-wrap items-center gap-3">
            <div class="relative flex-1 min-w-[200px] max-w-xs">
              <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-default-400 pointer-events-none" />
              <input v-model="busqueda" type="text" placeholder="Buscar negocio…"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-default-200
                       focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20
                       bg-default-50 placeholder-default-400 transition-all" />
            </div>
            <span class="text-xs text-default-400 ml-auto">{{ filtrados.length }} resultado{{ filtrados.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default-100 bg-default-50/60">
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">#</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Negocio</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Categoría</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Departamento</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Estado</th>
                  <th class="text-right px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-default-100">
                <tr v-for="n in filtrados" :key="n.id" class="hover:bg-default-50/60 transition-colors group">
                  <td class="px-6 py-4 text-default-400 font-medium text-xs">{{ n.id }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-9 rounded-xl overflow-hidden bg-default-100 flex-shrink-0 flex items-center justify-center">
                        <img v-if="n.logo_url" :src="n.logo_url" class="size-full object-cover"
                          @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                        <Icon v-else icon="lucide:store" class="size-4 text-default-400" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-default-900 truncate">{{ n.nombre }}</p>
                        <p class="text-xs text-default-400 truncate">{{ n.direccion ?? '—' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-default-600 text-xs capitalize">{{ n.categoria_negocio ?? '—' }}</td>
                  <td class="px-6 py-4 text-default-600 text-xs">{{ n.departamento_nombre ?? '—' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      :class="n.activo ? 'bg-green-100 text-green-700' : 'bg-default-100 text-default-500'">
                      <span class="size-1.5 rounded-full" :class="n.activo ? 'bg-green-500' : 'bg-default-400'" />
                      {{ n.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="abrirModal(n)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               text-default-600 hover:bg-default-100 transition-colors">
                        <Icon icon="lucide:pencil" class="size-3.5" />Editar
                      </button>
                      <button @click="confirmarEliminar(n)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               text-red-500 hover:bg-red-50 transition-colors">
                        <Icon icon="lucide:trash-2" class="size-3.5" />Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="sm:hidden divide-y divide-default-100">
            <div v-for="n in filtrados" :key="n.id" class="flex items-center gap-3 px-4 py-3.5">
              <div class="size-10 rounded-xl overflow-hidden bg-default-100 flex-shrink-0 flex items-center justify-center">
                <img v-if="n.logo_url" :src="n.logo_url" class="size-full object-cover"
                  @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                <Icon v-else icon="lucide:store" class="size-4 text-default-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-default-900 text-sm truncate">{{ n.nombre }}</p>
                <p class="text-xs text-default-400 truncate">{{ n.categoria_negocio ?? '—' }} · {{ n.departamento_nombre ?? '—' }}</p>
              </div>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                :class="n.activo ? 'bg-green-100 text-green-700' : 'bg-default-100 text-default-500'">
                {{ n.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <div class="flex gap-1 flex-shrink-0">
                <button @click="abrirModal(n)"
                  class="size-8 flex items-center justify-center rounded-lg text-default-500 hover:bg-default-100 transition-colors">
                  <Icon icon="lucide:pencil" class="size-4" />
                </button>
                <button @click="confirmarEliminar(n)"
                  class="size-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                  <Icon icon="lucide:trash-2" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="filtrados.length === 0" class="py-12 text-center text-default-400">
            <Icon icon="lucide:search-x" class="size-8 mx-auto mb-2 text-default-200" />
            <p class="text-sm">Sin resultados para "<span class="font-medium">{{ busqueda }}</span>"</p>
          </div>
        </div>

        <div v-else class="card p-16 text-center">
          <div class="size-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:store" class="size-8 text-rose-400" />
          </div>
          <p class="font-semibold text-default-700">No hay negocios registrados</p>
          <p class="text-sm text-default-400 mt-1">Agrega el primer negocio para asociarlo a las citas.</p>
          <button @click="abrirModal()"
            class="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500
                   hover:bg-rose-600 text-white text-sm font-semibold transition-all">
            <Icon icon="lucide:plus" class="size-4" />Nuevo negocio
          </button>
        </div>
      </template>

      <div v-if="errorGlobal" class="card p-5 flex items-center gap-3 border border-red-200 bg-red-50 rounded-2xl">
        <Icon icon="lucide:alert-circle" class="size-5 text-red-400 flex-shrink-0" />
        <p class="text-sm text-red-600 flex-1">{{ errorGlobal }}</p>
        <button @click="fetchNegocios" class="text-sm text-red-500 hover:underline font-medium">Reintentar</button>
      </div>

    </div>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="modal.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal" />
          <div class="relative bg-white dark:bg-gray-900 w-full sm:max-w-lg
                      rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            <div class="sm:hidden w-10 h-1 rounded-full bg-default-200 mx-auto mt-3" />

            <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-default-100 flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl flex items-center justify-center"
                  :class="modal.editando ? 'bg-blue-100' : 'bg-rose-100'">
                  <Icon :icon="modal.editando ? 'lucide:pencil' : 'lucide:plus'" class="size-4"
                    :class="modal.editando ? 'text-blue-500' : 'text-rose-500'" />
                </div>
                <h2 class="text-base font-bold text-default-900">
                  {{ modal.editando ? 'Editar negocio' : 'Nuevo negocio' }}
                </h2>
              </div>
              <button @click="cerrarModal"
                class="size-8 flex items-center justify-center rounded-xl text-default-400
                       hover:bg-default-100 hover:text-default-600 transition-colors">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form @submit.prevent="guardar" class="overflow-y-auto flex-1 px-6 py-5 space-y-4">

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Nombre <span class="text-rose-400">*</span>
                  </label>
                  <input v-model="modal.form.nombre" type="text" class="form-input w-full"
                    placeholder="Ej: Café de Altura" required />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Dirección</label>
                  <input v-model="modal.form.direccion" type="text" class="form-input w-full"
                    placeholder="Ej: Av. 6 de Agosto N° 123, Sopocachi" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Teléfono</label>
                  <input v-model="modal.form.telefono" type="text" class="form-input w-full"
                    placeholder="Ej: 77777777" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Categoría del negocio</label>
                  <select v-model="modal.form.categoria_negocio" class="form-input w-full">
                    <option value="">— Selecciona —</option>
                    <option v-for="cat in CATEGORIAS_NEGOCIO" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Departamento</label>
                  <select v-model="modal.form.departamento_id" class="form-input w-full">
                    <option :value="null">— Selecciona —</option>
                    <option v-for="d in departamentos" :key="d.id" :value="d.id">{{ d.nombre }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Latitud</label>
                  <input v-model.number="modal.form.latitud" type="number" step="any"
                    class="form-input w-full" placeholder="-16.5133" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Longitud</label>
                  <input v-model.number="modal.form.longitud" type="number" step="any"
                    class="form-input w-full" placeholder="-68.1225" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Logo del negocio</label>
                  <div class="flex items-center gap-4">
                    <div class="size-16 rounded-2xl border-2 border-dashed border-default-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-default-50">
                      <img v-if="modal.form.logo_url" :src="logoPreview || modal.form.logo_url"
                        class="size-full object-cover"
                        @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                      <Icon v-else icon="lucide:image" class="size-6 text-default-300" />
                    </div>
                    <div class="flex-1 space-y-2">
                      <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl
                                    border border-default-200 hover:bg-default-50 transition-colors text-sm font-medium text-default-600">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span>{{ uploadingLogo ? 'Subiendo…' : 'Subir imagen' }}</span>
                        <input type="file" accept="image/*" class="hidden" @change="subirLogo" :disabled="uploadingLogo" />
                      </label>
                      <p v-if="uploadError" class="text-xs text-red-500">{{ uploadError }}</p>
                      <p v-else class="text-xs text-default-400">PNG, JPG, WEBP · Máx. 5 MB</p>
                    </div>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label class="flex items-center gap-3 cursor-pointer select-none">
                    <div class="relative">
                      <input type="checkbox" v-model="modal.form.activo" class="sr-only" />
                      <div class="w-10 h-6 rounded-full transition-colors"
                        :class="modal.form.activo ? 'bg-rose-500' : 'bg-default-200'">
                        <div class="size-4 bg-white rounded-full shadow absolute top-1 transition-all"
                          :class="modal.form.activo ? 'left-5' : 'left-1'" />
                      </div>
                    </div>
                    <span class="text-sm font-medium text-default-700">Negocio activo</span>
                  </label>
                </div>
              </div>

              <transition name="fade">
                <div v-if="modal.error"
                  class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
                  {{ modal.error }}
                </div>
              </transition>

            </form>

            <div class="px-6 py-4 border-t border-default-100 flex gap-3 flex-shrink-0">
              <button type="button" @click="guardar" :disabled="modal.loading"
                class="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all
                       disabled:opacity-60 flex items-center justify-center gap-2"
                :class="modal.editando ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'">
                <Icon v-if="modal.loading" icon="lucide:loader-circle" class="size-4 animate-spin" />
                {{ modal.loading ? 'Guardando…' : modal.editando ? 'Guardar cambios' : 'Crear negocio' }}
              </button>
              <button type="button" @click="cerrarModal"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-default-600
                       border border-default-200 hover:bg-default-50 transition-colors">
                Cancelar
              </button>
            </div>
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
              <h2 class="text-base font-bold text-default-900">¿Eliminar negocio?</h2>
              <p class="text-sm text-default-500 mt-1.5">
                Se eliminará <span class="font-semibold text-default-800">{{ eliminar.negocio?.nombre }}</span>.
                Esta acción no se puede deshacer.
              </p>
            </div>
            <transition name="fade">
              <div v-if="eliminar.error"
                class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
                <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />{{ eliminar.error }}
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
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

const CATEGORIAS_NEGOCIO = [
  { value: 'cafeteria',    label: 'Cafetería' },
  { value: 'restaurante',  label: 'Restaurante' },
  { value: 'bar',          label: 'Bar / Pub' },
  { value: 'mirador',      label: 'Mirador' },
  { value: 'museo',        label: 'Museo / Cultura' },
  { value: 'hotel',        label: 'Hotel / Hospedaje' },
  { value: 'parque',       label: 'Parque / Naturaleza' },
  { value: 'teatro',       label: 'Teatro / Arte' },
  { value: 'spa',          label: 'Spa / Bienestar' },
  { value: 'otro',         label: 'Otro' },
]

interface Negocio {
  id: number; nombre: string; direccion: string | null
  latitud: number | null; longitud: number | null
  departamento_id: number | null; departamento_nombre: string | null
  telefono: string | null; categoria_negocio: string | null
  logo_url: string | null; activo: boolean; total_citas: number
}
interface Departamento { id: number; nombre: string }

const loading       = ref(true)
const errorGlobal   = ref('')
const negocios      = ref<Negocio[]>([])
const departamentos = ref<Departamento[]>([])
const busqueda      = ref('')
const uploadingLogo = ref(false)
const uploadError   = ref('')
const logoPreview   = ref('')

const filtrados = computed(() =>
  busqueda.value.trim()
    ? negocios.value.filter(n => n.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
    : negocios.value
)

const formVacio = () => ({
  nombre: '', direccion: '', telefono: '',
  categoria_negocio: '', departamento_id: null as number | null,
  latitud: null as number | null, longitud: null as number | null,
  logo_url: '', activo: true,
})

const modal = reactive({
  open: false, editando: false,
  id: null as number | null,
  form: formVacio(),
  loading: false, error: '',
})

const eliminar = reactive({
  open: false, negocio: null as Negocio | null,
  loading: false, error: '',
})

async function fetchNegocios() {
  loading.value = true; errorGlobal.value = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/negocios`)
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    negocios.value = data.negocios ?? []
  } catch {
    errorGlobal.value = 'No se pudieron cargar los negocios.'
  } finally {
    loading.value = false
  }
}

async function fetchDepartamentos() {
  try {
    const r2 = await fetch(`${API}/usuarios/departamentos-disponibles`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    })
    if (r2.ok) {
      const d = await r2.json()
      departamentos.value = [...(d.departamentos_gratis ?? []), ...(d.departamentos_premium ?? [])]
    }
  } catch {}
}

async function subirLogo(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingLogo.value = true
  uploadError.value = ''
  logoPreview.value = URL.createObjectURL(file)
  try {
    const fd = new FormData()
    fd.append('imagen', file)
    const res = await auth.authFetch(`${API}/admin/citas/upload-imagen`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al subir imagen')
    const data = await res.json()
    modal.form.logo_url = `http://localhost:5000${data.url}`
  } catch (err: unknown) {
    uploadError.value = err instanceof Error ? err.message : 'Error al subir imagen'
    logoPreview.value = ''
  } finally {
    uploadingLogo.value = false
    input.value = ''
  }
}

function abrirModal(neg?: Negocio) {
  logoPreview.value = ''
  uploadError.value = ''
  Object.assign(modal, {
    open: true, editando: !!neg,
    id: neg?.id ?? null,
    loading: false, error: '',
    form: neg ? {
      nombre: neg.nombre ?? '',
      direccion: neg.direccion ?? '',
      telefono: neg.telefono ?? '',
      categoria_negocio: neg.categoria_negocio ?? '',
      departamento_id: neg.departamento_id ?? null,
      latitud: neg.latitud ?? null,
      longitud: neg.longitud ?? null,
      logo_url: neg.logo_url ?? '',
      activo: neg.activo ?? true,
    } : formVacio(),
  })
}
function cerrarModal() { modal.open = false; logoPreview.value = ''; uploadError.value = '' }

async function guardar() {
  if (!modal.form.nombre.trim()) { modal.error = 'El nombre es obligatorio.'; return }
  modal.loading = true; modal.error = ''
  try {
    const url    = modal.editando ? `${API}/admin/citas/negocios/${modal.id}` : `${API}/admin/citas/negocios`
    const method = modal.editando ? 'PUT' : 'POST'
    const body   = {
      nombre:            modal.form.nombre.trim(),
      direccion:         modal.form.direccion || null,
      telefono:          modal.form.telefono  || null,
      categoria_negocio: modal.form.categoria_negocio || null,
      departamento_id:   modal.form.departamento_id,
      latitud:           modal.form.latitud,
      longitud:          modal.form.longitud,
      logo_url:          modal.form.logo_url || null,
      activo:            modal.form.activo,
    }
    const res = await auth.authFetch(url, { method, body: JSON.stringify(body) })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al guardar')
    await fetchNegocios()
    cerrarModal()
  } catch (e: unknown) {
    modal.error = e instanceof Error ? e.message : 'Error al guardar'
  } finally {
    modal.loading = false
  }
}

function confirmarEliminar(neg: Negocio) {
  Object.assign(eliminar, { open: true, negocio: neg, loading: false, error: '' })
}

async function ejecutarEliminar() {
  if (!eliminar.negocio) return
  eliminar.loading = true; eliminar.error = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/negocios/${eliminar.negocio.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al eliminar')
    await fetchNegocios()
    eliminar.open = false
  } catch (e: unknown) {
    eliminar.error = e instanceof Error ? e.message : 'Error al eliminar'
  } finally {
    eliminar.loading = false
  }
}

onMounted(async () => {
  await auth.fetchMe()
  await Promise.all([fetchNegocios(), fetchDepartamentos()])
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
