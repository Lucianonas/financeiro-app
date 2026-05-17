import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/RotaProtegida'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <RotaProtegida>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </RotaProtegida>
          } />

          {/* Redireciona raiz para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App