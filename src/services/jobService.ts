import { db, JOB_VACANCIES_DOC_TITLE } from '@/firebase.ts'
import { collection, doc, getDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore'
import type { Job } from '@/types'

const jobsCollection = collection(db, JOB_VACANCIES_DOC_TITLE)

export async function getJobs(): Promise<Job[]> {
  try {
    const snapshot = await getDocs(jobsCollection)

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Job[]
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

    return { id: docRef.id, ...docSnap.data() } as Job
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to fetch job data')
  }
}

export async function addJob(newJob: Omit<Job, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(jobsCollection, newJob)
    return docRef.id
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to add job')
  }
}

export async function deleteJob(id: string) {
  try {
    await deleteDoc(doc(db, JOB_VACANCIES_DOC_TITLE, id))
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Fail to delete data')
  }
}
