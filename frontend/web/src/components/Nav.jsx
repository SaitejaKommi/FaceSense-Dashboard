import React, { useState, useEffect, useRef } from "react";
import { LogOut, Menu, X, LayoutDashboard, Users, Clock, BookOpen, BarChart3, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { username, logout } = useAuth()

  const mobileRef = useRef(null);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout()
      navigate("/login");
    }, 700);
  };

  // Close mobile menu when clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Navigation Items for Mobile
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
    <nav className="h-16 bg-[#0A0B1F] border-b border-white/10 text-white w-full sticky top-0 z-50 shadow-lg">
      <div className="h-full px-4 md:px-6 flex justify-between items-center max-w-[1920px] mx-auto">

        {/* LEFT SIDE - Mobile Logo Only (Desktop sets it in Sidebar) */}
        <div className="flex items-center gap-3 md:hidden">
          <div
            onClick={() => navigate("/dashboard")}
            className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md cursor-pointer"
          >
            <span className="text-xl font-bold">FS</span>
          </div>
          <span className="font-semibold text-lg tracking-wide">FaceSense</span>
        </div>

        {/* Desktop Spacer to push right content */}
        <div className="hidden md:block flex-1"></div>

        {/* CENTER/RIGHT SIDE - Username and Logout Button */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* User Profile Pill */}
          <div className="flex items-center gap-3 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              {username ? username[0].toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium text-gray-200">
              {username || 'User'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
            title="Logout"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-red-400 border-t-transparent animate-spin rounded-full block"></span>
            ) : (
              <LogOut className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="absolute top-16 left-0 right-0 bg-[#0A0B1F] border-b border-white/10 shadow-2xl flex flex-col md:hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
                      ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                  {username ? username[0].toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {username || 'User'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-4 py-3 rounded-lg border border-red-600/20 transition-all text-sm font-medium disabled:opacity-50"
            >
              <LogOut size={16} />
              {loading ? "Logging out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
