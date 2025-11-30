<script setup lang="ts">
import { ref } from 'vue'
import { SparklesIcon, MailIcon, LockIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { LoginRequest, LoginResponse } from '~/types/auth'
import { useUserStore } from '@/stores/user'

definePageMeta({
  middleware: 'guest'
})

const isLoading = ref(false)

const form = ref<LoginRequest>({
  email: '',
  password: '',
  remember: false
})

const userStore = useUserStore()

const handleSignIn = async () => {
  isLoading.value = true
  const api = useApi()
  console.log('Sign in with:', form.value)

  try {
    const response = await api.post('/auth/login', form.value) as LoginResponse

    // Store user data in Pinia store
    userStore.setUser(response.email, response.username, response.token)

    console.log('Login successful:', response)

    // Redirect to dashboard
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    // TODO: Show error message to user
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center justify-center gap-2 mb-6">
        <SparklesIcon class="w-10 h-10 text-gray-900" />
        <span class="text-3xl font-bold text-gray-900">ThriftSpot</span>
      </NuxtLink>

      <h2 class="text-center text-3xl font-bold text-gray-900 mb-2">
        Welcome back
      </h2>
      <p class="text-center text-sm text-gray-600">
        Sign in to your account to continue
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSignIn" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input id="email" v-model="form.email" type="email" placeholder="you@example.com" required
                class="pl-10" />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                class="pl-10" />
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center">
            <input id="remember-me" v-model="form.remember" type="checkbox"
              class="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </Button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink to="/auth/signup"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Create an account
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
