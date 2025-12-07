import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    // Initialize from localStorage on first load
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('username')
    if (t) setToken(t)
    if (u) setUsername(u)
  }, [])

  const login = (t, user) => {
    localStorage.setItem('token', t)
    if (user) localStorage.setItem('username', user)
    setToken(t)
    setUsername(user || null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
