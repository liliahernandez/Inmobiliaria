<template>
  <div class="forgot-bg">
    <div class="glass-card forgot-card">
      <h2 class="form-title">
        Recuperar Contraseña 🔑
      </h2>

      <p v-if="message" class="message success">
        {{ message }}
      </p>
      <p v-if="error" class="message error">
        {{ error }}
      </p>

      <form @submit.prevent="requestPasswordReset" class="form-group">
        <div class="input-wrapper">
          <label for="email" class="input-label">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="email"
            placeholder="tu_correo@ejemplo.com"
            class="form-input"
          />
        </div>

        <div>
          <button
            type="submit"
            class="submit-button primary"
          >
            Enviar Código
          </button>
        </div>
      </form>
      
      <div class="form-link-container">
        <router-link
          to="/reset-password"
          class="form-link"
        >
          ¿Ya tienes un código?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      message: '',
      error: '',
    };
  },
  methods: {
    async requestPasswordReset() {
      try {
        this.message = '';
        this.error = '';
        const response = await axios.post('http://localhost:8000/api/password/forgot', { email: this.email }); 
        this.message = response.data.message;
      } catch (error) {
        console.error("Error al solicitar el código:", error);
        if (error.response) {
            this.error = error.response.data.message || error.response.statusText || 'Error del servidor.';
            if (error.response.data.errors) {
                this.error += ' ' + Object.values(error.response.data.errors).flat().join(' ');
            }
        } else if (error.request) {
            this.error = 'No se recibió respuesta del servidor. Verifica que Laravel esté corriendo en http://localhost:8000.';
        } else {
            this.error = 'Ocurrió un error inesperado al solicitar el código: ' + error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.forgot-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.forgot-bg::before, .forgot-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 1;
  animation: float 10s ease-in-out infinite alternate;
}
.forgot-bg::before {
  width: 350px;
  height: 350px;
  left: -100px;
  top: -80px;
  background: #38bdf8;
  animation-delay: 0s;
}
.forgot-bg::after {
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
.glass-card.forgot-card {
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
  text-align: center;
}
.form-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 30px;
}
.message {
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
}
.message.success {
  background-color: #e6ffed;
  border: 1px solid #38a169;
  color: #2f855a;
}
.message.error {
  background-color: #ffe6e6;
  border: 1px solid #e53e3e;
  color: #c53030;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-wrapper {
  text-align: left;
}
.input-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}
.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  background: rgba(255,255,255,0.7);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  color: #334155;
  box-shadow: 0 1px 4px #0001;
}
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
.submit-button {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  background: linear-gradient(90deg, #38bdf8 60%, #6366f1 100%);
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
}
.submit-button.primary:hover {
  background: linear-gradient(90deg, #0ea5e9 60%, #4338ca 100%);
  transform: translateY(-2px);
}
.submit-button:active {
  transform: translateY(0);
}
.form-link-container {
  margin-top: 25px;
}
.form-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6366f1;
  text-decoration: none;
  transition: color 0.3s ease;
}
.form-link:hover {
  color: #0ea5e9;
  text-decoration: underline;
}
</style>