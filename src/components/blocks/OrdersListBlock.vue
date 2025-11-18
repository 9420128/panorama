<template>
  <div class="space-y-2 mb-5">
    <div
      v-for="(order, index) in orders"
      :key="order.id || index"
      class="p-1 border rounded cursor-pointer flex justify-between items-center"
      :class="order.id === selectedOrderId ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'"
    >
      <div @click="selectOrder(order)" class="flex-1">
        <div class="font-bold text-sm">{{ order.total.name }}</div>
        <div class="text-xs text-gray-600">{{ order.user.address || 'Адрес не указан' }}</div>
      </div>
      <button
        @click.stop="deleteOrder(order.id)"
        class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
        title="Удалить заказ"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'

const selectedOrderId = ref(null)

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selectOrder', 'deleteOrder'])

function selectOrder(order) {
  selectedOrderId.value = order.id
  emit('selectOrder', order)
}

function deleteOrder(order) {
  emit('deleteOrder', order)
}
</script>

<style scoped>
/* можно добавить плавное выделение при наведении */
</style>
