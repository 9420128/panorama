import { createApp } from 'vue'
import './style.css'
import './index.css'
import App from './App.vue'
import clickOutside from './directives/click-outside.js'
import { createPinia } from 'pinia'

const app = createApp(App)

// app.directive('click-outside', clickOutside)
app.use(createPinia())

app.mount('#app')