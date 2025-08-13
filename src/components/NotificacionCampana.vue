<template>
  <div class="notificacion-campana">
    <!-- Mostrar estado de carga -->
    <div v-if="loading" class="campana-loading" title="Cargando notificaciones...">
      <span class="spinner"></span> Cargando...
    </div>
    <!-- Mostrar estado de error (por ejemplo, si no hay token o la llamada falla) -->
    <div v-else-if="error" class="campana-error" title="No se pudieron cargar las notificaciones">
      <span class="icon">⚠️</span>
      <span class="error-message-text">Error</span> 
    </div>
    <!-- Mostrar la campana con el badge si hay notificaciones y el conteo es mayor a cero -->
    <div v-else class="campana-icon" @click="toggleNotificaciones" title="Ver notificaciones">
      🔔
      <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
    </div>

    <!-- Dropdown de notificaciones -->
    <div v-if="showNotificaciones" class="notificaciones-dropdown">
      <p class="dropdown-title">Notificaciones Recientes</p>
      <div v-if="notifications.length > 0" class="notifications-list">
        <div v-for="multa in notifications" :key="multa.id" class="multa-detail">
          <p><strong>Residente:</strong> {{ multa.nombre_residente }}</p>
          <p><strong>Motivo:</strong> {{ multa.motivo }}</p>
          <p><strong>Monto:</strong> ${{ multa.monto }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(multa.fecha) }}</p>
          <hr v-if="notifications.length > 1" class="multa-separator">
        </div>
      </div>
      <div v-else-if="!loading && !error">
        <p>No hay notificaciones recientes.</p>
      </div>
      <div v-else-if="loading">
        <p>Cargando detalles...</p>
      </div>
      <div v-else-if="error">
        <p>Hubo un problema al cargar las notificaciones.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { inject } from 'vue';

export default {
  props: ['isLoggedIn'], 
  setup() {
    const emitter = inject('emitter');
    return { emitter };
  },
  data() {
    return {
      notifications: [], 
      notificationCount: 0, 
      showNotificaciones: false,
      loading: false,
      error: false, 
      // Eliminamos 'lastViewedMultaId' de aquí para que el numerito reaparezca
      // cuando haya una nueva multa o al recargar la página
    };
  },
  methods: {
    toggleNotificaciones() {
      this.showNotificaciones = !this.showNotificaciones;
      // Cuando el usuario abre el dropdown, marca las notificaciones como vistas
      if (this.showNotificaciones) { 
        this.markNotificationsAsViewed(); 
      }
    },
    markNotificationsAsViewed() { 
      this.notificationCount = 0; // Se limpia el conteo del badge al hacer clic
      // Eliminado: localStorage.setItem('lastViewedMultaId', ...);
      // Así el estado de 'visto' no persiste entre sesiones ni tras una nueva inserción
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async fetchNotifications() { 
      this.loading = true;
      this.error = false; 
      this.notifications = []; 
      this.notificationCount = 0; // Se reinicia siempre al inicio de la carga

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("NotificacionCampana: No hay token para obtener notificaciones. Usuario no logueado o token no disponible aún.");
        this.error = true; 
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/multas', { 
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.notifications = response.data; 

        if (this.notifications.length > 0) {
            // CAMBIO CLAVE: Si hay multas, siempre se muestra 1 en el badge
            // hasta que el usuario haga clic en la campana.
            // Esto asegura que el numerito aparezca en cada carga y con cada nueva multa.
            this.notificationCount = 1; 
        } else {
            this.notificationCount = 0; 
        }

      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        this.error = true; 
        if (error.response && error.response.status === 401) {
          console.log("NotificacionCampana: Token no autorizado o expirado para /multas.");
        } else {
            console.error("Detalle del error:", error.message);
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.fetchNotifications();
    }
    this.emitter.on('new-multa-registered', this.fetchNotifications);
  },
  beforeUnmount() {
    this.emitter.off('new-multa-registered', this.fetchNotifications);
  },
  watch: {
    isLoggedIn(newValue, oldValue) {
      if (newValue === true && oldValue === false) {
        this.fetchNotifications();
      } else if (newValue === false) {
        this.notifications = [];
        this.notificationCount = 0;
        this.error = false;
        this.loading = false;
        this.showNotificaciones = false;
        // Eliminado: localStorage.removeItem('lastViewedMultaId');
      }
    }
  }
};
</script>

<style scoped>
/* Tus estilos CSS previos se mantienen sin cambios */
.notificacion-campana {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  margin-right: 1rem;
}

.campana-loading, .campana-error {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: white;
  background-color: #555;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.campana-error .icon {
  color: #ffcc00;
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.campana-icon {
  position: relative;
  padding: 0.5rem;
  transition: transform 0.2s ease-in-out;
}

.campana-icon:hover {
    transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.7em;
  line-height: 1;
  transform: translate(50%, -50%);
  min-width: 1.2em;
  text-align: center;
}

.notificaciones-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  max-width: 300px;
  z-index: 1000;
  color: #333;
  padding: 1rem;
  margin-top: 0.5rem;
}

.dropdown-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

.notifications-list {
    max-height: 200px;
    overflow-y: auto;
}

.multa-detail {
    margin-bottom: 1rem;
}

.multa-detail p {
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
}

.multa-detail p:last-child {
    margin-bottom: 0;
}

.multa-separator {
    border: none;
    border-top: 1px dashed #eee;
    margin: 0.8rem 0;
}
</style>
