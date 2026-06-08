import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Interceptor de respuesta — extrae data o lanza error normalizado
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  }
)

export default client
