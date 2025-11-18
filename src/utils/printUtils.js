// units/printUtils.js
import { nextTick } from 'vue'
import { usePrintStore } from '@/stores/usePrintStore'

export const openPrintWindow = async (fileName = 'document') => {
  const printStore = usePrintStore()  // <--- создаём экземпляр стора
  const printContent = document.getElementById('print')
  if (!printContent) {
    console.warn('⚠️ Элемент для печати не найден')
    return
  }

  printStore.startPrint() // теперь всё ок
  await nextTick()

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
  .map(node => node.outerHTML)
  .join('')

  let win = window.open(
    '',
    '_blank',
    `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${window.screen.width},height=${window.screen.height},top=0,left=0`
  )

  if (!win) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    win = window.open(
      '',
      '_blank',
      `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${window.screen.width},height=${window.screen.height},top=0,left=0`
    )
    if (!win) {
      console.warn('⚠️ Не удалось открыть окно для печати (popup заблокирован)')
      printStore.stopPrint()
      return
    }
  }

  win.document.write(`
    <html>
      <head>
        <title>${fileName}</title>
        ${styles}
      </head>
      <body>${printContent.outerHTML}</body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
  win.close()

  printStore.stopPrint()
}
