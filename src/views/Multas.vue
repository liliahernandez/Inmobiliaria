<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Variables del formulario
const nombre = ref('')
const motivo = ref('')
const monto = ref('')
const fecha = ref('')
const cargando = ref(false)

// Modal y estado de respuesta
const mostrarModal = ref(false)
const mensajeModal = ref('')
const tipoModal = ref('success')

// Listado de multas
const multas = ref([])

// Cargar multas
const fetchMultas = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/multas')
    multas.value = response.data
  } catch (error) {
    console.error('Error al obtener multas:', error)
  }
}

// Cerrar modal
const cerrarModal = () => {
  mostrarModal.value = false
}

// Guardar multa
const guardarMulta = async () => {
  cargando.value = true
  try {
    const response = await axios.post('http://localhost:8000/api/multas', {
      nombre_residente: nombre.value,
      motivo: motivo.value,
      monto: monto.value,
      fecha: fecha.value
    })

    mensajeModal.value = '✅ Multa registrada exitosamente.'
    tipoModal.value = 'success'
    mostrarModal.value = true

    // Reset campos
    nombre.value = ''
    motivo.value = ''
    monto.value = ''
    fecha.value = ''
    fetchMultas()
  } catch (error) {
    mensajeModal.value = '❌ Ocurrió un error al guardar.'
    tipoModal.value = 'error'
    mostrarModal.value = true
    console.error(error)
  } finally {
    cargando.value = false
    setTimeout(() => cerrarModal(), 3000)
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

    <!-- FORMULARIO -->
    <div class="formulario">
      <label>
        <span>👤 Nombre del residente</span>
        <input v-model="nombre" type="text" />
      </label>

      <label>
        <span>✏️ Motivo</span>
        <input v-model="motivo" type="text" />
      </label>

      <label>
        <span>💰 Monto</span>
        <input v-model="monto" type="number" />
      </label>

      <label>
        <span>📅 Fecha</span>
        <input v-model="fecha" type="date" />
      </label>

      <button @click="guardarMulta" :disabled="cargando">
        <transition name="fade">
          <span v-if="!cargando">💾 Guardar multa</span>
          <span v-else>⏳ Guardando...</span>
        </transition>
      </button>
    </div>

    <!-- MODAL CON TRANSICIÓN -->
    <transition name="modal-fade">
      <div v-if="mostrarModal" :class="['modal', tipoModal]">
        {{ mensajeModal }}
      </div>
    </transition>

    <!-- LISTADO -->
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
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #90caf9;
}

.formulario {
  background: #2c2c3f;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.formulario label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #d4d4d4;
}

.formulario input {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: none;
  margin-top: 0.3rem;
  font-size: 1rem;
  background-color: #f5f5f5;
  color: #333;
}

.formulario input:focus {
  outline: 2px solid #6c63ff;
  background-color: #fff;
}

.formulario button {
  background-color: #6c63ff;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.formulario button:hover {
  background-color: #5848c2;
}

.formulario button[disabled] {
  background-color: #aaa;
  cursor: not-allowed;
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

/* Modal de resultado */
.modal {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  color: #fff;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.modal.success {
  background-color: #28a745;
}

.modal.error {
  background-color: #dc3545;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
