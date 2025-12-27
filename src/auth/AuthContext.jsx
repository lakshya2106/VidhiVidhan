import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({ token: null, setToken: () => {} })

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('token') : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    } catch (e) {}
  }, [token])

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'token') setToken(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
