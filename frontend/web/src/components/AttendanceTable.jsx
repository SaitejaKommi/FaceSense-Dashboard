import { useState } from "react";

export default function AttendanceTable({ data = [] }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((record) => {
    const name = record.student?.name?.toLowerCase() || "";
    const roll = record.student?.roll?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      roll.includes(search.toLowerCase())
    );
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-600/20 text-green-300 border border-green-700/40";
      case "Absent":
        return "bg-red-600/20 text-red-300 border border-red-700/40";
      case "Late":
        return "bg-yellow-600/20 text-yellow-300 border border-yellow-700/40";
      default:
        return "bg-gray-600/20 text-gray-300 border border-gray-700/40";
    }
  };

  return (
    <div className="bg-[#0D0F26] border border-slate-800 rounded-xl p-6 shadow-lg">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-[#131432] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#131432] border-b border-slate-800">
                {["Student Name", "Roll Number", "Status", "Confidence", "Time"].map(
                  (label, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-sm font-semibold text-slate-300"
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filtered.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="px-4 py-3 text-white">
                    {record.student?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {record.student?.roll || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {record.confidence
                      ? `${(record.confidence * 100).toFixed(1)}%`
                      : "N/A"}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">No attendance records found</p>
        </div>
      )}
    </div>
  );
}
