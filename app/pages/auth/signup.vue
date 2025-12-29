<script setup lang="ts">
import { ref } from 'vue'
import { SparklesIcon, MailIcon, UserIcon, LockIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({
  middleware: 'guest'
})

const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)

const handleSignUp = async () => {
  if (password.value !== passwordConfirmation.value) {
    alert('Passwords do not match')
    return
  }

  isLoading.value = true

  // TODO: Implement actual sign up logic
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
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
        Create your account
      </h2>
      <p class="text-center text-sm text-gray-600">
        Start discovering amazing thrift finds today
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSignUp" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                class="pl-10"
              />
            </div>
          </div>

          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="johndoe"
                required
                class="pl-10"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                class="pl-10"
              />
            </div>
          </div>

          <!-- Password Confirmation Field -->
          <div>
            <label for="password-confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password-confirmation"
                v-model="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                required
                class="pl-10"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <Button
              type="submit"
              class="w-full"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Creating account...' : 'Sign up' }}
            </Button>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/auth/signin"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Sign in instead
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
