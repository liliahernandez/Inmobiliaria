<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import NotificacionCampana from './components/NotificacionCampana.vue'
import { ref, computed, watchEffect } from 'vue'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(localStorage.getItem('token') !== null)

// Computar si se muestra el header (solo cuando no estamos en login)
const mostrarHeader = computed(() => {
  return route.path !== '/' && route.path !== '/login'
})

// Función para cerrar sesión
const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('roles')
  isLoggedIn.value = false
  router.push('/')
}

// Reactividad al cambiar el token
watchEffect(() => {
  isLoggedIn.value = localStorage.getItem('token') !== null
})
</script>

<template>
  <div>
    <header v-if="mostrarHeader" class="navbar">
      <nav class="nav-links">
        <RouterLink to="/inicio">Inicio</RouterLink>
        <RouterLink to="/multas">Multas</RouterLink>
        <RouterLink to="/usuarios">Usuarios</RouterLink>
        <RouterLink to="/configuracion">Configuración</RouterLink>
        <RouterLink to="/cambiar-password">Cambiar Contraseña</RouterLink>
      </nav>

      <div class="header-right">
        <!-- 👇 Aquí se pasa la prop isLoggedIn a NotificacionCampana -->
        <NotificacionCampana :isLoggedIn="isLoggedIn" /> 
        <button v-if="isLoggedIn" @click="cerrarSesion" class="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(51, 51, 51, 0.92);
  color: white;
  padding: 1rem 2vw;
  box-shadow: 0 4px 24px rgba(60,60,120,0.10);
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-links a {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.3s, color 0.3s;
}

.nav-links a.router-link-exact-active,
.nav-links a.router-link-active {
  background: linear-gradient(90deg, #38bdf8 60%, #6366f1 100%);
  color: #fff;
}

.nav-links a:hover {
  background: #555;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: linear-gradient(90deg, #e53e3e 60%, #fbbf24 100%);
  border: none;
  color: #fff;
  padding: 0.5rem 1.1rem;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: background 0.3s, color 0.3s;
  box-shadow: 0 2px 8px rgba(229,62,62,0.10);
}

.logout-btn:hover {
  background: linear-gradient(90deg, #c53030 60%, #f59e42 100%);
  color: #fff;
}
</style>
