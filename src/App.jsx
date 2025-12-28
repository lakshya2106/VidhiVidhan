import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import InvoiceCreator from './pages/InvoiceCreator'
import InvoiceList from './pages/InvoiceList'
import EventsManager from './pages/EventsManager'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, AuthContext } from './auth/AuthContext'
import { useContext } from 'react'

function AppInner() {
  const { token } = useContext(AuthContext)

  return (
    <Router>
      <div className="app-container">
        {token && <Sidebar />}
        <div className={`main-content ${token ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice-creator"
              element={
                <ProtectedRoute>
                  <InvoiceCreator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <InvoiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsManager />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}


function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
