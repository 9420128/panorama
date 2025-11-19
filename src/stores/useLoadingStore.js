import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // объект вида { key: boolean }
  const loading = ref({})

  // включить загрузку по ключу
  function start(key) {
    loading.value[key] = true
  }

  // выключить загрузку по ключу
  function stop(key) {
    loading.value[key] = false
  }

  // проверить загрузку
  function is(key) {
    return !!loading.value[key]
  }

  return { loading, start, stop, is }
})
