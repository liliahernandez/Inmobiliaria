<template>
  <div class="home-bg">
    <v-container fluid class="home-container">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card class="pa-8 home-card" elevation="12">
            <v-card-title class="headline mb-4 text-center text-primary">
              ¡Bienvenido a Inmobiliaria!
            </v-card-title>
            <v-card-text class="text-center text-grey-darken-2 mb-4">
              Encuentra la propiedad de tus sueños o publica la tuya fácilmente.
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="primary" class="btn-anim" @click="irAPropiedades" large>
                <v-icon left>mdi-home-city</v-icon>
                Ver propiedades
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function irAPropiedades() {
  router.push('/propiedades')
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

.home-bg {
  min-height: 100vh;
  min-width: 100vw;
  height: 100vh;
  width: 100vw;
  background: 
    linear-gradient(rgba(207, 222, 243, 0.85), rgba(224, 234, 252, 0.85)),
    url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  overflow: hidden;
}

.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.home-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
  backdrop-filter: blur(2px);
  animation: fadeIn 1.2s;
  max-width: 420px;
  width: 100%;
}

.btn-anim {
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-anim:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.25);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>