<template>
  <div class="no-print">
    <OrdersListBlock v-if="Array.isArray(orders)" :orders="orders" @selectOrder="handleSelectOrder" @deleteOrder="handleDeleteOrder" />
    <div class="flex flex-wrap gap-2 mb-3">
      <AppButton variant="success" size="sm" @click.stop="openModal = true">Добавить</AppButton>
      <AppButton variant="primary" size="sm" @click="printPage">Печать / PDF</AppButton>
      <AppButton variant="danger" size="sm" @click="savePageHandler">Сохранить</AppButton>
      <AppButton variant="warning" size="sm" @click="getOrdersHandler">Загрузить</AppButton>
    </div>
    <!-- Модальное окно -->
    <div
      v-if="openModal"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg w-[420px] p-5 relative shadow-lg"
        @click.stop
      >
        <h2 class="text-base font-semibold mb-3">Добавить элемент</h2>

        <!-- Форма -->
        <form @submit.prevent class="space-y-3">
          <!-- Тип -->
          <div>
            <label class="block text-sm font-medium mb-1">Тип</label>
            <select
              v-model="form.type"
              class="border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="components">Комплектующие</option>
              <option value="services">Услуги</option>
            </select>
          </div>

          <!-- Название + автоподсказки -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              v-model="form.name"
              @input="filterSuggestions"
              @focus="showSuggestions = true"
              class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название"
            />
            <ul
              v-if="showSuggestions && filteredSuggestions.length"
              class="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 shadow max-h-36 overflow-y-auto text-sm"
            >
              <li
                v-for="(item, index) in filteredSuggestions"
                :key="index"
                class="px-3 py-1.5 hover:bg-blue-100 cursor-pointer"
                @click="selectSuggestion(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Цена и количество -->
          <div class="grid grid-cols-2 gap-3">
            <label class="block text-sm">
              <span class="font-medium">Цена</span>
              <input
                type="number"
                v-model.number="form.price"
                min="0"
                class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label class="block text-sm">
              <span class="font-medium">Количество</span>
              <input
                type="number"
                v-model.number="form.quantity"
                min="1"
                class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <!-- Кнопки -->
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              @click="addItem"
            >
              Добавить
            </button>
            <button
              type="button"
              class="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
              @click="closeModal"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useOrdersStore } from "@/stores/useOrdersStore";
import AppButton from '@/components/ui/AppButton.vue'
import OrdersListBlock from './OrdersListBlock.vue'
import { formatRub } from '../../utils/calcSum.js'
import { openPrintWindow } from '../../utils/printUtils.js'

const emit = defineEmits(['createRow'])

const openModal = ref(false)
const showSuggestions = ref(false)

const form = reactive({
  type: 'services',
  name: '',
  price: 0,
  quantity: 1,
})

// Разные подсказки для разных типов
const suggestionSets = {
  components: [
    'Подоконник пластиковый белый 150 мм',
    'Водоотив белый',
    'Крыша балкона из поликарбоната',
    'Арочный козырек',
    'Стеклопакет 4-16-4 (24 мм)',
  ],
  services: [
    'Доставка по городу',
    'Монтаж окон',
    'Упаковка в пленку, картон',
    'Выезд замерщика',
    'Подъем на этаж',
    'Установка водоотливов',
    'Установка подоконников',
    'Установка стеклопакетов',
    'Вынос мусора',
  ],
}

const filteredSuggestions = ref([])

const filterSuggestions = () => {
  const query = form.name.toLowerCase().trim()
  if (!query) {
    filteredSuggestions.value = []
    return
  }

  const list = suggestionSets[form.type] || []
  filteredSuggestions.value = list.filter((item) => item.toLowerCase().includes(query))
}

const selectSuggestion = (item) => {
  form.name = item
  showSuggestions.value = false
  filteredSuggestions.value = []
}

const addItem = () => {
  if (!form.name || form.price <= 0 || form.quantity <= 0) {
    alert('Заполните все поля корректно')
    return
  }

  const payload = { ...form }
  emit('createRow', payload)

  // Очистка
  form.name = ''
  form.price = 0
  form.quantity = 1
  showSuggestions.value = false
  openModal.value = false
}

const closeModal = () => {
  openModal.value = false
  showSuggestions.value = false
}

const ordersStore = useOrdersStore();
const orders = computed(() => ordersStore.orders);
const { order, setTableData, savePage, fetchOrders, removePage, updatePage } = ordersStore;

// Print
const printPage = async () => {
  await openPrintWindow(order.total.name)
}

function savePageHandler(){
  setTableData();

  if(order.id === '')
    savePage();
  else
    updatePage();
}

function getOrdersHandler (){
  fetchOrders();
}

function handleDeleteOrder(orderId) {
  removePage(orderId)
}

function handleSelectOrder(order) {
  if (!order) return

  // Преобразуем tableData
  const tableData = (order.tableData || []).map(block => {
    return {
      ...block,
      options: (block.options || []).map(opt => [
        opt.name || '',
        typeof opt.price === 'string' ? opt.price : formatRub(opt.price),
        opt.quantity || 0,
        typeof opt.total === 'string' ? opt.total : formatRub(opt.total)
      ]),
      price: (block.price || []).map(p => [
        p.price || 0,
        p.quantity || 0,
        p.total || 0
      ]),
    }
  })

  ordersStore.order.tableData.splice(
    0,
    ordersStore.order.tableData.length,
    ...tableData
  )

  ordersStore.order.id = order.id || ''
  ordersStore.order.user = { ...order.user }
  ordersStore.order.total = { ...order.total }
  ordersStore.order.percent = { ...order.percent }
}

</script>

<style scoped>
/* чтобы выпадающий список был поверх всего */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: #bdbdbd;
  border-radius: 10px;
}
</style>
