import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/api/auth/google/login', {
        credential: credentialResponse.credential,
      })

      if (res.data.access_token) {
        const decodedToken = jwtDecode(res.data.access_token)
        const email = decodedToken.sub || 'User'

        login(res.data.access_token, email)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Google login failed:', err)
      const errorMessage = err.response?.data?.detail || 'Google Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.error('Google Login Failed')
    setError('Google Login failed. Please try again.')
  }

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
      // Save token and username in AuthContext + localStorage
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
    <div className="min-h-screen bg-[#08091C] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <span className="text-2xl font-bold text-white">FS</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Sign in to FaceSense</h2>
          <p className="text-slate-400">Sign in with Google or your username & password to access your dashboard.</p>
        </div>
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 w-5 h-5" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Google sign-in */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            shape="pill"
            width="300"
          />
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-800/50 text-slate-400">Or sign in with username & password</span>
          </div>
        </div>

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

        {/* Demo Credentials */}
        <div className="pt-6 border-t border-slate-700/50 space-y-3">
          <p className="text-slate-400 text-xs font-semibold uppercase">Demo Credentials:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Username:</span>
              <span className="text-white font-mono bg-slate-700/50 px-3 py-1 rounded border border-slate-600">teacher1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Password:</span>
              <span className="text-white font-mono bg-slate-700/50 px-3 py-1 rounded border border-slate-600">password123</span>
            </div>
          </div>
        </div>

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

      <p className="text-center text-slate-500 text-xs mt-8">
        Secure Facial Recognition Attendance System
      </p>

    </div>
  );
}


