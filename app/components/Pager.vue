<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { PageMeta } from '~/types/item'

defineProps<{ meta: PageMeta | null }>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between pt-4">
    <p class="text-sm text-gray-600">Page {{ meta.current_page }} of {{ meta.last_page }} · {{ meta.total }} results</p>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" :disabled="meta.current_page <= 1" @click="emit('change', meta.current_page - 1)">
        Previous
      </Button>
      <Button variant="outline" size="sm" :disabled="meta.current_page >= meta.last_page" @click="emit('change', meta.current_page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>
