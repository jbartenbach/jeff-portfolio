import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PortfolioHome from './pages/PortfolioHome'
import CaseStudyPage from './pages/CaseStudyPage'
import WorkIndex from './pages/WorkIndex'
import AdminSection from './pages/admin/AdminSection'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/admin/*" element={<AdminSection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
