<template>
  <div class="usuarios-bg">
    <div class="glass-card usuarios-card">
      <h2>👥 Usuarios</h2>
      <p>Contenido de usuarios.</p>
    </div>
  </div>
</template>

<style scoped>
.usuarios-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.usuarios-bg::before, .usuarios-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 1;
  animation: float 10s ease-in-out infinite alternate;
}
.usuarios-bg::before {
  width: 350px;
  height: 350px;
  left: -100px;
  top: -80px;
  background: #38bdf8;
  animation-delay: 0s;
}
.usuarios-bg::after {
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
.glass-card.usuarios-card {
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
h2 {
  color: #6366f1;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}
</style>