import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from '@/shared/components/layout/PageLayout'
import DashboardPage from '@/modules/dashboard/DashboardPage'
import ProyectosPage from '@/modules/proyectos/ProyectosPage'
import ProyectoDetalle from '@/modules/proyectos/ProyectoDetalle'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/proyectos" element={<ProyectosPage />} />
          <Route path="/proyectos/:id" element={<ProyectoDetalle />} />
          {/* Rutas de iteraciones futuras — se irán habilitando */}
          {/* <Route path="/rituales" element={<RitualesPage />} /> */}
          {/* <Route path="/conceptos" element={<ConceptosPage />} /> */}
          {/* <Route path="/revisiones" element={<RevisionesPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
