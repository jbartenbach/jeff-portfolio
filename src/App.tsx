import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import ContactPage from './pages/ContactPage'
import DesignHelpPage from './pages/DesignHelpPage'
import PortfolioHome from './pages/PortfolioHome'
import CaseStudyPage from './pages/CaseStudyPage'
import WorkIndex from './pages/WorkIndex'
import AdminSection from './pages/admin/AdminSection'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/design-help" element={<DesignHelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/*" element={<AdminSection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
