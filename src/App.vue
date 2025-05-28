<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Multas from './components/Multas.vue'
</script>

<template>
  <div class="app-container">
    <h1 class="title">Multas de Residentes</h1>
    <div class="card">
      <Multas />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 1rem;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 700px;
}
</style>