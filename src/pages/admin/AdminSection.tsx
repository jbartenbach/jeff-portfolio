import { Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'
import Dashboard from './Dashboard'
import KanbanPage from './KanbanPage'
import ProjectPage from './ProjectPage'
import RequireAuth from './RequireAuth'

export default function AdminSection() {
  return (
    <Routes>
      <Route index element={<AdminLogin />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="tasks" element={<KanbanPage />} />
      </Route>
    </Routes>
  )
}
