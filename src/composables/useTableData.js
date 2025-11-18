import { ref } from 'vue'
import { useOrdersStore } from '@/stores/useOrdersStore'
import { decodeHexRTF } from '@/utils/rtfParser'
import { formatRub } from '@/utils/calcSum'
import { shouldIgnoreRow, getToOptionsPrice, rowSetName } from '@/utils/rtfUtils'

export function useTableData(calcSum) {
  const ordersStore = useOrdersStore()

  const tableData = ordersStore.order.tableData
  const total = ordersStore.order.total
  const percent = ordersStore.order.percent

  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return
    total.name = file.name
    ordersStore.order.id = ''

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const buffer = e.target.result
        const decoder = new TextDecoder('windows-1251')
        let rtfData = decoder.decode(buffer)

        rtfData = rtfData.replace(/x\d+\s\*[\da-zA-Z]+/g, '')

        const rows = rtfData.match(/\\trowd[\s\S]*?\\row/g) || []
        if (!rows.length) {
          tableData.length = 0
          return
        }

        const parsed = rows
        .map((row) => {
          let img = ''
          const cells = row
          .split('\\cell')
          .map(decodeHexRTF)
          .map((cell) => {
            cell = cell
            .replace(/#[^#]+#/g, '')
            .replace(/^\s*-\d+\s*$/gm, '')
            .trim()

            if (/<img\b/i.test(cell)) {
              img = cell
              return ''
            }
            return cell
          })
          .filter(Boolean)

          const { text, name } = rowSetName(cells[0] || '', cells.length)
          return { cells, text, name, img }
        })
        .filter((r) => r.cells.length > 0)

        const data = []

        for (const row of parsed) {
          if (shouldIgnoreRow(row)) continue

          if (row.cells[0].includes('Коммерческое')) {
            total.name = row.cells[0]
            continue
          }

          const lastCell = row.cells[row.cells.length - 1]

          // Итоговая сумма
          if (row.cells[0].includes('Ито')) {
            const match = row.cells[0].match(/\d+(?:[.,]\d+)?/)
            if (match) total.sum = formatRub(parseFloat(match[0].replace(',', '.')))
            break
          }

          // Площадь / Количество изделий
          if (
            row.cells[0].includes('Общая площадь') ||
            row.cells[0].includes('Количество изделий')
          ) {
            const num = parseFloat(lastCell.replace(/[^\d.,]/g, '').replace(',', '.'))
            if (isNaN(num) || num <= 0) continue

            if (row.cells[0].includes('Количество изделий')) total.qty = num
            else total.units = num

            continue
          }

          const isGrouped = ['units', 'components', 'services'].includes(row.name)
          const last = data[data.length - 1]

          if (isGrouped) {
            if (last?.options) {
              const [option, price] = getToOptionsPrice(row.cells)
              last.options.push(option)
              last.price.push(price)
              if (row.img) last.img = row.img
            } else {
              const title = row.text || row.cells[0]
              const cellsForBlock = row.name === 'services' ? row.cells.slice(1) : []

              data.push({
                cells: cellsForBlock,
                options: [],
                sum: '',
                title,
                name: row.name,
                img: row.img || '',
                price: [],
              })
            }
          } else if (row.name === 'sum') {
            const hasNumber = /\d/.test(row.cells[0])
            if (!hasNumber) {
              last.info = row.cells[0]
              last.sum = lastCell || ''
            } else {
              last.sum = lastCell
            }
            data.push({ cells: [], name: 'sum' })
          } else {
            data.push(row)
          }
        }

        // Заменяем содержимое глобального массива
        tableData.splice(0, tableData.length, ...data)
      } catch (err) {
        console.error('Ошибка при чтении RTF:', err)
        alert('Ошибка при чтении файла. Возможно, неверная кодировка.')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  function createRow(payload) {
    const data = tableData
    const { name, price, quantity, type } = { ...payload }

    const totalRow = +price * +quantity
    const blockOption = [name, formatRub(price), quantity, formatRub(totalRow)]
    const blockPrice = [+price, +quantity, +totalRow]

    let block = data.find((item) => item.name === type)

    if (!block) {
      block = {
        cells: [],
        options: [blockOption],
        sum: '0.00',
        title:
          type === 'services'
            ? 'Услуги заказа:'
            : type === 'components'
              ? 'Комплектующие:'
              : 'Юниты:',
        name: type,
        img: '',
        price: [blockPrice],
      }
      data.push(block)
    } else {
      block.options.push(blockOption)
      block.price.push(blockPrice)
    }

    calcSum()
  }

  function cellUpdate({ rowIndex, optionIndex, cellIndex, value }) {
    const row = tableData[rowIndex]
    if (!row) return

    if (cellIndex === 0) {
      row.options[optionIndex][cellIndex] = value
    } else if (cellIndex === 1 || cellIndex === 2) {
      row.price[optionIndex][cellIndex - 1] = +value
      calcSum()
    }
  }

  function cellRemove({ rowIndex, optionIndex }) {
    const row = tableData[rowIndex]
    if (!row) return

    if (row.options.length === 1) {
      tableData.splice(rowIndex, 1)
    } else {
      row.options.splice(optionIndex, 1)
      row.price.splice(optionIndex, 1)
    }

    calcSum()
  }

  return {
    tableData,
    handleFileUpload,
    createRow,
    cellUpdate,
    cellRemove,
    total,
    percent
  }
}
