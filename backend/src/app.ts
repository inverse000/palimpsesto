import express from 'express'
import cors from 'cors'
import proyectosRoutes from './modules/proyectos/proyectos.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import { errorHandler, notFound } from './shared/error.handler'

const app = express()

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Palimpsesto API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// ─── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/proyectos', proyectosRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Rutas pendientes de implementación (Iteraciones 2-5)
// app.use('/api/funcionalidades', funcionalidadesRoutes)
// app.use('/api/rituales', ritualesRoutes)
// app.use('/api/conceptos', conceptosRoutes)
// app.use('/api/revisiones', revisionesRoutes)
// app.use('/api/evidencias', evidenciasRoutes)

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
