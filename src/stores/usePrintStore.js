import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePrintStore = defineStore('print', () => {
  const isPrinting = ref(false)

  function startPrint() {
    isPrinting.value = true
  }

  function stopPrint() {
    isPrinting.value = false
  }

  return { isPrinting, startPrint, stopPrint }
})
