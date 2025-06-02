import React, { useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

interface LoginPageProps {
  onLogin: (name: string) => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Password validation: 8+ chars, 1 number, 1 special char
  const isSecurePassword = (pw: string): boolean =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pw)

  const getUsers = (): Record<string, string> =>
    JSON.parse(localStorage.getItem('jarvisUsers') || '{}')

  const saveUser = (username: string, pw: string) => {
    const users = getUsers()
    users[username] = pw
    localStorage.setItem('jarvisUsers', JSON.stringify(users))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const username = name.trim().toLowerCase()
    const users = getUsers()

    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    if (mode === 'register') {
      if (users[username]) {
        setError('Username already exists')
      } else if (!isSecurePassword(password)) {
        setError('Password must be 8+ characters, include a number and special character')
      } else {
        saveUser(username, password)
        localStorage.setItem('jarvisUser', username)
        onLogin(username)
      }
    } else {
      if (!users[username] || users[username] !== password) {
        setError('Invalid username or password')
      } else {
        localStorage.setItem('jarvisUser', username)
        onLogin(username)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white px-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#3B82F6] to-[#F59E0B] shadow-lg" />
        <h1 className="text-4xl font-bold mt-4 text-yellow-400">JARVIS</h1>
        <p className="text-lg text-blue-300">Just A Rather Very Intelligent System</p>
        <p className="text-sm text-slate-300 mt-1">Your personal AI calendar assistant</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a]/80 shadow-md rounded-lg p-6 w-80 flex flex-col gap-4"
      >
        <h2 className="text-white text-xl font-semibold text-center">
          {mode === 'login' ? 'Login' : 'Register'} to JARVIS
        </h2>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full pl-10 pr-10 py-2 bg-slate-800 text-white border border-slate-600 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-3 top-3 text-slate-400 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#DC2626] hover:bg-[#b91c1c] text-white py-2 rounded-md transition font-semibold"
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>

        <p className="text-center text-sm text-slate-300">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
            className="text-blue-400 underline cursor-pointer"
          >
            {mode === 'login' ? 'Register here' : 'Login here'}
          </span>
        </p>
      </form>

      <footer className="mt-10 text-sm text-slate-400 text-center">
        Powered by AP Industries Technology <br />
        © 2024 Advanced AI Calendar System
      </footer>
    </div>
  )
}

export default LoginPage
