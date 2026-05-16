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
