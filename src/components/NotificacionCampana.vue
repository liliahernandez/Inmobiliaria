<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const nuevaNotificacion = ref(false)
let ultimaMultaId = null

const verificarNotificaciones = async () => {
  const { data } = await axios.get('http://localhost:8000/api/ultima-multa')
  if (ultimaMultaId && data.id !== ultimaMultaId) {
    nuevaNotificacion.value = true
  }
  ultimaMultaId = data.id
}

onMounted(() => {
  verificarNotificaciones()
  setInterval(verificarNotificaciones, 5000)
})

const irAMultas = () => {
  nuevaNotificacion.value = false
  router.push('/')
}
</script>

<template>
  <div @click="irAMultas" style="cursor: pointer; position: relative;">
    <span>🔔</span>
    <span v-if="nuevaNotificacion" class="dot"></span>
  </div>
</template>

<style scoped>
.dot {
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
}
</style>