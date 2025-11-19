<template>
	<div class="mt-2 no-print">
		<AppButton variant="" @click="signOutUser">Выйти мз приложения</AppButton>
	</div>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth"
import { ref } from "vue"
import AppButton from '@/components/ui/AppButton.vue'

const auth = getAuth()
const isLoading = ref(false)

const signOutUser = async () => {
	if (isLoading.value) return
	isLoading.value = true
	try {
		await signOut(auth)
		alert("Вы успешно вышли!")
		// здесь можно редиректить на страницу входа
		// например: router.push('/login')
	} catch (err) {
		console.error("Ошибка выхода:", err)
		alert("Не удалось выйти")
	} finally {
		isLoading.value = false
	}
}
</script>