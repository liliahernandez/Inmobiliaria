import { createRouter, createWebHistory } from 'vue-router'
import Multas from '../views/Multas.vue'
import Usuarios from '../views/Usuarios.vue'
import Configuracion from '../views/Configuracion.vue'

const routes = [
  { path: '/', name: 'Multas', component: Multas },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios },
  { path: '/configuracion', name: 'Configuracion', component: Configuracion }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router