// 🔹 Декодирование текста из RTF
//
// Регулярки для картинок
const pictRegexImg = /89504E47/
const pictRegex = /^.*\\\*/

function parseRTFWithImages(rtfData) {
  const arr = rtfData.split('#').filter(Boolean)
  // ищем начало картинки (PNG или JPEG)
  const imgRegex = /(89504e47|ffd8ff)[0-9a-fA-F\s]*/gi

  const match = arr[1].match(imgRegex)

  let hex = match[0]
  .replace(/\s+/g, '') // убираем пробелы и переносы
    .trim()

  if (!hex || hex.length < 20) return

  // определяем тип
  const type = hex.startsWith('89504e47')
    ? 'image/png'
    : hex.startsWith('ffd8ff')
      ? 'image/jpeg'
      : 'application/octet-stream'

  try {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map((b) => parseInt(b, 16)))

    const blob = new Blob([bytes], { type })
    const url = URL.createObjectURL(blob)
    return `#${arr[0]}#<img src="${url}" alt="RTF Image" />`
  } catch (e) {
    console.warn('⚠️ Ошибка при создании картинки:', e)
  }

  return rtfData
}

export function decodeHexRTF(str) {
  if (!str) return ''

  // 1) нормализуем вход
  str = String(str)

  // 2) Обработка \uXXXX\'YY
  str = str.replace(/\\u(-?\d+)(?:\\'([0-9a-fA-F]{2}))?/g, (_, codeStr) => {
    let code = parseInt(codeStr, 10)
    if (Number.isNaN(code)) return ''
    if (code < 0) code = code + 65536
    return String.fromCharCode(code)
  })

  // 3) Декодируем байты \'xx как CP1251
  const td = new TextDecoder('windows-1251')
  str = str.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => {
    try {
      const byte = parseInt(hex, 16)
      return td.decode(new Uint8Array([byte]))
    } catch {
      return ''
    }
  })

  // 4) Убираем служебные команды
  let decoded = str
  .replace(/\\line(?:\s*\\[a-zA-Z]+\-?\d*)*/gi, '<br>')
  .replace(/\\sl(-?\d+)/g, (match, p1) => `\\sl#${p1}#`)
  .replace(/\\[a-z]+\d* ?/gi, '')
  .replace(/[{}]/g, '')
  .replace(/(?:\bx\d+\b|-?\d+-\d+)/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

  // 5) Обрабатываем изображения
  if (pictRegex.test(decoded) || pictRegexImg.test(decoded)) {
    decoded = parseRTFWithImages(decoded)
  } else {
    // Проверяем кракозябры и перекодируем
    const isBroken = /[ÃÂÊÐÎÌÞßàáâãäåæçèíîïðñòóôõö÷øùúûüýþÿ]/.test(decoded)
    if (isBroken) {
      decoded = Array.from(decoded)
      .map(ch => {
        const code = ch.charCodeAt(0)
        if (code >= 0xc0 && code <= 0xff) return String.fromCharCode(code - 0xc0 + 0x0410)
        if (code === 0xa8) return 'Ё'
        if (code === 0xb8) return 'ё'
        return ch
      })
      .join('')
    }
  }

  return decoded.replace(/\s{2,}/g, ' ').trim()
}
