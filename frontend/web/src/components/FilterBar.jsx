import React from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function FilterBar({ filters = {}, filterOptions = {}, onFilterChange, tabs = [] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 backdrop-blur-sm">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">Filter Attendance</h3>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-3 mb-4 border-b border-slate-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange?.("tab", tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filters.tab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(filters).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <div className="relative">
              <select
                value={value}
                onChange={(e) => onFilterChange?.(key, e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 appearance-none 
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Select {key}...</option>

                {/* Render dynamic options */}
                {(filterOptions[key] || []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
