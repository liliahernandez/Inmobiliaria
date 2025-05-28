<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const multas = ref([])

const fetchMultas = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/multas')
    multas.value = response.data
  } catch (error) {
    console.error('Error al obtener multas:', error)
  }
}

onMounted(() => {
  fetchMultas()
  setInterval(fetchMultas, 5000)
})
</script>

<template>
  <div class="main-container">
    <h1 class="title">📌 Registro de Multas</h1>
    <div v-if="multas.length" class="list">
      <div class="item" v-for="multa in multas" :key="multa.id">
        <div class="icon">⚠️</div>
        <div class="info">
          <div class="nombre">{{ multa.nombre_residente }}</div>
          <div class="detalle">{{ multa.motivo }} • ${{ multa.monto }} • {{ multa.fecha }}</div>
        </div>
      </div>
    </div>
    <p v-else class="mensaje">🚫 No hay multas registradas por el momento.</p>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #1e1e2f;
  border-radius: 12px;
  color: #f0f0f0;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #90caf9;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: flex-start;
  background: #2c2c3f;
  padding: 1rem;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.item:hover {
  background: #34344a;
}

.icon {
  font-size: 1.8rem;
  margin-right: 1rem;
}

.info {
  flex: 1;
}

.nombre {
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffffff;
}

.detalle {
  font-size: 0.95rem;
  color: #cccccc;
}

.mensaje {
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
  color: #aaa;
}
</style>
