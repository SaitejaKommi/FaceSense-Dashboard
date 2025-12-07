import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, GraduationCap } from 'lucide-react'
import axiosInstance from '../api/axios'
import DataTable from '../components/DataTable'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/students/')
      setStudents(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Error fetching students:', err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return

    try {
      await axiosInstance.delete(`/api/students/${id}`)
      setStudents(students.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting student:', err)
    }
  }

  const filteredStudents = students.filter(s =>
    (s.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.roll?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const tableColumns = [
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'roll', label: 'Roll Number', sortable: true },
    { key: 'class_name', label: 'Class', sortable: true },
    { 
      key: 'created_at',
      label: 'Enrolled Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-9 h-9 text-blue-500 drop-shadow-[0_0_10px_rgba(0,122,255,0.5)]" />
              <h1 className="text-4xl font-bold tracking-tight">Students</h1>
            </div>
            <p className="text-slate-400 text-lg">Manage all students and attendance records seamlessly</p>
          </div>

          <Link
            to="/add-student"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold 
              transition-all shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search by name or roll number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full bg-[#0F1028] border border-slate-800 text-white rounded-xl
              pl-12 pr-4 py-3 placeholder-slate-500
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600/30
              transition-all shadow-inner
            "
          />
        </div>

        {/* Table Component */}
        <DataTable
          columns={tableColumns}
          data={filteredStudents}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Empty Search State */}
        {!loading && filteredStudents.length === 0 && search && (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <Search className="w-12 h-12 text-slate-500" />
            <p className="text-slate-400 text-lg">
              No students match "<span className="text-white">{search}</span>"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
