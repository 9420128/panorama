export const sectionMap = {
  Юнит: { name: 'units', text: '' },
  Дополнения: { name: 'components', text: 'Дополнения:' },
  Услуги: { name: 'services', text: 'Услуги заказа:' },
}

let rowName = ''

export function rowSetName(cell, keyLength) {
  if (!cell) return { text: '', name: '' }

  for (const [key, { name, text }] of Object.entries(sectionMap)) {
    if (cell.includes(key)) {
      rowName = name
      return { text, name }
    }
  }

  if (rowName !== '' && keyLength < 3) {
    rowName = ''
    return { text: '', name: 'sum' }
  }

  return { text: '', name: rowName }
}

export function shouldIgnoreRow(row) {
  if (!row || !Array.isArray(row.cells) || !row.cells[0]) return true

  const ignoreWords = ['Заказчик', 'Прод', 'печа', 'Внимательно']
  const hasIgnoredWord = ignoreWords.some((word) => row.cells[0].includes(word))
  const isHeaderRow = row.name === 'services' && row.cells[0].includes('Наименование')

  return hasIgnoredWord || isHeaderRow
}

export function getToOptionsPrice(cells) {
  const moneyRegex = /\d{1,3}(?:[ \u00A0]?\d{3})*[.,]\d{2}(?!\s?[a-zA-Zа-яА-Я])/
  const price = []

  const processed = cells.map((cell) => {
    if ((moneyRegex.test(cell) || !isNaN(+cell)) && cell.trim() !== '') {
      const priceInt = parseFloat(cell.replace(/\s+/g, '').replace(',', '.')) || 0
      price.push(priceInt)
    }
    return cell
  })

  return [processed, price]
}

export function setClassName(cell, i, j, t = null) {
  const moneyRegex = /\d{1,3}(?:[ \u00A0]?\d{3})*[.,]\d{2}(?!\s?[a-zA-Zа-яА-Я])/
  let id = `id-${i}-${j}`
  if (t !== null) id += '-' + t

  return moneyRegex.test(cell) || !isNaN(+cell)
    ? `col-number col-${j} ${id}`
    : `col-text col-${j} ${id}`
}
