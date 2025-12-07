import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PieChartComponent({
title = "Attendance Distribution",
data = [],
height = 250,
}) {
const COLORS = ["#22c55e", "#ef4444", "#eab308"]; // green, red, yellow

if (!data.length) {
return ( <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl text-center text-slate-400"> <h4 className="font-semibold mb-3 text-white">{title}</h4> <div className="py-10">No data available</div> </div>
);
}

return ( <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl"> <h4 className="font-semibold mb-4 text-white">{title}</h4>

```
  <div style={{ width: "100%", height }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            color: "white",
          }}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

);
}
