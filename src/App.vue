<script setup>
import { RouterView, RouterLink } from 'vue-router'
import NotificacionCampana from './components/NotificacionCampana.vue'
</script>

<template>
  <div>
    <header class="navbar">
      <nav class="nav-links">
        <RouterLink to="/">Multas</RouterLink>
        <RouterLink to="/usuarios">Usuarios</RouterLink>
        <RouterLink to="/configuracion">Configuración</RouterLink>
      </nav>
      <NotificacionCampana />
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
  background-color: #333;
  color: white;
  padding: 1rem;
}
.nav-links a {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
}
</style>