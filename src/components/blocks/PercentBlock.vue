<template>
  <h2 class="text-xl font-bold mb-4 mt-4 no-print">📄 Проценты</h2>
  <div class="flex flex-wrap gap-2 m-3 justify-center">
    <AppInput label="Юниты" type="tel" v-model.number="orderStore.order.percent.units" />
    <AppInput label="Компоненты" type="tel" v-model.number="orderStore.order.percent.components" />
    <AppInput label="Услуги" type="tel" v-model.number="orderStore.order.percent.services" />
    <AppButton variant="success" size="sm" @click="$emit('calculateSum')">Рассчитать</AppButton>
    <AppButton variant="" size="sm" @click="resetPercent">Сбросить</AppButton>
  </div>
</template>

<script setup>
import { useOrdersStore } from '@/stores/useOrdersStore'
import { watch } from 'vue'
import AppButton from '../ui/AppButton.vue'
import AppInput from '../ui/AppInput.vue'

const emits = defineEmits(['calculateSum'])
const orderStore = useOrdersStore()

const resetPercent = () => {
	orderStore.order.percent.units = 0
	orderStore.order.percent.components = 0
	orderStore.order.percent.services = 0
}

watch(
	() => orderStore.order.percent,
	() => {
		emits('calculateSum')
	},
	{ deep: true, immediate: true }
)
</script>
