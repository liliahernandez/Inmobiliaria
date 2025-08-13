import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt' // Se importa mitt

// 👇 Importa el interceptor de autenticación
import { setupAuthInterceptor } from './utils/authInterceptor'

// 👇 Activa el interceptor antes de montar la app
setupAuthInterceptor()

const app = createApp(App)

const emitter = mitt() // Se crea una instancia del bus de eventos
app.provide('emitter', emitter) // Se hace el emitter accesible globalmente en la app

app.use(router)
app.mount('#app')
