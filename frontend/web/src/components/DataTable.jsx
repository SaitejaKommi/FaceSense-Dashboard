import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Trash2, Edit2 } from 'lucide-react'

export default function DataTable({ columns, data = [], onDelete, onEdit, loading = false }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-900/30 text-green-400 border-green-700',
      absent: 'bg-red-900/30 text-red-400 border-red-700',
      late: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      leave: 'bg-blue-900/30 text-blue-400 border-blue-700',
    }
    return colors[status?.toLowerCase()] || 'bg-slate-700 text-slate-300'
  }

  // ✅ Apply sorting to table data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key]
      const valB = b[sortConfig.key]

      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      const isNumber = typeof valA === 'number' && typeof valB === 'number'

      if (isNumber) {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA
      }

      return sortConfig.direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }, [data, sortConfig])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 text-left text-sm font-semibold text-slate-300 select-none
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-700/50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}

                    {/* Sort Icon */}
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc'
                        ? <ChevronUp className="w-4 h-4 text-blue-400" />
                        : <ChevronDown className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </th>
              ))}

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-700">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-400">
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                      {col.render ? (
                        col.render(row[col.key], row)
                      ) : col.key === 'status' ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(row[col.key])}`}>
                          {row[col.key]}
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors text-blue-400"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
