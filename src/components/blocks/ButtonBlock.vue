<template>
  <div class="no-print">
    <OrdersListBlock v-if="Array.isArray(orders)" :orders="orders" @selectOrder="handleSelectOrder" @deleteOrder="handleDeleteOrder" />
    <div class="flex flex-wrap justify-center gap-2 mb-3">
      <AppButton variant="success" size="sm" @click.stop="openModal = true">Добавить</AppButton>
      <AppButton variant="primary" size="sm" @click="printPage">Печать / PDF</AppButton>
      <AppButton variant="danger" size="sm" @click="savePageHandler">Сохранить</AppButton>
      <AppButton variant="warning" size="sm" @click="getOrdersHandler">Загрузить</AppButton>
    </div>
    <!-- Модальное окно -->
	  <ModalBlock
			  :open="openModal"
			  @update:open="openModal = $event"
			  @add-item="addItem"
	  />
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useOrdersStore } from "@/stores/useOrdersStore";
import AppButton from '@/components/ui/AppButton.vue'
import OrdersListBlock from './OrdersListBlock.vue'
import { formatRub } from '../../utils/calcSum.js'
import { openPrintWindow } from '../../utils/printUtils.js'
import ModalBlock from '@/components/blocks/ModalBlock.vue'

const emit = defineEmits(['createRow'])

const openModal = ref(false)
const orderId = ref(null);



const addItem = (form) => {
  if (!form.name || form.price <= 0 || form.quantity <= 0) {
    alert('Заполните все поля корректно')
    return
  }

  const payload = { ...form }
  emit('createRow', payload)

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

  if(!orderId.value)
    savePage();
  else
    updatePage(orderId.value);
}

function getOrdersHandler (){
  fetchOrders();
}

function handleDeleteOrder(orderId) {
  removePage(orderId)
}

function handleSelectOrder(order) {
  if (!order) return
	orderId.value = order.id;

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
