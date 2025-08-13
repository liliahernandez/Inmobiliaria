<template>
  <div class="multas-bg">
    <main class="glass-main">
      <div class="header">
        <h1>Registro de Multas</h1>
      </div>
      
      <div class="glass-card fines-card">
        <h3>
          <i class="fa-solid fa-pen-to-square icon"></i>
          Registro de Multas
        </h3>
        <form @submit.prevent="guardarMulta">
          <div class="input-group">
            <label for="nombre">Nombre del residente</label>
            <input type="text" id="nombre" v-model="nombre" required />
          </div>
          <div class="input-group">
            <label for="motivo">Motivo</label>
            <input type="text" id="motivo" v-model="motivo" required />
          </div>
          <div class="input-group">
            <label for="monto">Monto</label>
            <input type="number" id="monto" v-model="monto" required />
          </div>
          <div class="input-group">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" v-model="fecha" required />
          </div>
          <button type="submit" :disabled="cargando" class="save-button">
            {{ cargando ? 'Guardando...' : 'Guardar multa' }}
          </button>
        </form>
      </div>
      
      <div v-if="multas.length" class="glass-card list-container">
        <h4>Multas Registradas</h4>
        <div class="list">
          <div class="item" v-for="multa in multas" :key="multa.id">
            <div class="icon">⚠️</div>
            <div class="info">
              <div class="nombre">{{ multa.nombre_residente }}</div>
              <div class="detalle">{{ multa.motivo }} • ${{ multa.monto }} • {{ multa.fecha }}</div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="mensaje">🚫 No hay multas registradas por el momento.</p>
    </main>
    
    <transition name="modal-fade">
      <div v-if="mostrarModal" :class="['modal', tipoModal]">{{ mensajeModal }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue' // Se importa 'inject'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const emitter = inject('emitter') // Se inyecta la instancia del bus de eventos

const nombre = ref('')
const motivo = ref('')
const monto = ref('')
const fecha = ref('')
const cargando = ref(false)

const mostrarModal = ref(false)
const mensajeModal = ref('')
const tipoModal = ref('success')

const multas = ref([])

const fetchMultas = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/api/multas', {
      headers: { Authorization: `Bearer ${token}` }
    })
    multas.value = response.data
  } catch (error) {
    console.error('Error al obtener multas:', error)
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarMulta = async () => {
  cargando.value = true
  try {
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:8000/api/multas', {
      nombre_residente: nombre.value,
      motivo: motivo.value,
      monto: monto.value,
      fecha: fecha.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mensajeModal.value = '✅ Multa registrada exitosamente.'
    tipoModal.value = 'success'
    mostrarModal.value = true
    nombre.value = ''
    motivo.value = ''
    monto.value = ''
    fecha.value = ''
    await fetchMultas() // Asegura que la lista de multas se actualice localmente

    // Emitir el evento para notificar que una nueva multa ha sido registrada
    emitter.emit('new-multa-registered') // Se emite el evento 'new-multa-registered'

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
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
  } else {
    fetchMultas()
    // La actualización en tiempo real se manejará por el bus de eventos
    // setInterval(fetchMultas, 5000) // Esta línea ya no es necesaria y se puede comentar o eliminar
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.multas-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.multas-bg::before, .multas-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 1;
  animation: float 10s ease-in-out infinite alternate;
}
.multas-bg::before {
  width: 500px;
  height: 500px;
  left: -150px;
  top: -120px;
  background: #38bdf8;
  animation-delay: 0s;
}
.multas-bg::after {
  width: 400px;
  height: 400px;
  right: -120px;
  bottom: -100px;
  background: #6366f1;
  animation-delay: 2s;
}
@keyframes float {
  0% { transform: translateY(0) scale(1);}
  100% { transform: translateY(40px) scale(1.08);}
}

.glass-main {
  flex-grow: 1;
  padding: 2.5rem 4vw;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  font-family: 'Poppins', sans-serif;
  max-width: 800px;
  margin: 40px auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px #fff4;
}

.glass-card {
  background: rgba(255,255,255,0.30);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border-radius: 22px;
  border: 1.5px solid rgba(255,255,255,0.30);
  box-shadow: 0 8px 32px rgba(60,60,120,0.13);
  padding: 2.2rem 2rem;
  margin-bottom: 2.5rem;
  position: relative;
}

.fines-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.fines-card h3 .icon {
  color: #6366f1;
  font-size: 1.3em;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.85rem 1.1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 1rem;
  background: rgba(255,255,255,0.70);
  color: #334155;
  transition: border-color 0.3s, background 0.3s;
  box-shadow: 0 1px 4px #0001;
}

.input-group input:focus {
  outline: none;
  border-color: #38bdf8;
  background: #fff;
}

.save-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #38bdf8 60%, #6366f1 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
}

.save-button:hover {
  background: linear-gradient(90deg, #0ea5e9 60%, #4338ca 100%);
}

.save-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.list-container {
  margin-top: 2rem;
}

.list-container h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: flex-start;
  background: rgba(236, 245, 255, 0.7);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px #0001;
}

.item .icon {
  font-size: 1.8rem;
  margin-right: 1rem;
  color: #e53e3e;
}

.item .info {
  flex: 1;
}

.item .nombre {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d3748;
}

.item .detalle {
  font-size: 0.98rem;
  color: #64748b;
}

.mensaje {
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
  color: #a0aec0;
}

.modal {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: bold;
  color: #fff;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.modal.success {
  background: linear-gradient(90deg, #48bb78 60%, #38bdf8 100%);
}
.modal.error {
  background: linear-gradient(90deg, #e53e3e 60%, #fbbf24 100%);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-30px);
}
</style>
