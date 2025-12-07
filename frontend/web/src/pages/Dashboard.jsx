// Updated Dashboard component (reviewed & enhanced for premium admin UI)
import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import axiosInstance from "../api/axios";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, attendanceRes] = await Promise.all([
        axiosInstance.get("/api/analytics/summary"),
        axiosInstance.get("/api/attendance/today")
      ]);

      setAnalytics(analyticsRes.data);
      setAttendance(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === "tab") setSelectedTab(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#08091C]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[#08091C] flex items-center justify-center text-red-400 text-lg">
        {error}
      </div>
    );
  }

  const totalStudents = analytics?.students || 0;
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;
  const attendancePercentage = totalStudents
    ? Math.round((presentCount / totalStudents) * 100)
    : 0;

  const summaryCards = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      color: "blue",
      trend: { direction: "up", value: 5, label: "from last week" }
    },
    {
      icon: CheckCircle,
      label: "Present Today",
      value: presentCount,
      color: "green",
      trend: { direction: "up", value: 8, label: "more than yesterday" }
    },
    {
      icon: AlertCircle,
      label: "Absent Today",
      value: absentCount,
      color: "red",
      trend: { direction: "down", value: 3, label: "fewer than yesterday" }
    },
    {
      icon: TrendingUp,
      label: "Attendance Rate",
      value: `${attendancePercentage}%`,
      color: "cyan",
      subtext: `${presentCount} out of ${totalStudents}`,
      trend: { direction: "up", value: 2.5, label: "vs previous week" }
    }
  ];

  const tableColumns = [
    { key: "timestamp", label: "Date & Time", sortable: true },
    { key: "name", label: "Student Name", sortable: true },
    { key: "roll", label: "Roll Number", sortable: true },
    { key: "status", label: "Status", sortable: true }
  ];

  const tableData = attendance.map((item) => {
    const dateObj = new Date(item.timestamp);
    return {
      id: item.id,
      timestamp:
        dateObj.toLocaleDateString() +
        " " +
        dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      name: item.student_name || "Unknown",
      roll: item.student_roll || "N/A",
      status: item.status || "Unknown"
    };
  });

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-1">Dashboard</h1>
          <p className="text-slate-400">Overview of today's attendance performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold">Today's Attendance Records</h2>
              <p className="text-slate-400 text-sm">View detailed student check-ins</p>
            </div>
          </div>

          <FilterBar
            filters={{ tab: selectedTab }}
            onFilterChange={handleFilterChange}
            tabs={[
              { id: "all", label: "All Records" },
              { id: "present", label: "Present" },
              { id: "absent", label: "Absent" },
              { id: "late", label: "Late" }
            ]}
          />

          <DataTable columns={tableColumns} data={tableData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
