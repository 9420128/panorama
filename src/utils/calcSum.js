// 🔹 Расчет стоимости

export function formatRub(value) {
  const num = Number(value)
  if (isNaN(num)) return ''
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * @param {Array} data - tableData.value
 * @param {Object} percent - процентные значения { units, components, services }
 * @param {Object} sales - процентные значения { units, components, services }
 * @param {Object} total - объект total { sum, ... }
 */
export function calculateSum(data, percent, sales, total) {
  if (!data || !Array.isArray(data)) {
    console.warn('⚠️ Некорректные данные для расчёта суммы')
    return
  }

  let totalSumThis = 0
  let totalSumSale = 0
  let sumSale = 0

  for (const block of data) {
    if (!block.price || !Array.isArray(block.price)) continue

    let sum = 0

    for (const [i, prices] of block.price.entries()) {
      if (!Array.isArray(prices) || prices.length < 3) continue

      const [price, qty] = prices.map((n) => parseFloat(n) || 0)

      const percentThis = percent[block.name] || 0
      const priceWithPercent = price * (1 + percentThis / 100)
      const calculated = priceWithPercent * qty
      sum += isNaN(calculated) ? 0 : calculated

      if (block.options && block.options[i]) {
        block.options[i][1] = formatRub(priceWithPercent)
        block.options[i][2] = qty
        block.options[i][3] = formatRub(calculated)
      }
    }

    block.sum = formatRub(sum)
    totalSumThis += sum

    //   sale
    const salesThis = sales[block.name] || 0
    const calculated = sum * (1 - salesThis / 100)
    sumSale += isNaN(calculated) ? 0 : calculated

  }

  total.sum = formatRub(totalSumThis)
  total.sumSales = formatRub(sumSale)
}