<script setup>
import TableUnitRow from './TableUnitRow.vue'
import PercentBlock from './blocks/PercentBlock.vue'
import ButtonBlock from './blocks/ButtonBlock.vue'
import FooterBlock from './blocks/FooterBlock.vue'
import HeaderBlock from './blocks/HeaderBlock.vue'
import { calculateSum } from '@/utils/calcSum'
import { useTableData } from '@/composables/useTableData'
import { setClassName } from '@/utils/rtfUtils'
import { useOrdersStore } from '@/stores/useOrdersStore.js'
import LogoutBlock from '@/components/blocks/LogoutBlock.vue'

const ordersStore = useOrdersStore()

const calcSum = () => {
  calculateSum(tableData, ordersStore.order.percent, total)
}

const { tableData, fileName, handleFileUpload, createRow, cellUpdate, cellRemove, total } = useTableData(calcSum)

</script>

<template>
	<LogoutBlock />
  <div class="flex flex-col items-center py-4 gap-2">
    <PercentBlock @calculateSum="calcSum" />
    <ButtonBlock @createRow="createRow" />
  </div>

  <div class="p-6 max-w-4xl flex items-center no-print">
    <input
      type="file"
      accept=".rtf"
      @change="handleFileUpload"
      class="mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div v-if="fileName" class="text-sm text-gray-600 mb-2">Загружен файл: {{ fileName }}</div>
  </div>
  <div id="print" class="p-4 sm:p-6 max-w-full sm:max-w-4xl mx-auto overflow-auto h-[80vh]">
    <HeaderBlock />

    <div v-if="tableData.length">
      <div v-for="(row, i) in tableData" :key="i" class="mb-2 items-start pb-1 overflow-x-auto'">
        <!-- 🔹 Блок units -->
        <TableUnitRow
          v-if="row.name === 'units' || row.name === 'services' || row.name === 'components'"
          :row="row"
          :index="i"
          :setClassName="setClassName"
          @cellUpdate="cellUpdate"
          @cellRemove="cellRemove"
        />
        <!-- 🔹 Остальные строки -->
        <template v-else>
          <div
            v-if="row.cells.length"
            v-for="(cell, j) in row.cells"
            :key="`cell-${i}-${j}`"
            class="px-3 py-1 rounded mr-1 mb-1"
            :class="setClassName(cell, i, j)"
            v-html="cell"
          ></div>
        </template>
      </div>
    </div>

    <FooterBlock />
  </div>
</template>
