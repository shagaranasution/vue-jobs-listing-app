<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Hero from '@/components/HomeHero.vue'
import HomeCards from '@/components/HomeCards.vue'
import JobListings from '@/components/JobListings.vue'
import LoaderSpinner from '@/components/LoaderSpinner.vue'
import { getJobs } from '@/services/jobService'
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
    const jobs: Job[] = (await getJobs()) as Job[]
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
    <Hero />
    <HomeCards />
    <div v-if="state.isLoading">
      <LoaderSpinner />
    </div>
    <div v-else-if="state.error" class="text-center text-gray-500">
      {{ state.error }}
    </div>
    <div v-else>
      <JobListings :limit="3" :jobs="state.jobs" />
    </div>
  </main>
</template>
