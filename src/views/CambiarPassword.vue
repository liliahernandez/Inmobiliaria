<template>
  <div class="cambiar-bg">
    <div class="glass-card cambiar-card">
      <h2>🔐 Cambiar Contraseña</h2>
      <form @submit.prevent="handleCambio">
        <label>
          Contraseña actual
          <input v-model="actual" type="password" required />
        </label>

        <label>
          Nueva contraseña
          <input v-model="nueva" type="password" required />
        </label>

        <label>
          Confirmar nueva contraseña
          <input v-model="confirmacion" type="password" required />
        </label>

        <button :disabled="cargando">
          {{ cargando ? "Guardando..." : "Actualizar Contraseña" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="exito" class="exito">{{ exito }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const actual = ref('')
const nueva = ref('')
const confirmacion = ref('')
const cargando = ref(false)
const error = ref('')
const exito = ref('')

const handleCambio = async () => {
  cargando.value = true
  error.value = ''
  exito.value = ''

  try {
    const token = localStorage.getItem('token')

    await axios.post('http://localhost:8000/api/cambiar-password', {
      password_actual: actual.value,
      nueva_password: nueva.value,
      nueva_password_confirmation: confirmacion.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    exito.value = '✅ Contraseña actualizada y sesiones cerradas.'

    // Eliminar token y redirigir inmediatamente al login
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
    router.push('/login')

  } catch (e) {
    error.value = e.response?.data?.message || 'Error al cambiar contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.cambiar-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.cambiar-bg::before, .cambiar-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 1;
  animation: float 10s ease-in-out infinite alternate;
}
.cambiar-bg::before {
  width: 350px;
  height: 350px;
  left: -100px;
  top: -80px;
  background: #38bdf8;
  animation-delay: 0s;
}
.cambiar-bg::after {
  width: 300px;
  height: 300px;
  right: -80px;
  bottom: -60px;
  background: #6366f1;
  animation-delay: 2s;
}
@keyframes float {
  0% { transform: translateY(0) scale(1);}
  100% { transform: translateY(40px) scale(1.08);}
}
.glass-card.cambiar-card {
  background: rgba(255,255,255,0.30);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 22px;
  border: 1.5px solid rgba(255,255,255,0.30);
  box-shadow: 0 8px 32px rgba(60,60,120,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 420px;
  margin: 3rem auto;
  color: #1e293b;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  position: relative;
  z-index: 2;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #6366f1;
  font-weight: 800;
  letter-spacing: 0.5px;
}
label {
  display: block;
  margin-bottom: 1.2rem;
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-top: 0.3rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  font-size: 1rem;
  background-color: rgba(255,255,255,0.7);
  color: #334155;
  transition: border-color 0.3s, background 0.3s;
  box-shadow: 0 1px 4px #0001;
}
input:focus {
  outline: none;
  border-color: #38bdf8;
  background-color: #fff;
}
button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #38bdf8 60%, #6366f1 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s ease;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
}
button:hover {
  background: linear-gradient(90deg, #0ea5e9 60%, #4338ca 100%);
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.error {
  color: #e53e3e;
  margin-top: 1rem;
  font-size: 0.98rem;
  text-align: center;
}
.exito {
  color: #48bb78;
  margin-top: 1rem;
  font-size: 0.98rem;
  text-align: center;
}
</style>