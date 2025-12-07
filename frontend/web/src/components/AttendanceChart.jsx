import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AttendanceChart({ data }) {
  // Fallback example data if none is passed
  const chartData =
    data && data.length > 0
      ? data
      : [
          { day: "Mon", present: 45 },
          { day: "Tue", present: 52 },
          { day: "Wed", present: 49 },
          { day: "Thu", present: 56 },
          { day: "Fri", present: 50 },
        ];

  return (
    <div className="p-6 bg-[#0D0F26] border border-slate-700 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Weekly Attendance Trend
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E203A" />

            <XAxis dataKey="day" tick={{ fill: "#9CA3AF" }} />
            <YAxis tick={{ fill: "#9CA3AF" }} />

            <Tooltip
              contentStyle={{
                background: "#0F1129",
                border: "1px solid #1E203A",
                borderRadius: "8px",
                color: "white",
              }}
              labelStyle={{ color: "#93C5FD" }}
            />

            <Line
              type="monotone"
              dataKey="present"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3B82F6" }}
              activeDot={{ r: 6, fill: "#60A5FA" }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
