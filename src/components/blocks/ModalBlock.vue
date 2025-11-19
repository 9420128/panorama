<template>
	<div
			v-if="open"
			class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
			@click="close"
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
							v-model="localForm.type"
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
							v-model="localForm.name"
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
								:key="item.id || index"
								class="px-3 py-1.5 hover:bg-blue-100 cursor-pointer flex items-center justify-between"
						>
							<span class="w-full" @click="selectSuggestion(item)">{{ item.name }}</span>
							<button
									@click.stop="removeSuggestionItem(item.id)"
									class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
									title="Удалить элемент"
									:disabled="loadingStore.is(`remove-${localForm.type}`)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3 h-3">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						</li>
					</ul>
				</div>

				<!-- Цена и количество -->
				<div class="grid grid-cols-2 gap-3">
					<label class="block text-sm">
						<span class="font-medium">Цена</span>
						<input
								type="tel"
								v-model.number="localForm.price"
								min="0"
								ref="priceInput"
								class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
						/>
					</label>

					<label class="block text-sm">
						<span class="font-medium">Количество</span>
						<input
								type="tel"
								v-model.number="localForm.quantity"
								min="1"
								class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
						/>
					</label>
				</div>

				<!-- Кнопки -->
				<div class="flex justify-between gap-2 pt-2">
					<AppButton
							variant="primary"
							size="sm"
							@click="saveSuggestion"
							:disabled="loadingStore.is(`add-${localForm.type}`)"
					>
						{{ loadingStore.is(`add-${localForm.type}`) ? 'Сохранение...' : 'Сохранить' }}
					</AppButton>
					<div class="flex gap-2">
						<AppButton variant="success" size="sm" @click="submit">Добавить</AppButton>
						<AppButton variant="" size="sm" @click="close">Отмена</AppButton>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { addSuggestion, getSuggestions, removeSuggestion } from '@/firebase/firebaseService.js'
import AppButton from '@/components/ui/AppButton.vue'
import { useLoadingStore } from '@/stores/useLoadingStore.js'

const loadingStore = useLoadingStore()
const suggestions = ref({ components: [], services: [] })
const showSuggestions = ref(false)
const priceInput = ref(null)

// Props
const props = defineProps({
	open: Boolean,
})

// Emits
const emit = defineEmits(['update:open', 'add-item'])

// Локальная форма
const localForm = reactive({
	type: 'services',
	name: '',
	price: 0,
	quantity: 1,
})

// Получение suggestions при монтировании
onMounted(async () => {
	const data = await getSuggestions()
	suggestions.value.components = data.components
	suggestions.value.services = data.services
})

// Фильтр подсказок
const filteredSuggestions = computed(() => {
	if (!localForm.name) return []
	return (suggestions.value[localForm.type] || []).filter(item =>
			item.name.toLowerCase().includes(localForm.name.toLowerCase())
	)
})

// Методы
function close() {
	emit('update:open', false)
}

function selectSuggestion(item) {
	localForm.name = item.name
	localForm.price = item.price
	showSuggestions.value = false

	nextTick(() => {
		if (priceInput.value) {
			priceInput.value.focus()
			priceInput.value.select()
		}
	})
}

function submit() {
	emit('add-item', { ...localForm })
	close()
}

async function saveSuggestion() {
	const key = `add-${localForm.type}`
	loadingStore.start(key)

	try {
		const item = await addSuggestion(localForm.type, {
			name: localForm.name,
			price: localForm.price
		})
		if (item) {
			suggestions.value[localForm.type].push(item)
		}
	} finally {
		loadingStore.stop(key)
	}
}

async function removeSuggestionItem(id) {
	const key = `remove-${localForm.type}`
	loadingStore.start(key)

	try {
		const ok = await removeSuggestion(localForm.type, id)
		if (ok) {
			suggestions.value[localForm.type] =
					suggestions.value[localForm.type].filter(item => item.id !== id)
		}
	} finally {
		loadingStore.stop(key)
	}
}
</script>
