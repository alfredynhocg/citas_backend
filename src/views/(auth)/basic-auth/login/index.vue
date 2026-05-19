<template>
  <Auth>
    <div class="mt-8 text-center">
      <h4 class="mb-2.5 text-xl font-semibold text-primary">Bienvenido de vuelta</h4>
      <p class="text-base text-default-500">Ingresa a tu cuenta de 100 Citas</p>
    </div>

    <form class="text-left w-full mt-10" @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block font-medium text-default-900 text-sm mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="form-input"
          placeholder="tu@email.com"
          style="padding: 0 12px"
          required
          autocomplete="email"
        />
      </div>

      <div class="mb-4">
        <RouterLink to="/basic-auth/reset-pass" class="text-primary font-medium text-sm mb-2 float-end">
          ¿Olvidaste tu contraseña?
        </RouterLink>
        <label for="password" class="block font-medium text-default-900 text-sm mb-2">Contraseña</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input pr-10"
            placeholder="Ingresa tu contraseña"
            style="padding: 0 12px"
            required
            autocomplete="current-password"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-700"
            @click="showPassword = !showPassword"
          >
            <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex gap-2 items-center">
        <Icon icon="lucide:alert-circle" class="size-4 flex-shrink-0" />
        {{ errorMsg }}
      </div>

      <div class="mt-6 text-center">
        <button
          type="submit"
          class="btn bg-primary text-white w-full"
          :disabled="loading"
        >
          <Icon v-if="loading" icon="lucide:loader-circle" class="size-4 animate-spin mr-2 inline" />
          {{ loading ? 'Ingresando…' : 'Iniciar sesión' }}
        </button>
      </div>

      <div class="mt-8 text-center">
        <p class="text-base text-default-500">
          ¿No tienes cuenta?
          <RouterLink to="/basic-auth/register" class="font-semibold underline hover:text-primary transition duration-200">
            Regístrate
          </RouterLink>
        </p>
      </div>

      <!-- Cuentas de prueba -->
      <div class="mt-6 border border-default-200 rounded-xl p-4 space-y-2">
        <p class="text-xs font-semibold text-default-500 uppercase tracking-wide mb-3">Cuentas de prueba</p>
        <button v-for="c in cuentas" :key="c.email" type="button"
          @click="usarCuenta(c)"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-50 transition-colors text-left group">
          <div class="size-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            :class="c.color">
            {{ c.initials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-default-800">{{ c.nombre }}</p>
            <p class="text-xs text-default-400 truncate">{{ c.email }}</p>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
            :class="c.rol === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'">
            {{ c.rol }}
          </span>
        </button>
      </div>
    </form>
  </Auth>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import Auth from '@/layouts/auth.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const cuentas = [
  { nombre: 'Carlos Mamani',     email: 'carlos@citas.bo',    initials: 'CM', rol: 'Usuario', color: 'bg-rose-100 text-rose-600' },
  { nombre: 'Sofía Quispe',      email: 'sofia@citas.bo',     initials: 'SQ', rol: 'Usuario', color: 'bg-violet-100 text-violet-600' },
  { nombre: 'Diego Flores',      email: 'diego@citas.bo',     initials: 'DF', rol: 'Usuario', color: 'bg-blue-100 text-blue-600' },
  { nombre: 'Valentina Rios',    email: 'valentina@citas.bo', initials: 'VR', rol: 'Usuario', color: 'bg-pink-100 text-pink-600' },
  { nombre: 'Admin',             email: 'admin@citas.bo',     initials: 'AP', rol: 'Admin',   color: 'bg-amber-100 text-amber-600' },
]

function usarCuenta(c: { email: string; rol: string }) {
  email.value    = c.email
  password.value = c.rol === 'Admin' ? 'admin123' : 'test1234'
}

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard/ecommerce')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
