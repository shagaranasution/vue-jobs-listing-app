<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

type Props = {
  show: boolean
  title?: string
  message?: string
}

const {
  show,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
} = defineProps<Props>()

const emit = defineEmits(['onConfirm', 'onCancel'])

function handleConfirm() {
  emit('onConfirm')
}

function handleCancel() {
  emit('onCancel')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold mb-3">{{ title }}</h2>
      <p class="text-gray-700 mb-5">{{ message }}</p>
      <div class="flex justify-end space-x-2">
        <button @click="handleCancel" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
