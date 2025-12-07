import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axiosInstance.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      const { access_token } = response.data
      // Use auth context to update app state reactively
      login(access_token, username)
      navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08091C] via-slate-900 to-[#0f1729] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl p-8 space-y-6">

        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <span className="text-white text-3xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">FaceSense</h1>
            <p className="text-slate-400 text-sm mt-1">Attendance Tracking System</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 w-5 h-5" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Username</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-400" />
              <input
                disabled={loading}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-400" />
              <input
                disabled={loading}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
            disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all shadow-lg 
            hover:shadow-blue-500/30 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>


        {/* Registration Link */}
        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}
