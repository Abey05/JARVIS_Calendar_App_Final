import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import CalendarPage from './components/CalendarPage'
import Settings from './components/Settings'

function App() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('jarvisUser')
    if (saved) setUsername(saved)
  }, [])

  const handleLogin = (name: string) => {
    localStorage.setItem('jarvisUser', name)
    setUsername(name)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            username ? (
              <Navigate to="/calendar" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            username ? (
              <CalendarPage user={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            username ? (
              <Settings username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
