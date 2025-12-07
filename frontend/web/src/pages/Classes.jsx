import React from "react";
import { Users, BookOpen, ArrowRight } from "lucide-react";

export default function Classes() {
  const classes = [
    { id: 1, name: "Class 1A", students: 20 },
    { id: 2, name: "Class 2A", students: 40 },
    { id: 3, name: "Class 3A", students: 60 },
  ];

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Classes</h1>
          </div>
          <p className="text-slate-400">Manage classes and assignments</p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>

              <div className="flex items-center gap-2 text-slate-300 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{cls.students} Students</span>
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}