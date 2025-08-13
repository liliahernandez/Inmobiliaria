<template>
  <div class="animated-bg">
    <div class="glass-center">
      <div class="glass-card">
        <img src="https://cdn-icons-png.flaticon.com/512/69/69524.png" alt="Logo" class="logo" />
        <h1>¡Bienvenido!</h1>
        <p class="subtitle">Inicia sesión para continuar</p>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <span class="input-icon">
              <svg width="20" height="20" fill="#38bdf8" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg width="20" height="20" fill="#6366f1" viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7V7a6 6 0 1 0-12 0v3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-8-3a4 4 0 1 1 8 0v3H6V7zm10 12H6v-7h12v7z"/></svg>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="Contraseña"
              required
            />
          </div>
          <button :disabled="loading" type="submit" class="glass-btn">
            {{ loading ? "Ingresando..." : "Entrar" }}
          </button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
        <router-link to="/forgot-password" class="forgot-link">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('roles', JSON.stringify(response.data.roles))
    router.push('/inicio')
  } catch (error) {
    if (error.response?.data?.errors?.email) {
      errorMessage.value = error.response.data.errors.email[0]
    } else {
      errorMessage.value = 'Error al iniciar sesión. Inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:global(html), :global(body), :global(#app) {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
:global(body) {
  overflow-x: hidden;
}

.animated-bg {
  min-height: 100vh;
  min-width: 100vw;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.animated-bg::before, .animated-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  z-index: 1;
  animation: float 8s ease-in-out infinite alternate;
}
.animated-bg::before {
  width: 400px;
  height: 400px;
  left: -120px;
  top: -100px;
  background: #38bdf8;
  animation-delay: 0s;
}
.animated-bg::after {
  width: 350px;
  height: 350px;
  right: -100px;
  bottom: -80px;
  background: #6366f1;
  animation-delay: 2s;
}
@keyframes float {
  0% { transform: translateY(0) scale(1);}
  100% { transform: translateY(40px) scale(1.08);}
}
.glass-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
}
.glass-card {
  background: rgba(255, 255, 255, 0.30);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border-radius: 28px;
  border: 1.5px solid rgba(255,255,255,0.40);
  box-shadow: 0 8px 32px rgba(60,60,120,0.18);
  width: 100%;
  max-width: 500px;
  min-width: 370px;
  padding: 48px 40px 36px 40px;
  text-align: center;
  position: relative;
  margin: 0 auto;
}
@media (max-width: 600px) {
  .glass-card {
    max-width: 95vw;
    min-width: unset;
    padding: 32px 10px 24px 10px;
  }
}
.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  background: #fff;
}
h1 {
  font-size: 28px;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px #fff4;
}
.subtitle {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 30px;
}
.input-group {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.85;
}
.input-group input {
  width: 100%;
  padding: 13px 16px 13px 42px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  color: #334155;
  background: rgba(255,255,255,0.70);
  transition: border-color 0.3s, background 0.3s;
  box-shadow: 0 1px 4px #0001;
}
.input-group input:focus {
  outline: none;
  border-color: #38bdf8;
  background: #fff;
}
.glass-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #38bdf8 60%, #6366f1 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
  transition: background 0.3s, box-shadow 0.3s;
}
.glass-btn:hover {
  background: linear-gradient(90deg, #0ea5e9 60%, #4338ca 100%);
  box-shadow: 0 4px 16px rgba(99,102,241,0.13);
}
.glass-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
.forgot-link {
  display: block;
  margin-top: 24px;
  font-size: 15px;
  color: #6366f1;
  text-decoration: none;
  transition: color 0.3s;
}
.forgot-link:hover {
  color: #0ea5e9;
  text-decoration: underline;
}
.error-message {
  color: #ef4444;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.2px;
}
</style>