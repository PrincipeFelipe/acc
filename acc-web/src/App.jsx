import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import { ProtectedRoute } from './components/AdminLayout'
import ScrollToTop from './components/ScrollToTop'

// Public pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import CivilWorkPage from './pages/CivilWorkPage'
import PortfolioPage from './pages/PortfolioPage'
import WorkDetailPage from './pages/WorkDetailPage'
import PromotionsPage from './pages/PromotionsPage'
import PromotionDetailPage from './pages/PromotionDetailPage'
import ContactPage from './pages/ContactPage'

// Admin pages
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminTrabajos from './pages/AdminTrabajos'
import AdminPromociones from './pages/AdminPromociones'
import AdminMensajes from './pages/AdminMensajes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><HomePage /></>} />
          <Route path="/quienes-somos" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/obra-civil" element={<CivilWorkPage />} />
          <Route path="/trabajos" element={<><Header /><PortfolioPage /></>} />
          <Route path="/trabajos/:id" element={<WorkDetailPage />} />
          <Route path="/promociones" element={<><Header /><PromotionsPage /></>} />
          <Route path="/promociones/:id" element={<PromotionDetailPage />} />
          <Route path="/contacto" element={<><Header /><ContactPage /></>} />

          {/* Secret Login */}
          <Route path="/acc-login" element={<LoginPage />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/trabajos" element={<ProtectedRoute><AdminTrabajos /></ProtectedRoute>} />
          <Route path="/admin/promociones" element={<ProtectedRoute><AdminPromociones /></ProtectedRoute>} />
          <Route path="/admin/mensajes" element={<ProtectedRoute><AdminMensajes /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
