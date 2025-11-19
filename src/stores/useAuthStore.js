import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase/firebaseConfig'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // ВАЖНО: восстанавливаем сессию
  function initAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        resolve(firebaseUser)
      })
    })
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      user.value = res.user
      return res.user
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      console.error(err)
    }
  }

  return { user, loading, error, login, logout, initAuth }
})
