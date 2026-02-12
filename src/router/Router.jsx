// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { useContext } from "react"

// import Sidebar from "../components/Sidebar"
// import ProtectedRoute from "../components/ProtectedRoute"

// import Dashboard from "../pages/Dashboard"
// import InvoiceCreator from "../pages/InvoiceCreator"
// import InvoiceList from "../pages/InvoiceList"
// import EventsManager from "../pages/EventsManager"
// import AdminProfile from "../pages/AdminProfile"
// import Clients from "../pages/Clients"
// import ActivityLog from "../pages/ActivityLog"
// import Login from "../pages/Login"

// import { AuthContext } from "../auth/AuthContext"

// const AppRouter = () => {
//   const { token } = useContext(AuthContext)

//   return (
//     <Router>
//       <div className="app-container">
//         {token && <Sidebar />}

//         <div className={`main-content ${token ? "with-sidebar" : ""}`}>
//           <Routes>
//             {/* Public Route */}
//             <Route path="/login" element={<Login />} />

//             {/* Protected Routes */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/invoice-creator"
//               element={
//                 <ProtectedRoute>
//                   <InvoiceCreator />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/invoices"
//               element={
//                 <ProtectedRoute>
//                   <InvoiceList />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/events"
//               element={
//                 <ProtectedRoute>
//                   <EventsManager />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/clients"
//               element={
//                 <ProtectedRoute>
//                   <Clients />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/activity-log"
//               element={
//                 <ProtectedRoute>
//                   <ActivityLog />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <AdminProfile />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   )
// }

// export default AppRouter





import React from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"

// Public
import LandingPage from "../pages/HomePage/LandingPage"
import Login from "../pages/Login"

// Admin Protected
import ProtectedRoute from "../components/ProtectedRoute"
import Dashboard from "../pages/Dashboard"
import InvoiceCreator from "../pages/InvoiceCreator"
import InvoiceList from "../pages/InvoiceList"
import EventsManager from "../pages/EventsManager"
import Clients from "../pages/Clients"
import ActivityLog from "../pages/ActivityLog"
import AdminProfile from "../pages/AdminProfile"

const Router = createBrowserRouter([
  // 🌍 Public User Routes
  {
    path: "/",
    element: <LandingPage />
  },

  // 🔓 Admin Login
  {
    path: "/login",
    element: <Login />
  },

  // 🔐 Admin Panel Routes
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "invoice-creator",
        element: <InvoiceCreator />
      },
      {
        path: "invoices",
        element: <InvoiceList />
      },
      {
        path: "events",
        element: <EventsManager />
      },
      {
        path: "clients",
        element: <Clients />
      },
      {
        path: "activity-log",
        element: <ActivityLog />
      },
      {
        path: "profile",
        element: <AdminProfile />
      }
    ]
  },

  // ❌ 404 fallback
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])

export default Router
