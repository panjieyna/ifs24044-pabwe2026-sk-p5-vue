import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'
import App from './App.vue'
import { createAppRouter } from './router.js'

createApp(App).use(createPinia()).use(createAppRouter()).mount('#app')
