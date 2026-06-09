import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from '@/shared/components/layout/PageLayout'
import DashboardPage from '@/modules/dashboard/DashboardPage'
import ProyectosPage from '@/modules/proyectos/ProyectosPage'
import ProyectoDetalle from '@/modules/proyectos/ProyectoDetalle'
import RitualDetalle from '@/modules/rituales/RitualDetalle'
import ConceptosPage from '@/modules/conceptos/ConceptosPage'
import ConceptoDetalle from '@/modules/conceptos/ConceptoDetalle'
import RevisionesPage from '@/modules/revisiones/RevisionesPage'
import RevisionDetalle from '@/modules/revisiones/RevisionDetalle'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/proyectos" element={<ProyectosPage />} />
          <Route path="/proyectos/:id" element={<ProyectoDetalle />} />
          <Route path="/rituales/:id" element={<RitualDetalle />} />
          <Route path="/conceptos" element={<ConceptosPage />} />
          <Route path="/conceptos/:id" element={<ConceptoDetalle />} />
          <Route path="/revisiones" element={<RevisionesPage />} />
          <Route path="/revisiones/:id" element={<RevisionDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
