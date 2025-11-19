<template>
	<div class="p-4 max-w-sm mx-auto mt-10 border border-gray-300 rounded-md">
		<h2 class="text-lg font-bold mb-4">Вход в систему</h2>
		<form @submit.prevent="handleLogin" class="space-y-3">
			<div>
				<label class="text-gray-700 text-sm font-medium">Email</label>
				<input v-model="email" type="email" class="w-full border border-gray-300 rounded-md px-1.5 py-1.5 text-sm" />
			</div>
			<div class="mb-5">
				<label class="text-gray-700 text-sm font-medium">Пароль</label>
				<input v-model="password" type="password" class="w-full border border-gray-300 rounded-md px-1.5 py-1.5 text-sm" />
			</div>
			<AppButton type="submit" :disabled="authStore.loading">
				{{ authStore.loading ? 'Вход...' : 'Войти' }}
			</AppButton>
		</form>
		<p v-if="authStore.error" class="text-red-500 mt-2">{{ authStore.error }}</p>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import AppButton from '@/components/ui/AppButton.vue'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

async function handleLogin() {
	await authStore.login(email.value, password.value)
}
</script>
