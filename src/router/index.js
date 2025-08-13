import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Login from '../views/Login.vue'
import Multas from '../views/Multas.vue'
import Usuarios from '../views/Usuarios.vue'
import Configuracion from '../views/Configuracion.vue'
import CambiarPassword from '../views/CambiarPassword.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  // Rutas protegidas (requieren autenticación y rol)
  { path: '/multas', name: 'Multas', component: Multas, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/configuracion', name: 'Configuracion', component: Configuracion, meta: { requiresAuth: true, roles: ['user'] } },
  { path: '/cambiar-password', name: 'CambiarPassword', component: CambiarPassword, meta: { requiresAuth: true, roles: ['user', 'admin'] } },
  { path: '/inicio', name: 'Home', component: Home, meta: { requiresAuth: true, roles: ['user', 'admin'] } },
  // Rutas públicas
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Middleware de protección de rutas
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const userRolesString = localStorage.getItem('roles')
  let userRoles = []

  try {
    if (userRolesString) {
      userRoles = JSON.parse(userRolesString)
      if (!Array.isArray(userRoles)) {
        userRoles = [userRoles]
      }
    }
  } catch (e) {
    localStorage.removeItem('roles')
    userRoles = []
  }

  if (to.meta.requiresAuth) {
    if (!token) {
      localStorage.removeItem('token')
      localStorage.removeItem('roles')
      return next('/')
    }
    try {
      // Validar token con el backend
      await axios.get('http://localhost:8000/api/check-session', {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Validar roles
      if (to.meta.roles && to.meta.roles.length > 0) {
        const hasRequiredRole = to.meta.roles.some(role => userRoles.includes(role))
        if (!hasRequiredRole) {
          alert('Acceso denegado. No tienes los permisos necesarios.')
          localStorage.removeItem('token')
          localStorage.removeItem('roles')
          return next('/')
        }
      }
      next()
    } catch (error) {
      // Token inválido o sesión expirada
      localStorage.removeItem('token')
      localStorage.removeItem('roles')
      return next('/')
    }
  } else {
    next()
  }
})

export default router