<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
	  <LoginBlock v-if="!authStore.user" />
    <Index v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import Index from './components/Index.vue'
import LoginBlock from '@/components/blocks/LoginBlock.vue'

const authStore = useAuthStore()
</script>
