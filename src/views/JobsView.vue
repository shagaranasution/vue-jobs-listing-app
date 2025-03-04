<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { getJobs } from '@/services/jobService'
import JobListings from '@/components/JobListings.vue'
import LoaderSpinner from '@/components/LoaderSpinner.vue'

import type { Job } from '@/types'

type State = {
  jobs: Job[]
  isLoading: boolean
  error: string | null
}

const state: State = reactive({
  jobs: [],
  isLoading: true,
  error: null,
})

onMounted(async () => {
  try {
    const jobs = (await getJobs()) as Job[]
    state.jobs = jobs
  } catch (error) {
    state.error = (error as Error).message
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <main>
    <div v-if="state.isLoading" class="my-12">
      <LoaderSpinner />
    </div>
    <div v-else-if="state.error" class="text-center text-gray-500">
      {{ state.error }}
    </div>
    <div v-else>
      <JobListings :jobs="state.jobs" :show-button="false" />
    </div>
  </main>
</template>
