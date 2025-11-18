<template>
  <h3 class="font-bold text-center text-[18px]">{{ orderStore.order.total.name }}</h3>
  <div class="space-y-3 text-gray-800 text-sm w-full mt-4">
    <div class="flex items-center gap-4">
      <!-- Заказчик -->
      <label class="flex-1 flex items-center gap-2">
        <span class="min-w-[80px] font-medium">Заказчик:</span>
        <div
          v-if="printStore.isPrinting"
          class="border-0 border-b border-gray-400 flex-1"
        >
          {{ orderStore.order.user.client }}
        </div>
        <input
          v-else
          v-model="orderStore.order.user.client"
          type="text"
          class="flex-1 border-0 border-b border-gray-400 focus:border-blue-500 focus:ring-0 outline-none text-gray-700 bg-transparent"
        />
      </label>

      <!-- Телефон -->
      <label class="flex-1 flex items-center gap-2">
        <span class="min-w-[70px] font-medium">Телефон:</span>
        <div
          v-if="printStore.isPrinting"
          class="border-0 border-b border-gray-400 flex-1"
        >
          {{ orderStore.order.user.phone }}
        </div>
        <input
          v-else
          v-model="orderStore.order.user.phone"
          type="tel"
          class="flex-1 border-0 border-b border-gray-400 focus:border-blue-500 focus:ring-0 outline-none text-gray-700 bg-transparent"
        />
      </label>
    </div>

    <!-- Адрес -->
    <label class="flex items-center gap-2 w-full">
      <span class="min-w-[80px] font-medium">Адрес:</span>
      <div
        v-if="printStore.isPrinting"
        class="border-0 border-b border-gray-400 flex-1"
      >
        {{ orderStore.order.user.address }}
      </div>
      <input
        v-else
        v-model="orderStore.order.user.address"
        type="text"
        class="w-full border-0 border-b border-gray-400 focus:border-blue-500 focus:ring-0 outline-none text-gray-700 bg-transparent"
      />
    </label>

    <!-- Менеджер -->
    <div class="flex items-center gap-2 mb-4">
      <span class="min-w-[80px] font-medium">Менеджер:</span>
      <span class="font-semibold text-gray-900">Евгений К</span>
    </div>
  </div>
</template>

<script setup>
import { usePrintStore } from '@/stores/usePrintStore'
import { useOrdersStore } from '@/stores/useOrdersStore'

const printStore = usePrintStore()
const orderStore = useOrdersStore()
</script>
