// import { Navigate } from 'react-router-dom'
// import { useContext } from 'react'
// import { AuthContext } from '../auth/AuthContext'

// export default function ProtectedRoute({ children }) {
//   const { token } = useContext(AuthContext)
//   if (!token) return <Navigate to="/login" replace />
//   return children
// }


import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import Sidebar from "./Sidebar"

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content with-sidebar">
        <Outlet />
      </div>
    </div>
  )
}

export default ProtectedRoute
