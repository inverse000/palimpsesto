import express from 'express'
import cors from 'cors'
import proyectosRoutes from './modules/proyectos/proyectos.routes'
import { funcionalidadesRouter, funcionalidadesAnidadoRouter } from './modules/funcionalidades/funcionalidades.routes'
import { ritualesRouter, ritualesAnidadoRouter } from './modules/rituales/rituales.routes'
import conceptosRoutes from './modules/conceptos/conceptos.routes'
import revisionesRoutes from './modules/revisiones/revisiones.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import { errorHandler, notFound } from './shared/error.handler'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Palimpsesto API', version: '1.0.0', timestamp: new Date().toISOString() })
})

app.use('/api/proyectos', proyectosRoutes)
app.use('/api/proyectos/:proyectoId/funcionalidades', funcionalidadesAnidadoRouter)
app.use('/api/proyectos/:proyectoId/rituales', ritualesAnidadoRouter)
app.use('/api/funcionalidades', funcionalidadesRouter)
app.use('/api/rituales', ritualesRouter)
app.use('/api/conceptos', conceptosRoutes)
app.use('/api/revisiones', revisionesRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
