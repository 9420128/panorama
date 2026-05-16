<template>
  <!-- Секция процентов -->
  <h2 class="text-xl font-bold mt-1 no-print">📄 Проценты</h2>
  <div class="flex flex-wrap gap-2 m-3 justify-center">
    <AppInput label="Юниты" type="tel" v-model.number="orderStore.order.percent.units" />
    <AppInput label="Компоненты" type="tel" v-model.number="orderStore.order.percent.components" />
    <AppInput label="Услуги" type="tel" v-model.number="orderStore.order.percent.services" />
    <AppButton variant="success" size="sm" @click="emit('calculateSum')">Рассчитать</AppButton>
    <AppButton variant="" size="sm" @click="resetSection('percent')">Сбросить</AppButton>
  </div>

  <!-- Секция скидок -->
  <h2 class="text-xl font-bold mt-1 no-print">📄 Скидки</h2>
  <div class="flex flex-wrap gap-2 m-3 justify-center">
    <AppInput label="Юниты" type="tel" v-model.number="orderStore.order.sales.units" />
    <AppInput label="Компоненты" type="tel" v-model.number="orderStore.order.sales.components" />
    <AppInput label="Услуги" type="tel" v-model.number="orderStore.order.sales.services" />
    <AppButton variant="success" size="sm" @click="emit('calculateSum')">Рассчитать</AppButton>
    <AppButton variant="" size="sm" @click="resetSection('sales')">Сбросить</AppButton>
  </div>
</template>

<script setup>
import { useOrdersStore } from '@/stores/useOrdersStore'
import { watch } from 'vue'
import AppButton from '../ui/AppButton.vue'
import AppInput from '../ui/AppInput.vue'

// Инициализация
const emit = defineEmits(['calculateSum'])
const orderStore = useOrdersStore()

// Раздельный сброс для каждой секции
const resetSection = (type) => {
  const target = orderStore.order[type]
  if (target) {
    target.units = 0
    target.components = 0
    target.services = 0
  }
}

// Отслеживание изменений (без immediate во избежание лишних вызовов при старте)
watch(
  () => [orderStore.order.percent, orderStore.order.sales],
  () => emit('calculateSum'),
  { deep: true }
)
</script>
