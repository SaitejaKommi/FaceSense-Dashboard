import React from 'react'

export default function StatCard({ icon: Icon, label, value, subtext, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'from-blue-600/80 to-blue-800',
    green: 'from-green-600/80 to-green-800',
    red: 'from-red-600/80 to-red-800',
    purple: 'from-purple-600/80 to-purple-800',
    cyan: 'from-cyan-600/80 to-cyan-800',
  }

  return (
    <div className="
      bg-slate-900/60
      backdrop-blur-md
      border border-slate-700/60
      rounded-2xl p-6
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-xl
      hover:border-slate-600/80
    ">
      <div className="flex items-start justify-between">
        {/* LEFT SECTION */}
        <div className="flex-1">
          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            {label}
          </p>

          <h3 className="text-4xl font-bold text-white mt-1 leading-tight">
            {value}
          </h3>

          {subtext && (
            <p className="text-slate-500 text-xs mt-1">
              {subtext}
            </p>
          )}

          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`
                text-sm font-semibold
                ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}
              `}>
                {trend.direction === 'up' ? '▲' : '▼'} {trend.value}%
              </span>
              <span className="text-slate-500 text-[11px]">{trend.label}</span>
            </div>
          )}
        </div>

        {/* RIGHT SECTION - ICON */}
        <div className={`
          bg-gradient-to-br ${colorClasses[color]}
          p-4 rounded-xl shadow-lg shadow-${color}-500/20
          flex items-center justify-center
        `}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  )
}
