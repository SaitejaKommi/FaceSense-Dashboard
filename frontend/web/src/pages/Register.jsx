import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle, Lock, Mail } from 'lucide-react'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'teacher'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post('/api/auth/register', {
        username: formData.username,
        password: formData.password,
        role: formData.role
      })

      const { access_token } = response.data
      // use auth context so app state updates immediately
      login(access_token, formData.username)
      setSuccess(true)

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#08091C] via-slate-900 to-[#0f1729] flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl p-8 text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
          <p className="text-slate-300">Welcome to FaceSense. Redirecting to dashboard...</p>
        </div>
      </div>
    )
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
            <p className="text-slate-400 text-sm mt-1">Create Your Account</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 w-5 h-5 flex-shrink-0" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Username</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-400" />
              <input
                disabled={loading}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">At least 3 characters</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-400" />
              <input
                disabled={loading}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-400" />
              <input
                disabled={loading}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
            text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 mt-6"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800/50 text-slate-400">Already have an account?</span>
          </div>
        </div>

        {/* Link to Login */}
        <Link
          to="/login"
          className="block w-full text-center py-3 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-blue-400
          rounded-lg transition-all font-medium"
        >
          Sign In Instead
        </Link>
      </div>
    </div>
  )
}
