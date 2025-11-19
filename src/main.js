import { createApp } from 'vue'
import './style.css'
import './index.css'
import App from './App.vue'
import clickOutside from './directives/click-outside.js'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'

const app = createApp(App)

// app.directive('click-outside', clickOutside)
app.use(createPinia())

const authStore = useAuthStore()

// ЖДЁМ восстановление авторизации → потом монтируем приложение
authStore.initAuth().then(() => {
  app.mount('#app')
})