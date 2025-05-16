import React, { useEffect, useState } from 'react'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import theme from './theme'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfileSetup from './components/Profile/ProfileSetup'
import api from './api/api'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Fetch user if token exists on app load
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null))
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar user={user} setUser={setUser} />
      <Container sx={{ pt: 4, pb: 4, minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/profile-setup" element={<ProfileSetup user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
        </Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  )
}

export default App