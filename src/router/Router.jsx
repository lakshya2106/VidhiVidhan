
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
