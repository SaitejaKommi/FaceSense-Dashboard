import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar({ isOpen = true }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/students", label: "Students", icon: Users },
    { path: "/attendance", label: "Attendance", icon: Clock },
    { path: "/classes", label: "Classes", icon: BookOpen },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`
        bg-[#0D0F2A] border-r border-slate-800 h-screen flex flex-col
        transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        hidden md:flex
      `}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wide transition-all">
          {isOpen ? "FaceSense" : "FS"}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white border-l-4 border-blue-300"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                }`}
              />

              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
