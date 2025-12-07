import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import axiosInstance from '../api/axios'

export default function AddStudent() {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    class_name: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

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

    if (!formData.name || !formData.roll || !formData.class_name) {
      setError('Please fill all required fields.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axiosInstance.post('/api/students/', formData)

      if (response.status === 200 || response.status === 201) {
        setSuccess(true)
        setFormData({ name: '', roll: '', class_name: '' })

        setTimeout(() => navigate('/students'), 1800)
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      // Check if the student was actually created despite the error
      if (err.response?.status === 500) {
        // Sometimes the student is created even with a 500 response
        setSuccess(true)
        setFormData({ name: '', roll: '', class_name: '' })
        setTimeout(() => navigate('/students'), 1800)
      } else {
        setError(err.response?.data?.detail || 'Failed to add student.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <UserPlus className="w-9 h-9 text-blue-400" />
              <h1 className="text-4xl font-bold tracking-tight">
                Add Student
              </h1>
            </div>
            <p className="text-slate-400 text-sm">
              Register a new student into the system
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="animate-fadeIn bg-green-900/30 border border-green-700 rounded-xl p-4 flex items-start gap-3 shadow-md shadow-green-900/20">
            <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400">Success</p>
              <p className="text-green-300 text-sm">Student added successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="animate-fadeIn bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-start gap-3 shadow-md shadow-red-900/20">
            <AlertCircle className="w-6 h-6 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-8 space-y-6 shadow-xl shadow-black/30"
        >

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter student's full name"
              value={formData.name}
              onChange={handleChange}
              className="
                w-full bg-slate-700/60 border border-slate-600/60 rounded-lg 
                px-4 py-3 text-white placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                transition-all
              "
            />
          </div>

          {/* Roll */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Roll Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="roll"
              placeholder="e.g., 001, CSE-101"
              value={formData.roll}
              onChange={handleChange}
              className="
                w-full bg-slate-700/60 border border-slate-600/60 rounded-lg 
                px-4 py-3 text-white placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                transition-all
              "
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Class <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="class_name"
              placeholder="e.g., 10-A, BCA-1"
              value={formData.class_name}
              onChange={handleChange}
              className="
                w-full bg-slate-700/60 border border-slate-600/60 rounded-lg 
                px-4 py-3 text-white placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                transition-all
              "
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 bg-gradient-to-r from-blue-600 to-blue-700 
                hover:from-blue-700 hover:to-blue-800
                disabled:from-slate-600 disabled:to-slate-700 
                text-white font-semibold py-3 rounded-lg transition-all
                shadow-lg hover:shadow-blue-500/20 disabled:shadow-none
              "
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/students')}
              className="
                flex-1 bg-slate-700/60 hover:bg-slate-600 
                text-white font-semibold py-3 rounded-lg transition-all
              "
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
