import React, { useState, useEffect, useMemo } from 'react'
import { Clock, Filter, CheckCircle } from 'lucide-react'
import axiosInstance from '../api/axios'
import DataTable from '../components/DataTable'
import FilterBar from '../components/FilterBar'
import StatCard from '../components/StatCard'

export default function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters state
  const [filters, setFilters] = useState({
    tab: 'all',
    class: '',
    course: '',
    status: ''
  })

  const filterOptions = {
    class: ['CSE-A', 'CSE-B', 'ECE-A', 'Mechanical'],
    course: ['MERN - Fullstack', 'Data Science', 'Cloud 101'],
    status: ['Present', 'Absent', 'Late']
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get('/api/attendance/today')
      setAttendance(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setError('Failed to load attendance')
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // derive filtered list
  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const matchesTab = filters.tab === 'all' ? true : a.status?.toLowerCase() === filters.tab
      const matchesClass = !filters.class ? true : (a.class_name || '').toLowerCase() === filters.class.toLowerCase()
      const matchesCourse = !filters.course ? true : (a.course || '').toLowerCase() === filters.course.toLowerCase()
      const matchesStatus = !filters.status ? true : (a.status || '').toLowerCase() === filters.status.toLowerCase()
      return matchesTab && matchesClass && matchesCourse && matchesStatus
    })
  }, [attendance, filters])

  // stats
  const stats = useMemo(() => {
    const total = attendance.length
    const present = attendance.filter(a => a.status === 'Present').length
    const absent = attendance.filter(a => a.status === 'Absent').length
    const late = attendance.filter(a => a.status === 'Late').length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0
    return { total, present, absent, late, rate }
  }, [attendance])

  const tableColumns = [
    { key: 'student_name', label: 'Student Name', sortable: true },
    { key: 'student_roll', label: 'Roll Number', sortable: true },
    {
      key: 'timestamp',
      label: 'Date & Time',
      sortable: true,
      render: (value) => {
        if (!value) return 'N/A'
        const date = new Date(value)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const tableData = filteredAttendance.map(record => ({
    id: record.id,
    student_name: record.student_name || (record.student?.name || 'Unknown'),
    student_roll: record.student_roll || (record.student?.roll || 'N/A'),
    timestamp: record.timestamp,
    status: record.status || 'Unknown'
  }))

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Attendance History</h1>
          </div>
          <p className="text-slate-400">View and manage your attendance records</p>
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          tabs={[
            { id: 'all', label: 'All Records' },
            { id: 'present', label: 'Present' },
            { id: 'absent', label: 'Absent' },
            { id: 'late', label: 'Late' }
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={() => <svg />} label="Total Records" value={stats.total} color="blue" />
          <StatCard icon={() => <svg />} label="Present" value={stats.present} color="green" />
          <StatCard icon={() => <svg />} label="Absent" value={stats.absent} color="red" />
          <StatCard icon={() => <svg />} label="Attendance Rate" value={`${stats.rate}%`} color="cyan" subtext={`${stats.present} present`} />
        </div>

        {/* Filters panel (kept for quick filter UI) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Quick Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {filterOptions.class.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Courses</option>
              {filterOptions.course.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              {filterOptions.status.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={tableColumns} data={tableData} loading={loading} />

        {/* Empty state */}
        {!loading && tableData.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No attendance records found</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-4 text-red-400">{error}</div>
        )}

      </div>
    </div>
  )
}
