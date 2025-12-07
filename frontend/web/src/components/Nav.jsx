import React, { useState, useEffect, useRef } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const navigate = useNavigate();
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

  return (
    <nav className="h-16 bg-[#0A0B1F]/80 backdrop-blur-lg border-b border-white/10 text-white sticky top-0 z-50 shadow-lg shadow-black/10">
      <div className="h-full px-6 flex justify-between items-center">
        
        {/* LEFT SIDE - Project Name Only */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:scale-105 transition-all cursor-pointer"
          >
            <span className="text-2xl font-bold">FS</span>
          </div>
        </div>

        {/* CENTER/RIGHT SIDE - Username and Logout Button */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          {/* Username Display */}
          <span className="text-2xl font-medium text-gray- 5000">
            {username || 'User'}
          </span>

          {/* Logout Button - Far Right */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-600/30 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-red-400 border-t-transparent animate-spin rounded-full"></span>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="absolute top-16 left-0 right-0 bg-[#0A0B1F]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-fadeIn"
        >
          {/* Mobile Username */}
          <span className="text-sm font-medium text-gray-300">
            {username || 'User'}
          </span>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-600/30 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-red-400 border-t-transparent animate-spin rounded-full"></span>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </nav>
  );
}
