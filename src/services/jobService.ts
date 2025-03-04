import { db } from '@/firebase.ts'
import { collection, getDocs } from 'firebase/firestore'

const jobsCollection = collection(db, 'job_vacancies')

export async function getJobs() {
  try {
    const snapshot = await getDocs(jobsCollection)
    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to fetch jobs')
  }
}
