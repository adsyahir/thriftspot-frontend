<script setup lang="ts">
import { Home, ArrowLeft, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  error: Object
})

const userStore = useUserStore()
const isDev = import.meta.dev

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return {
      title: '404 - Page Not Found',
      message: 'Oops! The page you\'re looking for doesn\'t exist.',
      description: 'It seems you\'ve wandered into uncharted territory. Let\'s get you back on track!'
    }
  }
  return {
    title: 'Something went wrong',
    message: props.error?.message || 'An unexpected error occurred',
    description: 'Don\'t worry, we\'re on it. Try refreshing the page or go back home.'
  }
})

const handleError = () => {
  const redirectPath = userStore.isAuthenticated ? '/dashboard' : '/'
  clearError({ redirect: redirectPath })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full text-center">
      <!-- Error Icon/Number -->
      <div class="mb-8">
        <div class="inline-block relative">
          <h1 class="text-9xl font-black text-gray-900 opacity-10 select-none">
            {{ error?.statusCode || '500' }}
          </h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center">
              <Search class="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="space-y-4 mb-8">
        <h2 class="text-4xl font-bold text-gray-900">
          {{ errorMessage.title }}
        </h2>
        <p class="text-xl text-gray-600">
          {{ errorMessage.message }}
        </p>
        <p class="text-gray-500">
          {{ errorMessage.description }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          @click="$router.back()"
          variant="outline"
          class="w-full sm:w-auto"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          Go Back
        </Button>
        <Button
          size="lg"
          @click="handleError"
          class="w-full sm:w-auto"
        >
          <Home class="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </div>

      <!-- Optional: Show error details in development -->
      <div v-if="error?.stack && isDev" class="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg text-left">
        <h3 class="text-sm font-semibold text-red-900 mb-2">Error Details (Development Only)</h3>
        <pre class="text-xs text-red-800 overflow-auto">{{ error }}</pre>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-600 mb-4">Maybe you're looking for:</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink to="/" class="text-sm text-gray-900 hover:underline">
            Home
          </NuxtLink>
          <span class="text-gray-300">•</span>
          <NuxtLink to="/dashboard" class="text-sm text-gray-900 hover:underline">
            Dashboard
          </NuxtLink>
          <span class="text-gray-300">•</span>
          <NuxtLink to="/admin/roles" class="text-sm text-gray-900 hover:underline">
            Admin
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
