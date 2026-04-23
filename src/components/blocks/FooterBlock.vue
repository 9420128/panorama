<template>
  <div class="text-[14px]">
    <p class="mb-2 color-black">
      Внимательно проверяйте размеры, цвет изделий, сторону открывания, комплектацию заказа. После
      подписания КП в работу претензии по вышеуказанным параметрам приниматься не будут, так как КП
      будет считаться согласованным.
    </p>
    <label
      class="flex-1 flex items-start gap-2 mb-2"
      :class="{ 'bg-gray-200 px-2 py-1 border border-gray-300': orderStore.order.user.comment?.trim() }"
    >
      <span class="font-bold">Примечание:</span>
      <div
        v-if="printStore.isPrinting"
        class="flex-1 whitespace-pre-line"
      >
        {{ orderStore.order.user.comment }}
      </div>
      <textarea
        v-else
        v-model="orderStore.order.user.comment"
        type="text"
        class="flex-1 focus:border-blue-500 focus:ring-0 outline-none text-gray-700 bg-transparent"
      />
    </label>
    <p v-if="total.units" class="font-bold">Общая площадь заказа: {{ total.units }} кв.м.</p>
    <p v-if="total.qty" class="font-bold">Количество изделий: {{ total.qty }} шт.</p>
  </div>
  <div
    class="order-total border-t-4 border-gray-800 mt-4 mb-3 pt-2 text-[18px] font-semibold text-gray-900"
  >
    Итого стоимость заказа:
    <span class="font-bold">{{ total.sum }}</span> рублей
  </div>
  <p>
    <i class="font-bold text-[10]"
      >Цена действительна на момент предоставления коммерческого предложения</i
    >
  </p>

  <div class="flex items-center gap-8 mt-8 mb-5">
    <div class="flex-1 flex items-center gap-2">
      <span class="min-w-[80px] font-medium">Продавец:</span>
      <div class="flex-1 border-0 border-b border-gray-400">Евгений К</div>
    </div>

    <div class="flex-1 flex items-center gap-2">
      <span class="min-w-[80px] font-medium">Покупатель:</span>
      <div class="flex-1 border-0 border-b border-gray-400">&nbsp;</div>
    </div>
  </div>
</template>
<script setup>
import { usePrintStore } from '@/stores/usePrintStore'
import { useOrdersStore } from '@/stores/useOrdersStore'

const printStore = usePrintStore()
const orderStore = useOrdersStore()
const total = orderStore.order.total
</script>
