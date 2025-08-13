import axios from 'axios'
import router from '../router'

let sesionExpiradaMostrada = false // 👈 control interno

export function setupAuthInterceptor() {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401 && !sesionExpiradaMostrada) {
        sesionExpiradaMostrada = true // ✅ evita repeticiones

        localStorage.removeItem('token')
        localStorage.removeItem('roles')

        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        router.push('/')
      }

      return Promise.reject(error)
    }
  )
}
