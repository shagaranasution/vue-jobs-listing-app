<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { Job } from '@/types'
import { deleteJob, getJob } from '@/services/jobService'
import LoaderSpinner from '@/components/LoaderSpinner.vue'
import BackButton from '@/components/BackButton.vue'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'
import { useToast } from 'vue-toastification'

type State = {
  job: Job | null
  isLoading: boolean
  error: string | null
  shownDeleteConfirmationModal: boolean
}

const route = useRoute()
const router = useRouter()
const jobId = (route.params.id || '') as string
const toast = useToast()

const state: State = reactive({
  job: null,
  isLoading: true,
  error: null,
  shownDeleteConfirmationModal: false,
})

onMounted(async () => {
  try {
    const job = await getJob(jobId)
    state.job = job
  } catch (error) {
    state.error = (error as Error).message
  } finally {
    state.isLoading = false
  }
})

function openModal() {
  state.shownDeleteConfirmationModal = true
}

function closeModal() {
  state.shownDeleteConfirmationModal = false
}

async function handleDelete(id: string) {
  try {
    state.isLoading = true
    await deleteJob(id)
    toast.success('Job deleted successfully')
    router.push('/jobs')
  } catch (error) {
    toast.error((error as Error).message)
  } finally {
    state.isLoading = false
    closeModal()
  }
}

function handleConfirm() {
  const jobId = state.job?.id
  if (!jobId || state.isLoading) return
  handleDelete(jobId)
}

function handleModalCancel() {
  closeModal()
}
</script>

<template>
  <main>
    <BackButton />

    <div v-if="state.isLoading" class="my-10">
      <LoaderSpinner />
    </div>

    <div v-else-if="state.error" class="text-center text-gray-500 mt-4">
      {{ state.error }}
    </div>

    <section v-else-if="state.job !== null" class="bg-green-50">
      <div class="container m-auto py-10 px-6">
        <div class="grid grid-cols-1 md:grid-cols-70-30 w-full gap-6">
          <main>
            <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
              <div class="text-gray-500 mb-4">{{ state.job.type }}</div>
              <h1 class="text-3xl font-bold mb-4">{{ state.job.title }}</h1>
              <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                <i class="pi pi-map-marker text-orange-900 mr-2"></i>
                <p class="text-orange-700">{{ state.job.location }}</p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-green-800 text-lg font-bold mb-6">Job Description</h3>

              <p class="mb-4">
                {{ state.job.description }}
              </p>

              <h3 class="text-green-800 text-lg font-bold mb-2">Salary</h3>

              <p class="mb-4">{{ `${state.job.salary} / Year` }}</p>
            </div>
          </main>

          <!-- Sidebar -->
          <aside>
            <!-- Company Info -->
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-6">Company Info</h3>

              <h2 class="text-2xl">{{ state.job.company.name }}</h2>

              <p class="my-2">
                {{ state.job.company.description }}
              </p>

              <hr class="my-4" />

              <h3 class="text-xl">Contact Email:</h3>

              <p class="my-2 bg-green-100 p-2 font-bold">{{ state.job.company.contactEmail }}</p>

              <h3 class="text-xl">Contact Phone:</h3>

              <p class="my-2 bg-green-100 p-2 font-bold">{{ state.job.company.contactPhone }}</p>
            </div>

            <!-- Manage -->
            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-xl font-bold mb-6">Manage Job</h3>
              <RouterLink
                :to="`/jobs/${state.job.id}/edit`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >Edit Job</RouterLink
              >
              <button
                @click="openModal"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                Delete Job
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 mt-4">There is no data with given ID.</div>
  </main>
  <DeleteConfirmationModal
    :show="state.shownDeleteConfirmationModal"
    @on-confirm="handleConfirm"
    @on-cancel="handleModalCancel"
  />
</template>
