<template>
  <div class="py-1 mr-1 mb-1 w-full" :class="row.img ? 'flex items-start gap-5' : ''">
    <!-- Блок изображения и заголовка -->
    <div v-if="row.img" class="col-img w-1/4">
      <div v-if="row.title" class="font-bold mb-2">{{ row.title }}</div>
      <div v-if="row.img" v-html="row.img" class="max-w-full"></div>
    </div>
    <div v-else>
      <div v-if="row.title" class="font-bold mb-2">{{ row.title }}</div>
    </div>
    <div class="col-content w-full mt-2">
      <!-- Таблица -->
      <table class="border border-black border-collapse w-full text-[14px] self-start">
        <thead class="bg-sky-600 text-white">
          <tr>
            <th
              v-for="(cell, j) in thNames"
              :key="`th-${index}-${j}`"
              class="px-1 border border-black text-left"
            >
              {{ cell }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(option, j) in row.options"
            :key="`opt-${index}-${j}`"
            class="group hover:bg-gray-50"
          >
            <td
              v-for="(td, t) in option"
              :key="`td-${index}-${j}-${t}`"
              class="px-1 border border-black text-gray-700 relative"
              :class="setClassName(td, index, j, t)"
            >
              <!-- Редактируемое поле -->
              <div v-if="isEditingCell(j, t)">
                <textarea
                  v-model="row.options[j][t]"
                  class="w-full border border-blue-300 rounded px-1 py-0.5"
                  @blur="saveCellEdit(index, j, t)"
                  @keydown.enter="saveCellEdit(index, j, t)"
                />
              </div>
              <span v-else v-html="td"></span>

              <!-- Кнопка редактирования для всех td -->
              <div
                v-if="t !== option.length - 1"
                class="absolute top-0 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  class="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all"
                  title="Редактировать"
                  @click="cellEdit(j, t)"
                >
                  <!-- SVG иконка редактирования -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-7-7l7 7-7-7z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Кнопка удаления только для последнего td -->
              <div
                v-if="t === option.length - 1"
                class="absolute top-0 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="cellRemove(index, j)"
                  class="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                  title="Удалить"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row-sum flex">
        <div v-if="row.info" class="text-[14px]">{{ row.info }}</div>
        <div v-if="row.sum" class="font-bold ml-auto text-[16px]">{{ row.sum }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const thNames = ['Наименование', 'Цена', 'Кол', 'Стоимость']

const emit = defineEmits(['cellUpdate', 'cellRemove'])

const props = defineProps({
  row: { type: Object, required: true },
  index: { type: Number, required: true },
  setClassName: { type: Function, required: true },
})

const editingCell = ref({
  optionIndex: null,
  cellIndex: null,
})

// Функция для начала редактирования
function cellEdit(optionIndex, cellIndex) {
  if (!props.row.options || !props.row.options[optionIndex]) return
  editingCell.value = { optionIndex, cellIndex }
}

// Проверка, редактируется ли эта ячейка
function isEditingCell(optionIndex, cellIndex) {
  return editingCell.value.optionIndex === optionIndex && editingCell.value.cellIndex === cellIndex
}

// Сохранение редактирования
function saveCellEdit(rowIndex, optionIndex, cellIndex) {
  // Тут можно вызвать emit, чтобы уведомить родителя о изменении
  emit('cellUpdate', {
    rowIndex,
    optionIndex,
    cellIndex,
    value: props.row.options[optionIndex][cellIndex],
  })

  editingCell.value = { rowIndex: null, optionIndex: null, cellIndex: null }
}

function cellRemove(rowIndex, optionIndex) {
  emit('cellRemove', {
    rowIndex,
    optionIndex,
  })
}
</script>
