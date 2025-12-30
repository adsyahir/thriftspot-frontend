<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Lock, UserX, FileQuestion, ServerCrash } from 'lucide-vue-next'

const route = useRoute()
const code = computed(() => route.params.code as string || '500')

interface ErrorConfig {
  title: string
  message: string
  icon: any
  suggestion: string
  actionText: string
  actionPath: string
}

const errorConfigs: Record<string, ErrorConfig> = {
  '401': {
    title: 'Unauthorized',
    message: 'You need to sign in to access this page.',
    icon: UserX,
    suggestion: 'Please sign in with your account to continue.',
    actionText: 'Go to Sign In',
    actionPath: '/auth/signin'
  },
  '403': {
    title: 'Access Denied',
    message: 'You don\'t have permission to access this page.',
    icon: Lock,
    suggestion: 'Contact your administrator if you believe you should have access.',
    actionText: 'Go to Dashboard',
    actionPath: '/dashboard'
  },
  '404': {
    title: 'Page Not Found',
    message: 'The page you\'re looking for doesn\'t exist.',
    icon: FileQuestion,
    suggestion: 'The page might have been moved or deleted.',
    actionText: 'Go to Home',
    actionPath: '/'
  },
  '500': {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    icon: ServerCrash,
    suggestion: 'We\'re working to fix the issue. Please try again later.',
    actionText: 'Go to Home',
    actionPath: '/'
  }
}

const error = computed(() => {
  return errorConfigs[code.value] || {
    title: 'Error',
    message: 'An unexpected error occurred.',
    icon: AlertCircle,
    suggestion: 'Please try again or contact support if the problem persists.',
    actionText: 'Go to Home',
    actionPath: '/'
  }
})

const goBack = () => {
  navigateTo(error.value.actionPath)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <!-- Error Icon -->
        <div class="flex justify-center mb-6">
          <div class="rounded-full bg-red-100 p-6">
            <component
              :is="error.icon"
              class="w-16 h-16 text-red-600"
            />
          </div>
        </div>

        <!-- Error Code -->
        <div class="text-6xl font-bold text-gray-900 mb-2">
          {{ code }}
        </div>

        <!-- Error Title -->
        <h1 class="text-2xl font-bold text-gray-900 mb-3">
          {{ error.title }}
        </h1>

        <!-- Error Message -->
        <p class="text-gray-600 mb-4">
          {{ error.message }}
        </p>

        <!-- Suggestion -->
        <p class="text-sm text-gray-500 mb-6">
          {{ error.suggestion }}
        </p>

        <!-- Actions -->
        <div class="space-y-3">
          <button
            @click="goBack"
            class="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {{ error.actionText }}
          </button>

          <button
            @click="$router.back()"
            class="w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
