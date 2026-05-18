<template>
  <Vertical>
    <div class="p-4 sm:p-6 space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-default-900">Citas</h1>
          <p class="text-sm text-default-500 mt-0.5">Gestiona las 100 citas románticas del catálogo.</p>
        </div>
        <button @click="abrirModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600
                 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-rose-200
                 hover:shadow-md active:scale-[0.98] self-start sm:self-auto">
          <Icon icon="lucide:plus" class="size-4" />
          Nueva cita
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:heart" class="size-6 text-rose-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ citas.length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Total citas</p>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:check-circle" class="size-6 text-green-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ citas.filter(c => c.activo).length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Activas</p>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:tag" class="size-6 text-violet-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ categorias.length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Categorías</p>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <div class="size-12 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="lucide:map-pin" class="size-6 text-sky-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-default-900">{{ departamentos.length }}</p>
            <p class="text-xs text-default-400 mt-0.5">Departamentos</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="card overflow-hidden">
        <div class="divide-y divide-default-100">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div class="size-12 rounded-xl bg-default-100 flex-shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-default-100 rounded w-1/3" />
              <div class="h-3 bg-default-100 rounded w-1/2" />
            </div>
            <div class="h-6 w-16 bg-default-100 rounded-full" />
            <div class="flex gap-2">
              <div class="h-8 w-16 bg-default-100 rounded-lg" />
              <div class="h-8 w-16 bg-default-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <div v-if="citas.length" class="card overflow-hidden">
          <div class="p-4 border-b border-default-100 flex flex-wrap items-center gap-3">
            <div class="relative flex-1 min-w-[200px] max-w-xs">
              <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-default-400 pointer-events-none" />
              <input v-model="busqueda" type="text" placeholder="Buscar cita…"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-default-200
                       focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20
                       bg-default-50 placeholder-default-400 transition-all" />
            </div>
            <select v-model="filtroCat"
              class="text-sm rounded-xl border border-default-200 bg-default-50 px-3 py-2 focus:outline-none focus:border-rose-400">
              <option value="">Todas las categorías</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
            <span class="text-xs text-default-400 ml-auto">{{ filtradas.length }} resultado{{ filtradas.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default-100 bg-default-50/60">
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">#</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Cita</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Categoría</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Puntos</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Estado</th>
                  <th class="text-right px-6 py-3 text-xs font-semibold text-default-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-default-100">
                <tr v-for="c in filtradas" :key="c.id" class="hover:bg-default-50/60 transition-colors group">
                  <td class="px-6 py-4 text-default-400 font-medium text-xs">{{ c.id }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-10 rounded-xl overflow-hidden bg-default-100 flex-shrink-0 flex items-center justify-center">
                        <img v-if="c.portada_url" :src="c.portada_url" class="size-full object-cover"
                          @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                        <Icon v-else icon="lucide:heart" class="size-4 text-rose-300" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-default-900 truncate max-w-[200px]">{{ c.nombre }}</p>
                        <p class="text-xs text-default-400 truncate max-w-[200px]">{{ c.negocio_nombre ?? c.departamento_nombre ?? '—' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-default-600 text-xs">{{ c.categoria_nombre ?? '—' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Icon icon="lucide:star" class="size-3" /> {{ c.puntos }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      :class="c.activo ? 'bg-green-100 text-green-700' : 'bg-default-100 text-default-500'">
                      <span class="size-1.5 rounded-full" :class="c.activo ? 'bg-green-500' : 'bg-default-400'" />
                      {{ c.activo ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="abrirModal(c)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-default-600 hover:bg-default-100 transition-colors">
                        <Icon icon="lucide:pencil" class="size-3.5" />Editar
                      </button>
                      <button @click="confirmarEliminar(c)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <Icon icon="lucide:trash-2" class="size-3.5" />Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="sm:hidden divide-y divide-default-100">
            <div v-for="c in filtradas" :key="c.id" class="flex items-center gap-3 px-4 py-3.5">
              <div class="size-10 rounded-xl overflow-hidden bg-default-100 flex-shrink-0 flex items-center justify-center">
                <img v-if="c.portada_url" :src="c.portada_url" class="size-full object-cover"
                  @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                <Icon v-else icon="lucide:heart" class="size-4 text-rose-300" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-default-900 text-sm truncate">{{ c.nombre }}</p>
                <p class="text-xs text-default-400 truncate">{{ c.categoria_nombre ?? '—' }}</p>
              </div>
              <div class="flex gap-1 flex-shrink-0">
                <button @click="abrirModal(c)"
                  class="size-8 flex items-center justify-center rounded-lg text-default-500 hover:bg-default-100 transition-colors">
                  <Icon icon="lucide:pencil" class="size-4" />
                </button>
                <button @click="confirmarEliminar(c)"
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
            <Icon icon="lucide:heart" class="size-8 text-rose-400" />
          </div>
          <p class="font-semibold text-default-700">No hay citas registradas</p>
          <p class="text-sm text-default-400 mt-1">Crea la primera cita del catálogo romántico.</p>
          <button @click="abrirModal()"
            class="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-all">
            <Icon icon="lucide:plus" class="size-4" />Nueva cita
          </button>
        </div>
      </template>

      <div v-if="errorGlobal" class="card p-5 flex items-center gap-3 border border-red-200 bg-red-50 rounded-2xl">
        <Icon icon="lucide:alert-circle" class="size-5 text-red-400 flex-shrink-0" />
        <p class="text-sm text-red-600 flex-1">{{ errorGlobal }}</p>
        <button @click="fetchCitas" class="text-sm text-red-500 hover:underline font-medium">Reintentar</button>
      </div>

    </div>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="modal.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal" />
          <div class="relative bg-white dark:bg-gray-900 w-full sm:max-w-xl
                      rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

            <div class="sm:hidden w-10 h-1 rounded-full bg-default-200 mx-auto mt-3" />

            <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-default-100 flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl flex items-center justify-center"
                  :class="modal.editando ? 'bg-blue-100' : 'bg-rose-100'">
                  <Icon :icon="modal.editando ? 'lucide:pencil' : 'lucide:plus'" class="size-4"
                    :class="modal.editando ? 'text-blue-500' : 'text-rose-500'" />
                </div>
                <h2 class="text-base font-bold text-default-900">
                  {{ modal.editando ? 'Editar cita' : 'Nueva cita' }}
                </h2>
              </div>
              <button @click="cerrarModal"
                class="size-8 flex items-center justify-center rounded-xl text-default-400 hover:bg-default-100 hover:text-default-600 transition-colors">
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
                    placeholder="Ej: Ver atardecer en Killi Killi" required />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Descripción</label>
                  <textarea v-model="modal.form.descripcion" rows="3" class="form-input w-full resize-none"
                    placeholder="Describe esta experiencia romántica…" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Categoría <span class="text-rose-400">*</span>
                  </label>
                  <select v-model="modal.form.categoria_id" class="form-input w-full" required>
                    <option :value="null">— Selecciona —</option>
                    <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">
                    Departamento <span class="text-rose-400">*</span>
                  </label>
                  <select v-model="modal.form.departamento_id" class="form-input w-full" required>
                    <option :value="null">— Selecciona —</option>
                    <option v-for="d in departamentos" :key="d.id" :value="d.id">{{ d.nombre }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Negocio</label>
                  <select v-model="modal.form.negocio_id" class="form-input w-full">
                    <option :value="null">— Ninguno —</option>
                    <option v-for="n in negocios" :key="n.id" :value="n.id">{{ n.nombre }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Puntos</label>
                  <div class="flex items-center gap-1 pt-1">
                    <button
                      v-for="star in 5" :key="star"
                      type="button"
                      @click="modal.form.puntos = star * 20"
                      @mouseenter="hoverStar = star"
                      @mouseleave="hoverStar = 0"
                      class="transition-transform active:scale-90">
                      <Icon
                        icon="lucide:star"
                        class="size-8 transition-colors"
                        :class="star <= (hoverStar || Math.round(modal.form.puntos / 20))
                          ? 'text-amber-400'
                          : 'text-default-200'" />
                    </button>
                    <span class="ml-2 text-sm font-semibold text-default-600">{{ modal.form.puntos }} pts</span>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Dirección</label>
                  <input v-model="modal.form.direccion" type="text" class="form-input w-full"
                    placeholder="Ej: Mirador Killi Killi, La Paz" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-2">Ubicación</label>

                  <div id="mapa-leaflet" class="rounded-2xl border border-default-200" style="height:220px;"></div>

                  <div class="flex gap-2 mt-2 flex-wrap items-end">
                    <div class="flex-1 min-w-[110px]">
                      <label class="block text-xs text-default-500 mb-1">Latitud</label>
                      <input v-model.number="modal.form.latitud" type="number" step="any"
                        class="form-input w-full text-sm" placeholder="-16.5005"
                        @change="moverMarcador" />
                    </div>
                    <div class="flex-1 min-w-[110px]">
                      <label class="block text-xs text-default-500 mb-1">Longitud</label>
                      <input v-model.number="modal.form.longitud" type="number" step="any"
                        class="form-input w-full text-sm" placeholder="-68.1338"
                        @change="moverMarcador" />
                    </div>
                    <button type="button" @click="usarMiUbicacion" :disabled="geoLoading"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600
                             border border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-50 whitespace-nowrap">
                      <Icon :icon="geoLoading ? 'lucide:loader-circle' : 'lucide:locate-fixed'"
                        class="size-3.5" :class="{ 'animate-spin': geoLoading }" />
                      {{ geoLoading ? 'Buscando…' : 'Mi ubicación' }}
                    </button>
                    <button type="button" @click="limpiarUbicacion"
                      class="px-3 py-2 rounded-xl text-xs font-medium text-default-500 border border-default-200 hover:bg-default-50 transition-colors whitespace-nowrap">
                      Limpiar
                    </button>
                  </div>
                  <p v-if="geoError" class="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <Icon icon="lucide:triangle-alert" class="size-3.5 flex-shrink-0" />{{ geoError }}
                  </p>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Imagen de portada</label>
                  <div class="flex items-center gap-4">
                    <div class="size-16 rounded-2xl border-2 border-dashed border-default-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-default-50">
                      <img v-if="modal.form.portada_url" :src="portadaPreview || modal.form.portada_url"
                        class="size-full object-cover"
                        @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                      <Icon v-else icon="lucide:image" class="size-6 text-default-300" />
                    </div>
                    <div class="flex-1 space-y-1.5">
                      <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl
                                    border border-default-200 hover:bg-default-50 transition-colors text-sm font-medium text-default-600">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span>{{ uploadingPortada ? 'Subiendo…' : 'Subir portada' }}</span>
                        <input type="file" accept="image/*" class="hidden" @change="subirPortada" :disabled="uploadingPortada" />
                      </label>
                      <p v-if="uploadErrorPortada" class="text-xs text-red-500">{{ uploadErrorPortada }}</p>
                      <p v-else class="text-xs text-default-400">PNG, JPG, WEBP · Máx. 5 MB</p>
                    </div>
                  </div>
                </div>

                <div v-if="!modal.editando" class="sm:col-span-2">
                  <label class="block text-sm font-medium text-default-700 mb-1.5">Fotos adicionales</label>
                  <label class="cursor-pointer flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-default-200 hover:border-rose-300 transition-colors">
                    <div class="size-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Icon icon="lucide:camera" class="size-5 text-rose-500" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-default-700">
                        {{ fotosSeleccionadas.length > 0 ? fotosSeleccionadas.length + ' foto(s) seleccionada(s)' : 'Seleccionar fotos' }}
                      </p>
                      <p class="text-xs text-default-400">Puedes subir varias fotos a la vez · Máx. 5 MB c/u</p>
                    </div>
                    <input type="file" accept="image/*" multiple class="hidden" @change="seleccionarFotos" />
                  </label>
                  <p v-if="fotosSizeError" class="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
                    <Icon icon="lucide:triangle-alert" class="size-3.5 flex-shrink-0" />{{ fotosSizeError }}
                  </p>
                  <div v-if="fotosSeleccionadas.length" class="flex gap-2 mt-2 flex-wrap">
                    <div v-for="(f, i) in fotosSeleccionadas" :key="i"
                      class="relative size-14 rounded-xl overflow-hidden border border-default-200 group/foto">
                      <img :src="f.preview" class="size-full object-cover" />
                      <button type="button" @click="quitarFoto(i)"
                        class="absolute inset-0 bg-black/50 opacity-0 group-hover/foto:opacity-100 flex items-center justify-center transition-opacity">
                        <Icon icon="lucide:x" class="size-3.5 text-white" />
                      </button>
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
                    <span class="text-sm font-medium text-default-700">Cita activa</span>
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
                {{ modal.loading ? 'Guardando…' : modal.editando ? 'Guardar cambios' : 'Crear cita' }}
              </button>
              <button type="button" @click="cerrarModal"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-default-600 border border-default-200 hover:bg-default-50 transition-colors">
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
              <h2 class="text-base font-bold text-default-900">¿Eliminar cita?</h2>
              <p class="text-sm text-default-500 mt-1.5">
                Se eliminará <span class="font-semibold text-default-800">{{ eliminar.cita?.nombre }}</span>.
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
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-default-600 border border-default-200 hover:bg-default-50 transition-colors">
                Cancelar
              </button>
              <button @click="ejecutarEliminar" :disabled="eliminar.loading"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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

const auth = useAuthStore()
const API  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

interface Cita {
  id: number; nombre: string; descripcion: string | null
  categoria_id: number | null; categoria_nombre: string | null
  departamento_id: number | null; departamento_nombre: string | null
  negocio_id: number | null; negocio_nombre: string | null
  direccion: string | null; latitud: number | null; longitud: number | null
  puntos: number; portada_url: string | null; activo: boolean
}
interface Ref { id: number; nombre: string }

const loading     = ref(true)
const errorGlobal = ref('')
const citas       = ref<Cita[]>([])
const categorias  = ref<Ref[]>([])
const departamentos = ref<Ref[]>([])
const negocios    = ref<Ref[]>([])
const busqueda    = ref('')
const filtroCat   = ref<number | ''>('')

const uploadingPortada   = ref(false)
const uploadErrorPortada = ref('')
const portadaPreview     = ref('')
const hoverStar          = ref(0)

const MAX_IMG_MB = 5
const MAX_IMG_BYTES = MAX_IMG_MB * 1024 * 1024

interface FotoPreview { file: File; preview: string }
const fotosSeleccionadas = ref<FotoPreview[]>([])


const geoLoading = ref(false)
const geoError   = ref('')

const LA_PAZ: [number, number] = [-16.5005, -68.1338]
let mapaInst:   any = null
let markerInst: any = null

async function iniciarMapa(lat: number | null, lng: number | null) {
  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  const el = document.getElementById('mapa-leaflet')
  if (!el) return
  if (mapaInst) { mapaInst.remove(); mapaInst = null; markerInst = null }

  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const centro: [number, number] = (lat !== null && lng !== null) ? [lat, lng] : LA_PAZ
  mapaInst = L.map(el).setView(centro, 14)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(mapaInst)

  if (lat !== null && lng !== null) {
    markerInst = L.marker([lat, lng], { draggable: true }).addTo(mapaInst)
    markerInst.on('dragend', () => {
      const p = markerInst.getLatLng()
      modal.form.latitud  = parseFloat(p.lat.toFixed(6))
      modal.form.longitud = parseFloat(p.lng.toFixed(6))
    })
  }

  mapaInst.on('click', (e: any) => {
    geoError.value = ''
    const { lat: la, lng: lo } = e.latlng
    modal.form.latitud  = parseFloat(la.toFixed(6))
    modal.form.longitud = parseFloat(lo.toFixed(6))
    if (markerInst) {
      markerInst.setLatLng([la, lo])
    } else {
      markerInst = L.marker([la, lo], { draggable: true }).addTo(mapaInst)
      markerInst.on('dragend', () => {
        const p = markerInst.getLatLng()
        modal.form.latitud  = parseFloat(p.lat.toFixed(6))
        modal.form.longitud = parseFloat(p.lng.toFixed(6))
      })
    }
  })
}

function moverMarcador() {
  const lat = modal.form.latitud
  const lng = modal.form.longitud
  if (lat === null || lng === null || !mapaInst) return
  const ll: [number, number] = [lat, lng]
  mapaInst.setView(ll, mapaInst.getZoom())
  if (markerInst) {
    markerInst.setLatLng(ll)
  } else {
    import('leaflet').then(({ default: L }) => {
      markerInst = L.marker(ll, { draggable: true }).addTo(mapaInst)
      markerInst.on('dragend', () => {
        const p = markerInst.getLatLng()
        modal.form.latitud  = parseFloat(p.lat.toFixed(6))
        modal.form.longitud = parseFloat(p.lng.toFixed(6))
      })
    })
  }
}

function usarMiUbicacion() {
  if (!navigator.geolocation) { geoError.value = 'Tu navegador no soporta geolocalización.'; return }
  geoLoading.value = true
  geoError.value   = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      geoLoading.value = false
      modal.form.latitud  = parseFloat(pos.coords.latitude.toFixed(6))
      modal.form.longitud = parseFloat(pos.coords.longitude.toFixed(6))
      moverMarcador()
    },
    () => {
      geoLoading.value = false
      geoError.value   = 'No se pudo obtener tu ubicación. Verifica los permisos del navegador.'
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

function limpiarUbicacion() {
  modal.form.latitud  = null
  modal.form.longitud = null
  if (markerInst && mapaInst) { mapaInst.removeLayer(markerInst); markerInst = null }
  mapaInst?.setView(LA_PAZ, 13)
}

const filtradas = computed(() => {
  let lista = filtroCat.value !== ''
    ? citas.value.filter(c => c.categoria_id === filtroCat.value)
    : citas.value
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(c => c.nombre.toLowerCase().includes(q))
  }
  return lista
})

const formVacio = () => ({
  nombre: '', descripcion: '',
  categoria_id: null as number | null,
  departamento_id: null as number | null,
  negocio_id: null as number | null,
  puntos: 10, direccion: '',
  latitud: null as number | null,
  longitud: null as number | null,
  portada_url: '', activo: true,
})

const modal = reactive({
  open: false, editando: false,
  id: null as number | null,
  form: formVacio(),
  loading: false, error: '',
})

const eliminar = reactive({
  open: false, cita: null as Cita | null,
  loading: false, error: '',
})

async function fetchCitas() {
  loading.value = true; errorGlobal.value = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/citas`)
    if (res.status === 401 || res.status === 422) { auth.logout(); return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    citas.value = data.citas ?? []
  } catch {
    errorGlobal.value = 'No se pudieron cargar las citas.'
  } finally {
    loading.value = false
  }
}

async function fetchRefs() {
  try {
    const [rCat, rDep, rNeg] = await Promise.all([
      auth.authFetch(`${API}/admin/citas/categorias`),
      fetch(`${API}/citas/departamentos`),
      auth.authFetch(`${API}/admin/citas/negocios`),
    ])
    if (rCat.ok) { const d = await rCat.json(); categorias.value = d.categorias ?? [] }
    if (rDep.ok) { const d = await rDep.json(); departamentos.value = d.departamentos ?? [] }
    if (rNeg.ok) { const d = await rNeg.json(); negocios.value = d.negocios ?? [] }
  } catch {}
}

async function subirPortada(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > MAX_IMG_BYTES) {
    uploadErrorPortada.value = `La imagen supera los ${MAX_IMG_MB} MB permitidos.`
    input.value = ''
    return
  }
  uploadingPortada.value = true
  uploadErrorPortada.value = ''
  portadaPreview.value = URL.createObjectURL(file)
  try {
    const fd = new FormData()
    fd.append('imagen', file)
    const res = await auth.authFetch(`${API}/admin/citas/upload-imagen`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al subir')
    const data = await res.json()
    modal.form.portada_url = `http://localhost:5000${data.url}`
  } catch (err: unknown) {
    uploadErrorPortada.value = err instanceof Error ? err.message : 'Error al subir imagen'
    portadaPreview.value = ''
  } finally {
    uploadingPortada.value = false
    input.value = ''
  }
}

const fotosSizeError = ref('')

function seleccionarFotos(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  const rechazadas = files.filter(f => f.size > MAX_IMG_BYTES)
  if (rechazadas.length) {
    fotosSizeError.value = `${rechazadas.length} archivo(s) superan los ${MAX_IMG_MB} MB y fueron omitidos.`
  } else {
    fotosSizeError.value = ''
  }
  const validas = files.filter(f => f.size <= MAX_IMG_BYTES)
  fotosSeleccionadas.value = [
    ...fotosSeleccionadas.value,
    ...validas.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
  ]
  input.value = ''
}

function quitarFoto(i: number) {
  fotosSeleccionadas.value.splice(i, 1)
}

function abrirModal(cita?: Cita) {
  portadaPreview.value = ''
  uploadErrorPortada.value = ''
  fotosSizeError.value = ''
  fotosSeleccionadas.value = []
  geoError.value = ''
  Object.assign(modal, {
    open: true, editando: !!cita,
    id: cita?.id ?? null,
    loading: false, error: '',
    form: cita ? {
      nombre:          cita.nombre ?? '',
      descripcion:     cita.descripcion ?? '',
      categoria_id:    cita.categoria_id ?? null,
      departamento_id: cita.departamento_id ?? null,
      negocio_id:      cita.negocio_id ?? null,
      puntos:          cita.puntos ?? 10,
      direccion:       cita.direccion ?? '',
      latitud:         cita.latitud ?? null,
      longitud:        cita.longitud ?? null,
      portada_url:     cita.portada_url ?? '',
      activo:          cita.activo ?? true,
    } : formVacio(),
  })
  setTimeout(() => iniciarMapa(modal.form.latitud, modal.form.longitud), 50)
}

function cerrarModal() {
  modal.open = false
  portadaPreview.value = ''
  uploadErrorPortada.value = ''
  fotosSizeError.value = ''
  fotosSeleccionadas.value = []
  geoError.value = ''
  if (mapaInst) { mapaInst.remove(); mapaInst = null; markerInst = null }
}

async function guardar() {
  if (!modal.form.nombre.trim()) { modal.error = 'El nombre es obligatorio.'; return }
  if (!modal.form.categoria_id) { modal.error = 'Selecciona una categoría.'; return }
  if (!modal.form.departamento_id) { modal.error = 'Selecciona un departamento.'; return }
  modal.loading = true; modal.error = ''

  try {
    if (!modal.editando && fotosSeleccionadas.value.length > 0) {
      const fd = new FormData()
      fd.append('nombre', modal.form.nombre.trim())
      if (modal.form.descripcion) fd.append('descripcion', modal.form.descripcion)
      fd.append('categoria_id', String(modal.form.categoria_id))
      fd.append('departamento_id', String(modal.form.departamento_id))
      if (modal.form.negocio_id) fd.append('negocio_id', String(modal.form.negocio_id))
      fd.append('puntos', String(modal.form.puntos))
      if (modal.form.direccion) fd.append('direccion', modal.form.direccion)
      if (modal.form.latitud !== null) fd.append('latitud', String(modal.form.latitud))
      if (modal.form.longitud !== null) fd.append('longitud', String(modal.form.longitud))
      fotosSeleccionadas.value.forEach(f => fd.append('fotos', f.file))
      const res = await auth.authFetch(`${API}/admin/citas/con-fotos`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al crear')
    } else {
      const url    = modal.editando ? `${API}/admin/citas/citas/${modal.id}` : `${API}/admin/citas/citas`
      const method = modal.editando ? 'PUT' : 'POST'
      const body = {
        nombre:          modal.form.nombre.trim(),
        descripcion:     modal.form.descripcion || null,
        categoria_id:    modal.form.categoria_id,
        departamento_id: modal.form.departamento_id,
        negocio_id:      modal.form.negocio_id,
        puntos:          modal.form.puntos,
        direccion:       modal.form.direccion || null,
        latitud:         modal.form.latitud,
        longitud:        modal.form.longitud,
        portada_url:     modal.form.portada_url || null,
        activo:          modal.form.activo,
      }
      const res = await auth.authFetch(url, { method, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al guardar')
    }
    await fetchCitas()
    cerrarModal()
  } catch (e: unknown) {
    modal.error = e instanceof Error ? e.message : 'Error al guardar'
  } finally {
    modal.loading = false
  }
}

function confirmarEliminar(cita: Cita) {
  Object.assign(eliminar, { open: true, cita, loading: false, error: '' })
}

async function ejecutarEliminar() {
  if (!eliminar.cita) return
  eliminar.loading = true; eliminar.error = ''
  try {
    const res = await auth.authFetch(`${API}/admin/citas/citas/${eliminar.cita.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al eliminar')
    await fetchCitas()
    eliminar.open = false
  } catch (e: unknown) {
    eliminar.error = e instanceof Error ? e.message : 'Error al eliminar'
  } finally {
    eliminar.loading = false
  }
}

onMounted(async () => {
  await auth.fetchMe()
  await Promise.all([fetchCitas(), fetchRefs()])
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
