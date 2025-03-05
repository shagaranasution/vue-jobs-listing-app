import { db, JOB_VACANCIES_DOC_TITLE } from '@/firebase.ts'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import type { Job } from '@/types'

const jobsCollection = collection(db, 'job_vacancies')

export async function getJobs(): Promise<Job[]> {
  try {
    const snapshot = await getDocs(jobsCollection)

    return snapshot.docs.map((doc) => doc.data()) as Job[]
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to fetch jobs data')
  }
}

export async function getJob(id: string): Promise<Job | null> {
  const docRef = doc(db, JOB_VACANCIES_DOC_TITLE, id)

  try {
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data() as Job
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to fetch job data')
  }
}
