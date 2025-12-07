import { Download } from 'lucide-react'

export default function Reports() {
  const handleExport = (format) => {
    alert(`${format.toUpperCase()} Export\n\nThis will call: /api/attendance/export/${format}`)
  }

  const exportOptions = [
    { format: 'csv', label: 'CSV Export' },
    { format: 'excel', label: 'Excel Export' },
    { format: 'pdf', label: 'PDF Export' },
  ]

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">Reports</h1>
        <p className="text-gray-400 mb-8">Download attendance reports</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {exportOptions.map((item) => (
            <button
              key={item.format}
              onClick={() => handleExport(item.format)}
              className="bg-gray-900/60 border border-gray-800 rounded-xl p-8 transition 
                         hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/20 
                         flex flex-col items-center gap-4 
                         backdrop-blur-md hover:scale-[1.03]"
            >
              <Download className="w-12 h-12 text-blue-400" />
              <span className="text-xl font-semibold">{item.label}</span>
              <p className="text-sm text-gray-400">
                Export attendance as {item.format.toUpperCase()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
